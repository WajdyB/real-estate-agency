import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/users/stats - Get user statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication and permissions
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // day, week, month, year

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Get basic counts
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersThisPeriod,
      usersByRole,
      topActiveUsers,
      recentUsers,
      userGrowthData
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (users with properties, reviews, or appointments)
      prisma.user.count({
        where: {
          OR: [
            { properties: { some: {} } },
            { reviews: { some: {} } },
            { appointments: { some: {} } }
          ]
        }
      }),
      
      // Inactive users (users without any activity)
      prisma.user.count({
        where: {
          AND: [
            { properties: { none: {} } },
            { reviews: { none: {} } },
            { appointments: { none: {} } }
          ]
        }
      }),
      
      // New users this period
      prisma.user.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      
      // Users by role
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }),
      
      // Top active users (by activity)
      prisma.user.findMany({
        where: {
          OR: [
            { properties: { some: {} } },
            { reviews: { some: {} } },
            { appointments: { some: {} } }
          ]
        },
        orderBy: [
          { properties: { _count: 'desc' } },
          { reviews: { _count: 'desc' } }
        ],
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              properties: true,
              reviews: true,
              favorites: true,
              appointments: true,
            }
          }
        }
      }),
      
      // Recent users
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
        }
      }),
      
      // User growth data (last 12 months)
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: { createdAt: true },
        where: {
          createdAt: {
            gte: new Date(now.getFullYear() - 1, now.getMonth(), 1)
          }
        },
        orderBy: { createdAt: 'asc' }
      })
    ])

    const stats = {
      overview: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        newThisPeriod: newUsersThisPeriod,
        activePercentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      },
      byRole: usersByRole.map(item => ({
        role: item.role,
        count: item._count.role
      })),
      engagement: {
        avgProperties: 0, // Simplified for now
        avgReviews: 0,
        avgFavorites: 0,
        avgAppointments: 0,
      },
      topActive: topActiveUsers,
      recent: recentUsers,
      growth: userGrowthData.map(item => ({
        date: item.createdAt,
        count: item._count.createdAt
      })),
      period: period,
      generatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching user statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user statistics' },
      { status: 500 }
    )
  }
}
