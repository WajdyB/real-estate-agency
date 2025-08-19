import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/favorites/[id] - Remove property from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if favorite exists and belongs to user
    const favorite = await prisma.favorite.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      select: { id: true, property: { select: { title: true } } }
    })

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      )
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Property "${favorite.property.title}" removed from favorites successfully`
    })

  } catch (error) {
    console.error('Error removing from favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove from favorites' },
      { status: 500 }
    )
  }
}
