import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/properties/stats - Get property statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication and permissions
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT')) {
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
      totalProperties,
      publishedProperties,
      draftProperties,
      featuredProperties,
      newPropertiesThisPeriod,
      totalViews,
      viewsThisPeriod,
      propertiesByType,
      propertiesByStatus,
      topViewedProperties,
      recentProperties
    ] = await Promise.all([
      // Total properties
      prisma.property.count(),
      
      // Published properties
      prisma.property.count({ where: { isPublished: true } }),
      
      // Draft properties
      prisma.property.count({ where: { isPublished: false } }),
      
      // Featured properties
      prisma.property.count({ where: { isFeatured: true, isPublished: true } }),
      
      // New properties this period
      prisma.property.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      
      // Total views
      prisma.property.aggregate({
        _sum: { views: true }
      }),
      
      // Views this period (approximation based on recent activity)
      prisma.property.aggregate({
        _sum: { views: true },
        where: {
          updatedAt: { gte: startDate }
        }
      }),
      
      // Properties by type
      prisma.property.groupBy({
        by: ['type'],
        _count: { type: true },
        where: { isPublished: true }
      }),
      
      // Properties by status
      prisma.property.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      
      // Top viewed properties
      prisma.property.findMany({
        where: { isPublished: true },
        orderBy: { views: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          price: true,
          city: true,
          views: true,
          images: true,
          type: true
        }
      }),
      
      // Recent properties
      prisma.property.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          price: true,
          city: true,
          createdAt: true,
          images: true,
          type: true
        }
      })
    ])

    // Calculate average price
    const averagePriceResult = await prisma.property.aggregate({
      _avg: { price: true },
      where: { isPublished: true }
    })

    // Calculate price range
    const priceRangeResult = await prisma.property.aggregate({
      _min: { price: true },
      _max: { price: true },
      where: { isPublished: true }
    })

    const stats = {
      overview: {
        total: totalProperties,
        published: publishedProperties,
        draft: draftProperties,
        featured: featuredProperties,
        newThisPeriod: newPropertiesThisPeriod,
        averagePrice: averagePriceResult._avg.price || 0,
        minPrice: priceRangeResult._min.price || 0,
        maxPrice: priceRangeResult._max.price || 0,
      },
      views: {
        total: totalViews._sum.views || 0,
        thisPeriod: viewsThisPeriod._sum.views || 0,
      },
      byType: propertiesByType.map(item => ({
        type: item.type,
        count: item._count.type
      })),
      byStatus: propertiesByStatus.map(item => ({
        status: item.status,
        count: item._count.status
      })),
      topViewed: topViewedProperties,
      recent: recentProperties,
      period: period,
      generatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching property statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property statistics' },
      { status: 500 }
    )
  }
}
