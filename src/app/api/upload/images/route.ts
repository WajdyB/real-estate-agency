import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'

// Validation schema
const uploadSchema = z.object({
  propertyId: z.string().nullable().optional(),
  type: z.enum(['property', 'avatar', 'blog']).default('property'),
})

// Helper function to generate unique filename
function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${random}.${extension}`
}

// Helper function to validate file type
function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

// Helper function to validate file size (in MB)
function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
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
    const files = formData.getAll('files') as File[]
    const type = formData.get('type') as string || 'property'
    const propertyId = formData.get('propertyId') as string | null

    // Check if user can upload based on type
    if (type === 'property' && session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json({ success: false, error: 'Forbidden - Only agents and admins can upload property images' }, { status: 403 })
    }
    if (type === 'blog' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden - Only admins can upload blog images' }, { status: 403 })
    }
    // Avatar uploads are allowed for all authenticated users

    // Validate input
    const validatedData = uploadSchema.parse({ propertyId, type })

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 })
    }

    // File type restrictions based on upload type
    const allowedTypes = {
      property: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      avatar: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      blog: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    }

    const maxSizes = {
      property: 5, // 5MB
      avatar: 2,   // 2MB
      blog: 3      // 3MB
    }

    const uploadedFiles: string[] = []
    const errors: string[] = []

    for (const file of files) {
      try {
        // Validate file type
        if (!validateFileType(file, allowedTypes[type as keyof typeof allowedTypes])) {
          errors.push(`${file.name}: Invalid file type. Allowed: ${allowedTypes[type as keyof typeof allowedTypes].join(', ')}`)
          continue
        }

        // Validate file size
        if (!validateFileSize(file, maxSizes[type as keyof typeof maxSizes])) {
          errors.push(`${file.name}: File too large. Maximum size: ${maxSizes[type as keyof typeof maxSizes]}MB`)
          continue
        }

        // Generate unique filename
        const fileName = generateFileName(file.name)
        
        // Create upload directory structure
        const dirName = type === 'avatar' ? 'avatars' : type
        const uploadDir = join(process.cwd(), 'public', 'uploads', dirName)
        await mkdir(uploadDir, { recursive: true })

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filePath = join(uploadDir, fileName)
        
        await writeFile(filePath, buffer)
        
        // Store relative path for database
        const relativePath = `/uploads/${dirName}/${fileName}`
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
    console.error('Error in file upload:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'File upload failed' },
      { status: 500 }
    )
  }
}

// GET endpoint to list uploaded files
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user can view uploads (AGENT/ADMIN)
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'property'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // This is a simplified implementation
    // In production, you'd want to store file metadata in the database
    return NextResponse.json({
      success: true,
      data: {
        files: [],
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
    console.error('Error listing files:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to list files' },
      { status: 500 }
    )
  }
}
