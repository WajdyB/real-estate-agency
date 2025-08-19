import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/analytics/reports - Generate detailed reports
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
    const reportType = searchParams.get('type') || 'overview'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const format = searchParams.get('format') || 'json'

    // Calculate date range
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)

    let reportData: any = {}

    switch (reportType) {
      case 'properties':
        reportData = await generatePropertyReport(start, end)
        break
      case 'users':
        reportData = await generateUserReport(start, end)
        break
      case 'financial':
        reportData = await generateFinancialReport(start, end)
        break
      case 'performance':
        reportData = await generatePerformanceReport(start, end)
        break
      default:
        reportData = await generateOverviewReport(start, end)
    }

    return NextResponse.json({
      success: true,
      data: reportData,
      metadata: {
        reportType,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        generatedAt: new Date().toISOString(),
        generatedBy: session.user.name
      }
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

// Property Report
async function generatePropertyReport(start: Date, end: Date) {
  const [totalProperties, publishedProperties, soldProperties, averagePrice, priceRange] = await Promise.all([
    prisma.property.count({
      where: { createdAt: { gte: start, lte: end } }
    }),
    prisma.property.count({
      where: { 
        createdAt: { gte: start, lte: end },
        isPublished: true 
      }
    }),
    prisma.property.count({
      where: { 
        createdAt: { gte: start, lte: end },
        status: 'SOLD' 
      }
    }),
    prisma.property.aggregate({
      where: { 
        createdAt: { gte: start, lte: end },
        isPublished: true 
      },
      _avg: { price: true }
    }),
    prisma.property.aggregate({
      where: { 
        createdAt: { gte: start, lte: end },
        isPublished: true 
      },
      _min: { price: true },
      _max: { price: true }
    })
  ])

  // Properties by type
  const propertiesByType = await prisma.property.groupBy({
    by: ['type'],
    where: { 
      createdAt: { gte: start, lte: end },
      isPublished: true 
    },
    _count: { id: true },
    _avg: { price: true }
  })

  // Properties by city
  const propertiesByCity = await prisma.property.groupBy({
    by: ['city'],
    where: { 
      createdAt: { gte: start, lte: end },
      isPublished: true 
    },
    _count: { id: true },
    _avg: { price: true }
  })

  // Top performing properties
  const topProperties = await prisma.property.findMany({
    where: { 
      createdAt: { gte: start, lte: end },
      isPublished: true 
    },
    orderBy: { views: 'desc' },
    take: 10,
    select: {
      id: true,
      title: true,
      price: true,
      views: true,
      city: true,
      type: true,
      createdAt: true,
      _count: {
        select: {
          favorites: true,
          reviews: true
        }
      }
    }
  })

  return {
    summary: {
      totalProperties,
      publishedProperties,
      soldProperties,
      averagePrice: averagePrice._avg.price || 0,
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 0
      }
    },
    byType: propertiesByType.map(pt => ({
      type: pt.type,
      count: pt._count.id,
      averagePrice: pt._avg.price || 0
    })),
    byCity: propertiesByCity.map(pc => ({
      city: pc.city,
      count: pc._count.id,
      averagePrice: pc._avg.price || 0
    })),
    topProperties
  }
}

// User Report
async function generateUserReport(start: Date, end: Date) {
  const [totalUsers, newUsers, activeUsers, userRoles] = await Promise.all([
    prisma.user.count({
      where: { createdAt: { gte: start, lte: end } }
    }),
    prisma.user.count({
      where: { createdAt: { gte: start, lte: end } }
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: start, lte: end },
        OR: [
          { properties: { some: {} } },
          { favorites: { some: {} } },
          { appointments: { some: {} } },
          { reviews: { some: {} } }
        ]
      }
    }),
    prisma.user.groupBy({
      by: ['role'],
      where: { createdAt: { gte: start, lte: end } },
      _count: { id: true }
    })
  ])

  // User engagement metrics
  const [usersWithProperties, usersWithFavorites, usersWithAppointments, usersWithReviews] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: { gte: start, lte: end },
        properties: { some: {} }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: start, lte: end },
        favorites: { some: {} }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: start, lte: end },
        appointments: { some: {} }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: start, lte: end },
        reviews: { some: {} }
      }
    })
  ])

  // Top active users
  const topUsers = await prisma.user.findMany({
    where: { createdAt: { gte: start, lte: end } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          properties: true,
          favorites: true,
          appointments: true,
          reviews: true
        }
      }
    },
    orderBy: {
      properties: { _count: 'desc' }
    },
    take: 10
  })

  return {
    summary: {
      totalUsers,
      newUsers,
      activeUsers,
      usersWithProperties,
      usersWithFavorites,
      usersWithAppointments,
      usersWithReviews
    },
    byRole: userRoles.map(ur => ({
      role: ur.role,
      count: ur._count.id
    })),
    topUsers
  }
}

