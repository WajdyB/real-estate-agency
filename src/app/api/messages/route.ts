import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { notifyNewMessage, sendMessageConfirmation } from '@/lib/notifications'

// Validation schema for query parameters
const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  sortBy: z.enum(['createdAt', 'updatedAt', 'subject', 'name']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  status: z.enum(['PENDING', 'READ', 'REPLIED', 'CLOSED']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or agent
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    // Build where clause
    const where: any = {}

    if (query.search) {
      where.OR = [
        { subject: { contains: query.search } },
        { name: { contains: query.search } },
        { message: { contains: query.search } },
      ]
    }

    if (query.status) {
      where.status = query.status
    }

    // Get total count
    const total = await prisma.message.count({ where })

    // Calculate pagination
    const skip = (query.page - 1) * query.limit
    const totalPages = Math.ceil(total / query.limit)

    // Get messages
    const messages = await prisma.message.findMany({
      where,
      select: {
        id: true,
        subject: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        status: true,
        response: true,
        priority: true,
        propertyType: true,
        budget: true,
        timeframe: true,
        propertyId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            city: true,
          }
        }
      },
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      skip,
      take: query.limit,
    })

    return NextResponse.json({
      success: true,
      data: messages.map(message => ({
        id: message.id,
        subject: message.subject,
        sender: message.name,
        senderEmail: message.email,
        content: message.message,
        status: message.status,
        priority: message.priority || 'MEDIUM',
        date: message.createdAt.toISOString(),
        propertyId: message.propertyId,
        propertyTitle: message.property?.title || null,
        propertyType: message.propertyType,
        budget: message.budget,
        timeframe: message.timeframe,
        phone: message.phone,
        response: message.response,
      })),
      pagination: {
        page: query.page,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPrevPage: query.page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// Validation schema for creating a message
const createMessageSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message content is required'),
  propertyType: z.string().optional(),
  budget: z.string().optional(),
  timeframe: z.string().optional(),
  propertyId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = createMessageSchema.parse(body)

    // Get or create a default user for public submissions
    let userId: string
    
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      userId = session.user.id
    } else {
      // For public submissions, create or find a default user
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'public@agence-premium.tn' }
      })
      
      if (!defaultUser) {
        // Create default user for public submissions
        const newUser = await prisma.user.create({
          data: {
            name: 'Public User',
            email: 'public@agence-premium.tn',
            password: 'hashed_password_here', // In production, use proper hashing
            role: 'CLIENT',
            isActive: true,
          }
        })
        userId = newUser.id
      } else {
        userId = defaultUser.id
      }
    }

    // Get property title if propertyId is provided
    let propertyTitle: string | undefined
    if (validatedData.propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: validatedData.propertyId },
        select: { title: true }
      })
      propertyTitle = property?.title
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        userId: userId,
        subject: validatedData.subject,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
        propertyType: validatedData.propertyType,
        budget: validatedData.budget,
        timeframe: validatedData.timeframe,
        propertyId: validatedData.propertyId,
        status: 'PENDING',
        priority: 'MEDIUM',
      },
      select: {
        id: true,
        subject: true,
        name: true,
        email: true,
        message: true,
        status: true,
        priority: true,
        propertyType: true,
        budget: true,
        timeframe: true,
        propertyId: true,
        createdAt: true,
      },
    })

    // Send notifications (non-blocking)
    try {
      // Notify admin/agents about new message
      await notifyNewMessage({
        messageId: message.id,
        senderName: message.name,
        senderEmail: message.email,
        subject: message.subject,
        content: message.message,
        propertyTitle
      })

      // Send confirmation to client
      await sendMessageConfirmation({
        messageId: message.id,
        senderName: message.name,
        senderEmail: message.email,
        subject: message.subject,
        content: message.message,
        propertyTitle
      })
    } catch (error) {
      console.error('Error sending notifications:', error)
      // Don't fail the request if notifications fail
    }

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        subject: message.subject,
        sender: message.name,
        senderEmail: message.email,
        content: message.message,
        status: message.status,
        priority: message.priority || 'MEDIUM',
        date: message.createdAt.toISOString(),
        propertyId: message.propertyId,
        propertyType: message.propertyType,
        budget: message.budget,
        timeframe: message.timeframe,
        phone: message.phone,
      },
    })
  } catch (error) {
    console.error('Error creating message:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    )
  }
}
