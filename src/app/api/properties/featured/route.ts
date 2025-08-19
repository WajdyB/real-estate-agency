import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/properties/featured - Get featured properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const limit = parseInt(searchParams.get('limit') || '6')
    const city = searchParams.get('city') || ''

    // Build where clause for featured properties
    const where: any = {
      isFeatured: true,
      isPublished: true,
    }

    // Optional city filter
    if (city) {
      where.city = { contains: city }
    }

    // Fetch featured properties
    const properties = await prisma.property.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          }
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length
    })

  } catch (error) {
    console.error('Error fetching featured properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured properties' },
      { status: 500 }
    )
  }
}
