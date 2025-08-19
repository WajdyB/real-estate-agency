import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendReplyNotification } from '@/lib/notifications'

// Validation schema for updating a message
const updateMessageSchema = z.object({
  status: z.enum(['PENDING', 'READ', 'REPLIED', 'CLOSED']).optional(),
  response: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  subject: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get message by ID
    const message = await prisma.message.findUnique({
      where: { id: params.id },
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
    })

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 })
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
        propertyTitle: message.property?.title || null,
        propertyType: message.propertyType,
        budget: message.budget,
        timeframe: message.timeframe,
        phone: message.phone,
        response: message.response,
      },
    })
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch message' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateMessageSchema.parse(body)

    // Update message
    const message = await prisma.message.update({
      where: { id: params.id },
      data: validatedData,
      select: {
        id: true,
        subject: true,
        name: true,
        email: true,
        message: true,
        status: true,
        response: true,
        priority: true,
        propertyType: true,
        budget: true,
        timeframe: true,
        propertyId: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Send reply notification if this is a reply
    if (validatedData.response && validatedData.status === 'REPLIED') {
      try {
        await sendReplyNotification(
          message.email,
          message.name,
          message.subject,
          validatedData.response
        )
      } catch (error) {
        console.error('Error sending reply notification:', error)
        // Don't fail the request if notification fails
      }
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
        response: message.response,
      },
    })
  } catch (error) {
    console.error('Error updating message:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if message exists
    const existingMessage = await prisma.message.findUnique({
      where: { id: params.id },
    })

    if (!existingMessage) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 })
    }

    // Delete message
    await prisma.message.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
