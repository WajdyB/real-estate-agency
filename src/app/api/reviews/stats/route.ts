import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/reviews/stats - Get review statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId') || ''

    // Build where clause
    const where: any = {}
    if (propertyId) {
      where.propertyId = propertyId
    }

    // Get review statistics
    const [
      totalReviews,
      averageRating,
      ratingDistribution,
      recentReviews,
      topRatedProperties
    ] = await Promise.all([
      // Total reviews
      prisma.review.count({ where }),
      
      // Average rating
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
        _count: { rating: true }
      }),
      
      // Rating distribution
      prisma.review.groupBy({
        by: ['rating'],
        where,
        _count: { rating: true },
        orderBy: { rating: 'asc' }
      }),
      
      // Recent reviews
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          },
          property: {
            select: {
              id: true,
              title: true,
              city: true,
              images: true,
            }
          }
        }
      }),
      
      // Top rated properties (if no specific property)
      propertyId ? null : prisma.property.findMany({
        where: { isPublished: true },
        orderBy: { reviews: { _count: 'desc' } },
        take: 10,
        select: {
          id: true,
          title: true,
          city: true,
          images: true,
          price: true,
          _count: {
            select: { reviews: true }
          },
          reviews: {
            select: { rating: true }
          }
        }
      })
    ])

    // Calculate average rating
    const avgRating = averageRating._avg.rating || 0
    const totalCount = averageRating._count.rating || 0

    // Calculate rating distribution percentages
    const ratingDistributionWithPercentages = ratingDistribution.map(item => ({
      rating: item.rating,
      count: item._count.rating,
      percentage: totalCount > 0 ? Math.round((item._count.rating / totalCount) * 100) : 0
    }))

    // Calculate average ratings for top properties
    const topRatedPropertiesWithAvg = topRatedProperties ? topRatedProperties.map(property => {
      const avgRating = property.reviews.length > 0 
        ? property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length
        : 0
      
      return {
        ...property,
        averageRating: Math.round(avgRating * 10) / 10,
        reviews: undefined // Remove reviews array from response
      }
    }) : []

    const stats = {
      overview: {
        total: totalReviews,
        average: Math.round(avgRating * 10) / 10,
        totalCount
      },
      distribution: ratingDistributionWithPercentages,
      recent: recentReviews,
      topRated: topRatedPropertiesWithAvg,
      generatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching review statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review statistics' },
      { status: 500 }
    )
  }
}
