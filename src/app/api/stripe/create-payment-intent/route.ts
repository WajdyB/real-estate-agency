import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for payment intent creation
const createPaymentIntentSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('eur'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  metadata: z.record(z.string()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createPaymentIntentSchema.parse(body)

    // Check if property exists and is published
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
      select: { 
        id: true, 
        title: true, 
        price: true, 
        isPublished: true,
        status: true
      }
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

    if (property.status === 'SOLD') {
      return NextResponse.json(
        { success: false, error: 'Cannot create payment for sold property' }, 
        { status: 400 }
      )
    }

    // Create the PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validatedData.amount * 100), // Stripe uses cents
      currency: validatedData.currency,
      metadata: {
        userId: session.user.id,
        propertyId: validatedData.propertyId,
        userEmail: session.user.email || '',
        propertyTitle: property.title,
        ...validatedData.metadata
      },
      description: validatedData.description || `Payment for ${property.title}`,
      receipt_email: session.user.email || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        propertyId: validatedData.propertyId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'PENDING',
        type: 'RESERVATION',
        stripePaymentId: paymentIntent.id,
        description: validatedData.description,
        metadata: validatedData.metadata,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        stripePaymentId: true,
        createdAt: true,
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
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        paymentId: payment.id,
      },
      message: 'Payment intent created successfully'
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
