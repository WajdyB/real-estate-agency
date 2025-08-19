import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Helper function to generate unique filename
function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `blog-${timestamp}-${random}.${extension}`
}

// Helper function to validate file type
function validateFileType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  return allowedTypes.includes(file.type)
}

// Helper function to validate file size (3MB max)
function validateFileSize(file: File): boolean {
  const maxSizeBytes = 3 * 1024 * 1024 // 3MB
  return file.size <= maxSizeBytes
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user can upload blog images (ADMIN only)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 })
    }

    const uploadedFiles: string[] = []
    const errors: string[] = []

    for (const file of files) {
      try {
        // Validate file type
        if (!validateFileType(file)) {
          errors.push(`${file.name}: Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed`)
          continue
        }

        // Validate file size
        if (!validateFileSize(file)) {
          errors.push(`${file.name}: File too large. Maximum size is 3MB`)
          continue
        }

        // Generate unique filename
        const fileName = generateFileName(file.name)
        
        // Create upload directory
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'blog')
        await mkdir(uploadDir, { recursive: true })

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filePath = join(uploadDir, fileName)
        
        await writeFile(filePath, buffer)
        
        // Store relative path for database
        const relativePath = `/uploads/blog/${fileName}`
        uploadedFiles.push(relativePath)

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        errors.push(`${file.name}: Upload failed`)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        uploadedFiles,
        errors: errors.length > 0 ? errors : undefined,
        totalUploaded: uploadedFiles.length,
        totalErrors: errors.length
      }
    })

  } catch (error) {
    console.error('Error uploading blog images:', error)
    return NextResponse.json(
      { success: false, error: 'Blog image upload failed' },
      { status: 500 }
    )
  }
}

// GET endpoint for rich text editor image picker
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user can view blog images (ADMIN only)
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // This is a simplified implementation
    // In production, you'd want to store file metadata in the database
    // and implement proper pagination by reading the filesystem or database
    
    return NextResponse.json({
      success: true,
      data: {
        images: [], // Would contain array of blog images with metadata
        pagination: {
          page,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    })

  } catch (error) {
    console.error('Error listing blog images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to list blog images' },
      { status: 500 }
    )
  }
}
