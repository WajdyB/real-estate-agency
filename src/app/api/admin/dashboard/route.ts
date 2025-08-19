import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Get current date and last month date
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    // Get properties statistics
    const [
      totalProperties,
      publishedProperties,
      draftProperties,
      lastMonthProperties,
      totalUsers,
      activeUsers,
      lastMonthUsers,
      totalPayments,
      thisMonthPayments,
      lastMonthPayments,
      totalMessages,
      unreadMessages,
      lastMonthMessages,
    ] = await Promise.all([
      // Properties
      prisma.property.count(),
      prisma.property.count({ where: { isPublished: true } }),
      prisma.property.count({ where: { isPublished: false } }),
      prisma.property.count({ where: { createdAt: { gte: lastMonth } } }),
      
      // Users
      prisma.user.count(),
      prisma.user.count({
        where: {
          OR: [
            { properties: { some: {} } },
            { reviews: { some: {} } },
            { appointments: { some: {} } },
          ]
        }
      }),
      prisma.user.count({ where: { createdAt: { gte: lastMonth } } }),
      
      // Payments
      prisma.payment.aggregate({
        _sum: { amount: true }
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { 
          createdAt: { 
            gte: new Date(now.getFullYear(), now.getMonth(), 1) 
          } 
        }
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: lastMonth } }
      }),
      
      // Messages
      prisma.message.count(),
      prisma.message.count({ where: { status: 'PENDING' } }),
      prisma.message.count({ where: { createdAt: { gte: lastMonth } } }),
    ])

    // Calculate percentage changes
    const propertyChange = lastMonthProperties > 0 
      ? Math.round(((totalProperties - lastMonthProperties) / lastMonthProperties) * 100)
      : totalProperties > 0 ? 100 : 0

    const userChange = lastMonthUsers > 0
      ? Math.round(((totalUsers - lastMonthUsers) / lastMonthUsers) * 100)
      : totalUsers > 0 ? 100 : 0

    const paymentChange = lastMonthPayments._sum.amount && Number(lastMonthPayments._sum.amount) > 0
      ? Math.round(((Number(totalPayments._sum.amount || 0) - Number(lastMonthPayments._sum.amount)) / Number(lastMonthPayments._sum.amount)) * 100)
      : totalPayments._sum.amount && Number(totalPayments._sum.amount) > 0 ? 100 : 0

    const messageChange = lastMonthMessages > 0
      ? Math.round(((totalMessages - lastMonthMessages) / lastMonthMessages) * 100)
      : totalMessages > 0 ? 100 : 0

    // Get recent activity
    const recentActivity = await Promise.all([
      // Recent properties
      prisma.property.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          user: { select: { name: true } }
        }
      }),
      
      // Recent messages
      prisma.message.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          subject: true,
          name: true,
          createdAt: true
        }
      }),
      
      // Recent payments
      prisma.payment.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          type: true,
          createdAt: true,
          user: { select: { name: true } }
        }
      }),
      
      // Recent users
      prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      })
    ])

    // Combine and format recent activity
    const allActivity = [
      ...recentActivity[0].map(property => ({
        id: property.id,
        action: 'Nouvelle propriété ajoutée',
        description: `${property.title} par ${property.user?.name || 'Utilisateur'}`,
        time: property.createdAt.toISOString(),
        type: 'property' as const
      })),
      ...recentActivity[1].map(message => ({
        id: message.id,
        action: 'Nouveau message reçu',
        description: `${message.subject} de ${message.name}`,
        time: message.createdAt.toISOString(),
        type: 'message' as const
      })),
      ...recentActivity[2].map(payment => ({
        id: payment.id,
        action: 'Nouveau paiement',
        description: `${Number(payment.amount).toLocaleString('fr-FR')}€ - ${payment.type} par ${payment.user?.name || 'Utilisateur'}`,
        time: payment.createdAt.toISOString(),
        type: 'payment' as const
      })),
      ...recentActivity[3].map(user => ({
        id: user.id,
        action: 'Nouvel utilisateur inscrit',
        description: `${user.name || user.email}`,
        time: user.createdAt.toISOString(),
        type: 'user' as const
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          properties: {
            total: totalProperties,
            published: publishedProperties,
            draft: draftProperties,
            change: propertyChange,
          },
          users: {
            total: totalUsers,
            active: activeUsers,
            change: userChange,
          },
          payments: {
            total: Number(totalPayments._sum.amount || 0),
            thisMonth: Number(thisMonthPayments._sum.amount || 0),
            change: paymentChange,
          },
          messages: {
            total: totalMessages,
            unread: unreadMessages,
            change: messageChange,
          },
        },
        recentActivity: allActivity,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
