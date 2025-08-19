import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for updating a payment
const updatePaymentSchema = z.object({
  status: z.enum(['PENDING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REFUNDED']).optional(),
  stripePaymentId: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  metadata: z.record(z.string()).optional(),
})

// GET /api/payments/[id] - Get single payment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payment = await prisma.payment.findUnique({
      where: { id },
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
              address: true,
              city: true,
            }
          }
        }
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to view this payment
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT' && payment.user.id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: payment
    })

  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}

// PUT /api/payments/[id] - Update payment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params
    const body = await request.json()

    // Check authentication and admin role
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Validate input
    const validatedData = updatePaymentSchema.parse(body)

    // Check if payment exists
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
      select: { id: true, status: true, userId: true }
    })

    if (!existingPayment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Update payment
    const payment = await prisma.payment.update({
      where: { id },
      data: validatedData,
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
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Payment updated successfully'
    })

  } catch (error) {
    console.error('Error updating payment:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/[id] - Cancel payment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if payment exists
    const payment = await prisma.payment.findUnique({
      where: { id },
      select: { id: true, status: true, userId: true, amount: true }
    })

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to cancel this payment
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT' && payment.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Check if payment can be cancelled
    if (payment.status === 'SUCCEEDED' || payment.status === 'REFUNDED') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel succeeded or refunded payment' },
        { status: 400 }
      )
    }

    // Cancel payment (soft delete by updating status)
    await prisma.payment.update({
      where: { id },
      data: { status: 'CANCELED' }
    })

    return NextResponse.json({
      success: true,
      message: `Payment of ${payment.amount}€ cancelled successfully`
    })

  } catch (error) {
    console.error('Error cancelling payment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel payment' },
      { status: 500 }
    )
  }
}
