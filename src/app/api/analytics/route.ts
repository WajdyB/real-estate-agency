import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/analytics - Get comprehensive analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
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

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Calculate date range
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - parseInt(period) * 24 * 60 * 60 * 1000)

    // Property Analytics
    const [totalProperties, publishedProperties, soldProperties, averagePrice, totalViews] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { isPublished: true } }),
      prisma.property.count({ where: { status: 'SOLD' } }),
      prisma.property.aggregate({
        where: { isPublished: true },
        _avg: { price: true }
      }),
      prisma.property.aggregate({
        where: { isPublished: true },
        _sum: { views: true }
      })
    ])

    // User Analytics
    const [totalUsers, newUsers, activeUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: start }
        }
      }),
      prisma.user.count({
        where: {
          OR: [
            { properties: { some: {} } },
            { favorites: { some: {} } },
            { appointments: { some: {} } },
            { reviews: { some: {} } }
          ]
        }
      })
    ])

    // Financial Analytics
    const [totalRevenue, completedPayments, pendingPayments] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: 'SUCCEEDED' },
        _sum: { amount: true }
      }),
      prisma.payment.count({ where: { status: 'SUCCEEDED' } }),
      prisma.payment.count({ where: { status: 'PENDING' } })
    ])

    // Engagement Analytics
    const [totalFavorites, totalAppointments, totalReviews] = await Promise.all([
      prisma.favorite.count(),
      prisma.appointment.count(),
      prisma.review.count()
    ])

    // Monthly trends (last 12 months)
    const monthlyData = await getMonthlyTrends()

    // Top performing properties
    const topProperties = await prisma.property.findMany({
      where: { isPublished: true },
      orderBy: { views: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        views: true,
        city: true,
        _count: {
          select: {
            favorites: true,
            reviews: true
          }
        }
      }
    })

    // Property distribution by type
    const propertyTypes = await prisma.property.groupBy({
      by: ['type'],
      where: { isPublished: true },
      _count: { id: true }
    })

    // Property distribution by city
    const propertyCities = await prisma.property.groupBy({
      by: ['city'],
      where: { isPublished: true },
      _count: { id: true },
      _sum: { price: true }
    })

    // Recent activity
    const recentActivity = await getRecentActivity()

    const analytics = {
      overview: {
        totalProperties,
        publishedProperties,
        soldProperties,
        averagePrice: averagePrice._avg.price || 0,
        totalViews: totalViews._sum.views || 0,
        totalUsers,
        newUsers,
        activeUsers,
        totalRevenue: totalRevenue._sum.amount || 0,
        completedPayments,
        pendingPayments,
        totalFavorites,
        totalAppointments,
        totalReviews
      },
      trends: {
        monthly: monthlyData
      },
      topProperties,
      propertyTypes: propertyTypes.map(pt => ({
        type: pt.type,
        count: pt._count.id
      })),
      propertyCities: propertyCities.map(pc => ({
        city: pc.city,
        count: pc._count.id,
        totalValue: pc._sum.price || 0
      })),
      recentActivity
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// Helper function to get monthly trends
async function getMonthlyTrends() {
  const months = []
  const now = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    
    const [properties, users, payments, views] = await Promise.all([
      prisma.property.count({
        where: {
          createdAt: { gte: date, lt: nextDate }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: date, lt: nextDate }
        }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          createdAt: { gte: date, lt: nextDate }
        },
        _sum: { amount: true }
      }),
      prisma.property.aggregate({
        where: {
          isPublished: true,
          createdAt: { gte: date, lt: nextDate }
        },
        _sum: { views: true }
      })
    ])

    months.push({
      month: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      properties,
      users,
      revenue: payments._sum.amount || 0,
      views: views._sum.views || 0
    })
  }

  return months
}

// Helper function to get recent activity
async function getRecentActivity() {
  const [recentProperties, recentUsers, recentPayments, recentReviews] = await Promise.all([
    prisma.property.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        createdAt: true,
        user: {
          select: { name: true }
        }
      }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true
      }
    }),
    prisma.payment.findMany({
      where: { status: 'SUCCEEDED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        user: {
          select: { name: true }
        },
        property: {
          select: { title: true }
        }
      }
    }),
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: {
          select: { name: true }
        },
        property: {
          select: { title: true }
        }
      }
    })
  ])

  return {
    properties: recentProperties,
    users: recentUsers,
    payments: recentPayments,
    reviews: recentReviews
  }
}
