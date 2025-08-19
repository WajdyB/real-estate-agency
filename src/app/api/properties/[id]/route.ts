import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for updating a property
const updatePropertySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val)
      if (isNaN(num)) throw new Error('Price must be a valid number')
      return num
    }
    return val
  }).pipe(z.number().positive('Price must be positive')).optional(),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'LOFT', 'VILLA', 'COMMERCIAL', 'LAND', 'PARKING']).optional(),
  surface: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val)
      if (isNaN(num)) throw new Error('Surface must be a valid number')
      return num
    }
    return val
  }).pipe(z.number().positive('Surface must be positive')).optional(),
  rooms: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val)
      if (isNaN(num)) throw new Error('Rooms must be a valid number')
      return num
    }
    return val
  }).pipe(z.number().min(0, 'Rooms must be non-negative')).optional(),
  bedrooms: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val)
      if (isNaN(num)) throw new Error('Bedrooms must be a valid number')
      return num
    }
    return val
  }).pipe(z.number().min(0, 'Bedrooms must be non-negative')).optional(),
  bathrooms: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val)
      if (isNaN(num)) throw new Error('Bathrooms must be a valid number')
      return num
    }
    return val
  }).pipe(z.number().min(0, 'Bathrooms must be non-negative')).optional(),
  floor: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val)
      if (isNaN(num)) throw new Error('Floor must be a valid number')
      return num
    }
    return val
  }).pipe(z.number()).optional(),
  totalFloors: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val)
      if (isNaN(num)) throw new Error('Total floors must be a valid number')
      return num
    }
    return val
  }).pipe(z.number()).optional(),
  yearBuilt: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseInt(val)
      if (isNaN(num)) throw new Error('Year built must be a valid number')
      return num
    }
    return val
  }).pipe(z.number()).optional(),
  energyClass: z.string().optional(),
  address: z.string().min(1, 'Address is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  zipCode: z.string().min(1, 'Zip code is required').optional(),
  country: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val)
      if (isNaN(num)) throw new Error('Latitude must be a valid number')
      return num
    }
    return val
  }).pipe(z.number()).optional(),
  longitude: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      const num = parseFloat(val)
      if (isNaN(num)) throw new Error('Longitude must be a valid number')
      return num
    }
    return val
  }).pipe(z.number()).optional(),
  features: z.record(z.any()).optional(),
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  virtualTour: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'DRAFT']).optional(),
})

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const property = await prisma.property.findUnique({
      where: { id },
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
            appointments: true,
          }
        },
        reviews: {
          where: { isPublished: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check if user is authenticated and can view unpublished properties
    const session = await getServerSession(authOptions)
    const canViewUnpublished = session?.user && 
      (session.user.role === 'ADMIN' || 
       session.user.role === 'AGENT' || 
       property.userId === session.user.id)

    // If property is not published and user can't view unpublished, return 404
    if (!property.isPublished && !canViewUnpublished) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      data: property
    })

  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT /api/properties/[id] - Update property (admin/agent/owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()

    // Get the property to check permissions
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { userId: true, isPublished: true }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check permissions (ADMIN, AGENT, or property owner can update)
    const canUpdate = session.user.role === 'ADMIN' || 
                     session.user.role === 'AGENT' || 
                     existingProperty.userId === session.user.id

    if (!canUpdate) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Validate input
    const validatedData = updatePropertySchema.parse(body)

    // Prepare update data
    const updateData: any = { ...validatedData }

    // Handle publication status change
    if (validatedData.isPublished !== undefined) {
      if (validatedData.isPublished && !existingProperty.isPublished) {
        updateData.publishedAt = new Date()
      } else if (!validatedData.isPublished) {
        updateData.publishedAt = null
      }
    }

    // Update property
    const property = await prisma.property.update({
      where: { id },
      data: updateData,
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
      message: 'Property updated successfully'
    })

  } catch (error) {
    console.error('Error updating property:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/[id] - Delete property (admin/agent/owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Get the property to check permissions
    const property = await prisma.property.findUnique({
      where: { id },
      select: { userId: true, title: true }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Check permissions (ADMIN, AGENT, or property owner can delete)
    const canDelete = session.user.role === 'ADMIN' || 
                     session.user.role === 'AGENT' || 
                     property.userId === session.user.id

    if (!canDelete) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Delete property (this will cascade delete related records due to Prisma schema)
    await prisma.property.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Property "${property.title}" deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
