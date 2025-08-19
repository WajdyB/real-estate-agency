import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user can delete media (AGENT/ADMIN)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { id } = params
    
    // In a real implementation, you would:
    // 1. Look up the file metadata in the database using the ID
    // 2. Verify the user has permission to delete this specific file
    // 3. Get the file path from the database record
    // 4. Delete the file from the filesystem
    // 5. Remove the database record

    // For this implementation, we'll assume the ID is the filename
    // and perform basic validation
    
    if (!id || id.includes('..') || id.includes('/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file identifier' 
      }, { status: 400 })
    }

    // Try to determine file type and construct path
    let filePath: string
    
    if (id.startsWith('avatar-')) {
      filePath = join(process.cwd(), 'public', 'uploads', 'avatars', id)
    } else if (id.startsWith('blog-')) {
      filePath = join(process.cwd(), 'public', 'uploads', 'blog', id)
    } else {
      // Assume it's a property image
      filePath = join(process.cwd(), 'public', 'uploads', 'property', id)
    }

    try {
      await unlink(filePath)
      
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'File not found or could not be deleted' 
      }, { status: 404 })
    }

  } catch (error) {
    console.error('Error in media deletion:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve file metadata
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    
    // Basic validation
    if (!id || id.includes('..') || id.includes('/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file identifier' 
      }, { status: 400 })
    }

    // In a real implementation, you would look up file metadata in the database
    // For now, we'll return basic information based on the filename
    
    let type: string
    let category: string
    
    if (id.startsWith('avatar-')) {
      type = 'avatar'
      category = 'user'
    } else if (id.startsWith('blog-')) {
      type = 'blog'
      category = 'content'
    } else {
      type = 'property'
      category = 'listing'
    }

    return NextResponse.json({
      success: true,
      data: {
        id,
        filename: id,
        type,
        category,
        url: `/uploads/${type}/${id}`,
        // In a real implementation, you'd include:
        // size, uploadedAt, uploadedBy, mimeType, etc.
      }
    })

  } catch (error) {
    console.error('Error retrieving media metadata:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve media metadata' },
      { status: 500 }
    )
  }
}