// Financial Report
async function generateFinancialReport(start: Date, end: Date) {
  const [totalRevenue, completedPayments, pendingPayments, failedPayments] = await Promise.all([
    prisma.payment.aggregate({
      where: { 
        status: 'SUCCEEDED',
        createdAt: { gte: start, lte: end }
      },
      _sum: { amount: true }
    }),
    prisma.payment.count({
      where: { 
        status: 'SUCCEEDED',
        createdAt: { gte: start, lte: end }
      }
    }),
    prisma.payment.count({
      where: { 
        status: 'PENDING',
        createdAt: { gte: start, lte: end }
      }
    }),
    prisma.payment.count({
      where: { 
        status: 'FAILED',
        createdAt: { gte: start, lte: end }
      }
    })
  ])

  // Payments by type
  const paymentsByType = await prisma.payment.groupBy({
    by: ['type'],
    where: { 
      status: 'SUCCEEDED',
      createdAt: { gte: start, lte: end }
    },
    _count: { id: true },
    _sum: { amount: true }
  })

  // Monthly revenue
  const monthlyRevenue = await getMonthlyRevenue(start, end)

  // Top revenue properties
  const topRevenueProperties = await prisma.payment.groupBy({
    by: ['propertyId'],
    where: { 
      status: 'SUCCEEDED',
      createdAt: { gte: start, lte: end }
    },
    _sum: { amount: true },
    orderBy: {
      _sum: { amount: 'desc' }
    },
    take: 10
  })

  return {
    summary: {
      totalRevenue: totalRevenue._sum?.amount || 0,
      completedPayments,
      pendingPayments,
      failedPayments,
      averagePayment: completedPayments > 0 ? Number(totalRevenue._sum?.amount || 0) / completedPayments : 0
    },
    byType: paymentsByType.map(pt => ({
      type: pt.type,
      count: pt._count?.id || 0,
      total: pt._sum?.amount || 0
    })),
    monthlyRevenue,
    topRevenueProperties
  }
}

// Performance Report
async function generatePerformanceReport(start: Date, end: Date) {
  const [totalViews, totalFavorites, totalAppointments, totalReviews] = await Promise.all([
    prisma.property.aggregate({
      where: { 
        isPublished: true,
        createdAt: { gte: start, lte: end }
      },
      _sum: { views: true }
    }),
    prisma.favorite.count({
      where: { createdAt: { gte: start, lte: end } }
    }),
    prisma.appointment.count({
      where: { createdAt: { gte: start, lte: end } }
    }),
    prisma.review.count({
      where: { createdAt: { gte: start, lte: end } }
    })
  ])

  // Average ratings
  const averageRating = await prisma.review.aggregate({
    where: { createdAt: { gte: start, lte: end } },
    _avg: { rating: true }
  })

  // Conversion rates
  const conversionRates = {
    viewsToFavorites: totalViews._sum.views ? (totalFavorites / totalViews._sum.views) * 100 : 0,
    viewsToAppointments: totalViews._sum.views ? (totalAppointments / totalViews._sum.views) * 100 : 0,
    viewsToReviews: totalViews._sum.views ? (totalReviews / totalViews._sum.views) * 100 : 0
  }

  return {
    summary: {
      totalViews: totalViews._sum.views || 0,
      totalFavorites,
      totalAppointments,
      totalReviews,
      averageRating: averageRating._avg.rating || 0
    },
    conversionRates,
    engagementMetrics: {
      favoritesPerProperty: totalFavorites / Math.max(1, totalViews._sum.views || 1),
      appointmentsPerProperty: totalAppointments / Math.max(1, totalViews._sum.views || 1),
      reviewsPerProperty: totalReviews / Math.max(1, totalViews._sum.views || 1)
    }
  }
}

// Overview Report
async function generateOverviewReport(start: Date, end: Date) {
  const [propertyReport, userReport, financialReport, performanceReport] = await Promise.all([
    generatePropertyReport(start, end),
    generateUserReport(start, end),
    generateFinancialReport(start, end),
    generatePerformanceReport(start, end)
  ])

  return {
    propertyReport,
    userReport,
    financialReport,
    performanceReport
  }
}

// Helper function to get monthly revenue
async function getMonthlyRevenue(start: Date, end: Date) {
  const months = []
  const current = new Date(start)
  
  while (current <= end) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 1)
    
    const revenue = await prisma.payment.aggregate({
      where: {
        status: 'SUCCEEDED',
        createdAt: { gte: monthStart, lt: monthEnd }
      },
      _sum: { amount: true }
    })

    months.push({
      month: current.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      revenue: revenue._sum?.amount || 0
    })

    current.setMonth(current.getMonth() + 1)
  }

  return months
}
