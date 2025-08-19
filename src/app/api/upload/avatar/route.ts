import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'

// Helper function to generate unique filename
function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `avatar-${timestamp}-${random}.${extension}`
}

// Helper function to validate file type
function validateFileType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return allowedTypes.includes(file.type)
}

// Helper function to validate file size (2MB max)
function validateFileSize(file: File): boolean {
  const maxSizeBytes = 2 * 1024 * 1024 // 2MB
  return file.size <= maxSizeBytes
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!validateFileType(file)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' 
      }, { status: 400 })
    }

    // Validate file size
    if (!validateFileSize(file)) {
      return NextResponse.json({ 
        success: false, 
        error: 'File too large. Maximum size is 2MB' 
      }, { status: 400 })
    }

    // Get current user to check for existing avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    })

    // Generate unique filename
    const fileName = generateFileName(file.name)
    
    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    await mkdir(uploadDir, { recursive: true })

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)
    
    // Store relative path for database
    const relativePath = `/uploads/avatars/${fileName}`

    // Update user's avatar in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: relativePath }
    })

    // Delete old avatar file if it exists and is not a default/external image
    if (currentUser?.image && currentUser.image.startsWith('/uploads/avatars/')) {
      try {
        const oldFilePath = join(process.cwd(), 'public', currentUser.image)
        await unlink(oldFilePath)
      } catch (error) {
        // Ignore errors when deleting old file (it might not exist)
        console.log('Could not delete old avatar file:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        avatarUrl: relativePath,
        message: 'Avatar updated successfully'
      }
    })

  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { success: false, error: 'Avatar upload failed' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to remove avatar
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    })

    if (!currentUser?.image || !currentUser.image.startsWith('/uploads/avatars/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'No custom avatar to delete' 
      }, { status: 400 })
    }

    // Remove avatar from database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null }
    })

    // Delete file from filesystem
    try {
      const filePath = join(process.cwd(), 'public', currentUser.image)
      await unlink(filePath)
    } catch (error) {
      // Ignore file deletion errors
      console.log('Could not delete avatar file:', error)
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar removed successfully'
    })

  } catch (error) {
    console.error('Error deleting avatar:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete avatar' },
      { status: 500 }
    )
  }
}
