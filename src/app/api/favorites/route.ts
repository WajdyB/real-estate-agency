import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for adding to favorites
const addToFavoritesSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
})

// GET /api/favorites - List user favorites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch user favorites with pagination
    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          property: {
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              type: true,
              status: true,
              surface: true,
              rooms: true,
              bedrooms: true,
              bathrooms: true,
              address: true,
              city: true,
              zipCode: true,
              images: true,
              isPublished: true,
              isFeatured: true,
              views: true,
              createdAt: true,
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
                  appointments: true,
                }
              }
            }
          }
        }
      }),
      prisma.favorite.count({ where: { userId: session.user.id } })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: favorites,
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
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add property to favorites
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

    const body = await request.json()
    
    // Validate input
    const validatedData = addToFavoritesSchema.parse(body)

    // Check if property exists and is published
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
      select: { id: true, isPublished: true }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    if (!property.isPublished) {
      return NextResponse.json(
        { success: false, error: 'Cannot add unpublished property to favorites' },
        { status: 400 }
      )
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        propertyId: validatedData.propertyId,
        userId: session.user.id
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'Property is already in your favorites' },
        { status: 400 }
      )
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        propertyId: validatedData.propertyId,
        userId: session.user.id,
      },
      select: {
        id: true,
        createdAt: true,
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            city: true,
            images: true,
            type: true,
            isPublished: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: favorite,
      message: 'Property added to favorites successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error adding to favorites:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to add to favorites' },
      { status: 500 }
    )
  }
}
