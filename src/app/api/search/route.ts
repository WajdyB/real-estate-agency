import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/search - Advanced property search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const query = searchParams.get('query') || ''
    const type = searchParams.get('type') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const minSurface = searchParams.get('minSurface') ? parseFloat(searchParams.get('minSurface')!) : undefined
    const maxSurface = searchParams.get('maxSurface') ? parseFloat(searchParams.get('maxSurface')!) : undefined
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined
    const bathrooms = searchParams.get('bathrooms') ? parseInt(searchParams.get('bathrooms')!) : undefined
    const city = searchParams.get('city') || ''
    const zipCode = searchParams.get('zipCode') || ''
    const features = searchParams.get('features') ? searchParams.get('features')!.split(',') : []
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    // Build where clause
    const where: any = {
      isPublished: true,
      status: { not: 'SOLD' }
    }

    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { address: { contains: query } },
        { city: { contains: query } },
        { zipCode: { contains: query } },
      ]
    }

    // Type filter
    if (type) {
      where.type = type
    }

    // Category filter (using type instead)
    if (category) {
      where.type = category
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    // Surface range
    if (minSurface !== undefined || maxSurface !== undefined) {
      where.surface = {}
      if (minSurface !== undefined) where.surface.gte = minSurface
      if (maxSurface !== undefined) where.surface.lte = maxSurface
    }

    // Bedrooms filter
    if (bedrooms !== undefined) {
      where.bedrooms = { gte: bedrooms }
    }

    // Bathrooms filter
    if (bathrooms !== undefined) {
      where.bathrooms = { gte: bathrooms }
    }

    // Location filters
    if (city) {
      where.city = { contains: city }
    }

    if (zipCode) {
      where.zipCode = { contains: zipCode }
    }

    // Features filter
    if (features.length > 0) {
      where.features = {
        hasEvery: features
      }
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch properties with pagination
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          surface: true,
          bedrooms: true,
          bathrooms: true,
          type: true,

          status: true,
          address: true,
          city: true,
          zipCode: true,
          images: true,
          features: true,
          views: true,
          createdAt: true,
          updatedAt: true,
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
      }),
      prisma.property.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      }
    })

  } catch (error) {
    console.error('Error in advanced search:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}
