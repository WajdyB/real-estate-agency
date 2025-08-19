import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for creating a property
const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'LOFT', 'VILLA', 'COMMERCIAL', 'LAND', 'PARKING']),
  surface: z.number().positive('Surface must be positive'),
  rooms: z.number().min(0, 'Rooms must be non-negative'),
  bedrooms: z.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: z.number().min(0, 'Bathrooms must be non-negative'),
  floor: z.number().optional(),
  totalFloors: z.number().optional(),
  yearBuilt: z.number().optional(),
  energyClass: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().default('Tunisia'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  features: z.record(z.any()).optional(),
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  virtualTour: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})

// GET /api/properties - List properties with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Check authentication to determine what properties to show
    const session = await getServerSession(authOptions)
    const isAdminOrAgent = session?.user?.role === 'ADMIN' || session?.user?.role === 'AGENT'
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const minSurface = searchParams.get('minSurface') ? parseInt(searchParams.get('minSurface')!) : undefined
    const rooms = searchParams.get('rooms') ? parseInt(searchParams.get('rooms')!) : undefined
    const city = searchParams.get('city') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const featured = searchParams.get('featured') === 'true'
    const publishedParam = searchParams.get('published')
    const isPublished = searchParams.get('isPublished')

    // Build where clause
    const where: any = {}

    // Handle published filter
    if (publishedParam === 'true') {
      where.isPublished = true
    } else if (publishedParam === 'false') {
      where.isPublished = false
    } else if (isPublished === 'true') {
      where.isPublished = true
    } else if (isPublished === 'false') {
      where.isPublished = false
    } else {
      // Default behavior: show only published properties for public access
      // Show all properties for admin/agent access
      if (!isAdminOrAgent) {
        where.isPublished = true
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
      ]
    }

    // Type filter
    if (type) {
      where.type = type
    }

    // Status filter
    if (status) {
      where.status = status
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    // Surface filter
    if (minSurface !== undefined) {
      where.surface = { gte: minSurface }
    }

    // Rooms filter
    if (rooms !== undefined) {
      where.rooms = { gte: rooms }
    }

    // City filter
    if (city) {
      where.city = { contains: city }
    }

    // Featured filter
    if (featured) {
      where.isFeatured = true
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
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}

// POST /api/properties - Create new property (admin/agent only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check permissions (only ADMIN and AGENT can create properties)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createPropertySchema.parse(body)

    // Create property
    const property = await prisma.property.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        publishedAt: validatedData.isPublished ? new Date() : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: property,
      message: 'Property created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating property:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    )
  }
}
