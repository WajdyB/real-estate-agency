import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for creating a payment
const createPaymentSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('eur'),
  type: z.enum(['RESERVATION', 'DEPOSIT', 'COMMISSION', 'SERVICE']),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  metadata: z.record(z.string()).optional(),
})

// GET /api/payments - List payments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const propertyId = searchParams.get('propertyId') || ''
    const userId = searchParams.get('userId') || ''
    const status = searchParams.get('status') || ''
    const paymentMethod = searchParams.get('paymentMethod') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    // Role-based filtering
    if (session.user.role === 'ADMIN' || session.user.role === 'AGENT') {
      // Admin/Agent can see all payments
      if (propertyId) {
        where.propertyId = propertyId
      }
      if (userId) {
        where.userId = userId
      }
    } else {
      // Regular users can only see their own payments
      where.userId = session.user.id
      if (propertyId) {
        where.propertyId = propertyId
      }
    }

    // Status filter
    if (status) {
      where.status = status
    }

    // Payment type filter
    if (paymentMethod) {
      where.type = paymentMethod
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch payments with pagination
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          type: true,
          stripePaymentId: true,
          description: true,
          metadata: true,
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
              images: true,
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: payments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      }
    })

  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create new payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createPaymentSchema.parse(body)

    // Check if property exists and is published
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
      select: { id: true, title: true, price: true, isPublished: true }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    if (!property.isPublished) {
      return NextResponse.json(
        { success: false, error: 'Cannot create payment for unpublished property' },
        { status: 400 }
      )
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'PENDING',
        type: validatedData.type,
        stripePaymentId: `temp_${Date.now()}`, // Temporary ID, should be replaced with actual Stripe payment ID
        description: validatedData.description,
        metadata: validatedData.metadata,
        userId: session.user.id,
        propertyId: validatedData.propertyId,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        type: true,
        description: true,
        createdAt: true,
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
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating payment:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
