import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { propertyId, amount, type, description } = await request.json()

    // Vérifier que la propriété existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return NextResponse.json({ error: 'Propriété non trouvée' }, { status: 404 })
    }

    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency: 'eur',
      metadata: {
        userId: session.user.id,
        propertyId,
        type,
      },
      description: description || `Paiement pour ${property.title}`,
    })

    // Enregistrer le paiement en base
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        propertyId,
        stripePaymentId: paymentIntent.id,
        amount,
        status: 'PENDING',
        type: type.toUpperCase(),
        description,
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Erreur lors de la création du PaymentIntent:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
