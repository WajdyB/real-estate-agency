import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/properties/[id]/views - Increment property view count
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id },
      select: { id: true, isPublished: true }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Only track views for published properties
    if (!property.isPublished) {
      return NextResponse.json(
        { success: false, error: 'Property not published' },
        { status: 400 }
      )
    }

    // Increment view count
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { views: true }
    })

    return NextResponse.json({
      success: true,
      data: { views: updatedProperty.views },
      message: 'View count updated'
    })

  } catch (error) {
    console.error('Error updating property view count:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update view count' },
      { status: 500 }
    )
  }
}
