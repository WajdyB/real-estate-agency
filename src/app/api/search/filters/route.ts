import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/search/filters - Get available search filters
export async function GET(request: NextRequest) {
  try {
    // Get all available filter options
    const [cities, categories, priceRange, surfaceRange, features] = await Promise.all([
      // Cities
      prisma.property.findMany({
        where: { isPublished: true },
        select: { city: true },
        distinct: ['city'],
        orderBy: { city: 'asc' }
      }),
      
      // Property types
      prisma.property.findMany({
        where: { isPublished: true },
        select: { type: true },
        distinct: ['type'],
        orderBy: { type: 'asc' }
      }),
      
      // Price range
      prisma.property.aggregate({
        where: { isPublished: true },
        _min: { price: true },
        _max: { price: true }
      }),
      
      // Surface range
      prisma.property.aggregate({
        where: { isPublished: true },
        _min: { surface: true },
        _max: { surface: true }
      }),
      
      // Features
      prisma.property.findMany({
        where: { isPublished: true },
        select: { features: true }
      })
    ])

    // Extract unique features
    const allFeatures = features
      .flatMap(property => property.features || [])
      .filter((feature, index, self) => self.indexOf(feature) === index)
      .sort()

    // Get property counts by type
    const propertyCounts = await prisma.property.groupBy({
      by: ['type'],
      where: { isPublished: true },
      _count: { id: true }
    })

    const filters = {
      cities: cities.map(c => c.city).filter(Boolean),
      propertyTypes: categories.map(c => c.type).filter(Boolean),
      priceRange: {
        min: Math.floor(Number(priceRange._min.price || 0) / 1000) * 1000,
        max: Math.ceil(Number(priceRange._max.price || 0) / 1000) * 1000
      },
      surfaceRange: {
        min: Math.floor(surfaceRange._min.surface || 0),
        max: Math.ceil(surfaceRange._max.surface || 0)
      },
      features: allFeatures,
      propertyTypeCounts: propertyCounts.map(pt => ({
        type: pt.type,
        count: pt._count.id
      })),
      bedrooms: [1, 2, 3, 4, 5, 6],
      bathrooms: [1, 2, 3, 4, 5]
    }

    return NextResponse.json({
      success: true,
      data: filters
    })

  } catch (error) {
    console.error('Error fetching search filters:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch filters' },
      { status: 500 }
    )
  }
}
