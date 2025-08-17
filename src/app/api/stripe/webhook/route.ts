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
    console.error('Erreur de vérification du webhook:', error)
    return NextResponse.json(
      { error: 'Signature du webhook invalide' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        await prisma.payment.update({
          where: { stripePaymentId: paymentIntent.id },
          data: { status: 'SUCCEEDED' }
        })

        // Si c'est une réservation, marquer la propriété comme réservée
        if (paymentIntent.metadata.type === 'RESERVATION') {
          await prisma.property.update({
            where: { id: paymentIntent.metadata.propertyId },
            data: { status: 'RESERVED' }
          })
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        
        await prisma.payment.update({
          where: { stripePaymentId: failedPayment.id },
          data: { status: 'FAILED' }
        })
        break

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object as Stripe.PaymentIntent
        
        await prisma.payment.update({
          where: { stripePaymentId: canceledPayment.id },
          data: { status: 'CANCELED' }
        })
        break

      default:
        console.log(`Type d'événement non géré: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
