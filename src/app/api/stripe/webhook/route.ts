import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification error:', error)
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update payment status
        await prisma.payment.update({
          where: { stripePaymentId: paymentIntent.id },
          data: { 
            status: 'SUCCEEDED',
            metadata: {
              ...paymentIntent.metadata,
              stripePaymentId: paymentIntent.id,
              processedAt: new Date().toISOString()
            }
          }
        })

        // Send notification to user (you can implement email/SMS here)
        console.log(`Payment succeeded for user: ${paymentIntent.metadata.userId}`)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        
        await prisma.payment.update({
          where: { stripePaymentId: failedPayment.id },
          data: { 
            status: 'FAILED',
            metadata: {
              ...failedPayment.metadata,
              stripePaymentId: failedPayment.id,
              failureReason: failedPayment.last_payment_error?.message || 'Payment failed',
              processedAt: new Date().toISOString()
            }
          }
        })

        console.log(`Payment failed for user: ${failedPayment.metadata.userId}`)
        break

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object as Stripe.PaymentIntent
        
        await prisma.payment.update({
          where: { stripePaymentId: canceledPayment.id },
          data: { 
            status: 'CANCELED',
            metadata: {
              ...canceledPayment.metadata,
              stripePaymentId: canceledPayment.id,
              processedAt: new Date().toISOString()
            }
          }
        })

        console.log(`Payment canceled for user: ${canceledPayment.metadata.userId}`)
        break

      case 'payment_intent.processing':
        const processingPayment = event.data.object as Stripe.PaymentIntent
        
        await prisma.payment.update({
          where: { stripePaymentId: processingPayment.id },
          data: { 
            status: 'PENDING',
            metadata: {
              ...processingPayment.metadata,
              stripePaymentId: processingPayment.id,
              processedAt: new Date().toISOString()
            }
          }
        })

        console.log(`Payment processing for user: ${processingPayment.metadata.userId}`)
        break

      case 'charge.refunded':
        const refundedCharge = event.data.object as Stripe.Charge
        
        // Find payment by charge ID and update status
        await prisma.payment.updateMany({
          where: { 
            stripePaymentId: refundedCharge.payment_intent as string 
          },
          data: { 
            status: 'CANCELED',
            metadata: {
              chargeId: refundedCharge.id,
              refundAmount: refundedCharge.amount_refunded,
              processedAt: new Date().toISOString()
            }
          }
        })

        console.log(`Payment refunded: ${refundedCharge.payment_intent}`)
        break

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription
        console.log(`Subscription created: ${subscription.id}`)
        break

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log(`Subscription updated: ${updatedSubscription.id}`)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log(`Subscription deleted: ${deletedSubscription.id}`)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
