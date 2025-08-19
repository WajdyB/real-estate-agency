import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for updating settings
const updateSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100, 'Site name must be less than 100 characters').optional(),
  siteDescription: z.string().max(500, 'Site description must be less than 500 characters').optional(),
  siteUrl: z.string().url('Site URL must be a valid URL').optional(),
  contactEmail: z.string().email('Contact email must be a valid email').optional(),
  contactPhone: z.string().max(20, 'Contact phone must be less than 20 characters').optional(),
  contactAddress: z.string().max(200, 'Contact address must be less than 200 characters').optional(),
  socialFacebook: z.string().url('Facebook URL must be a valid URL').optional(),
  socialTwitter: z.string().url('Twitter URL must be a valid URL').optional(),
  socialInstagram: z.string().url('Instagram URL must be a valid URL').optional(),
  socialLinkedin: z.string().url('LinkedIn URL must be a valid URL').optional(),
  googleAnalyticsId: z.string().max(50, 'Google Analytics ID must be less than 50 characters').optional(),
  googleMapsApiKey: z.string().max(200, 'Google Maps API key must be less than 200 characters').optional(),
  stripePublishableKey: z.string().max(200, 'Stripe publishable key must be less than 200 characters').optional(),
  stripeSecretKey: z.string().max(200, 'Stripe secret key must be less than 200 characters').optional(),
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
  requireEmailVerification: z.boolean().optional(),
  maxPropertiesPerUser: z.number().min(1, 'Max properties per user must be at least 1').optional(),
  maxImagesPerProperty: z.number().min(1, 'Max images per property must be at least 1').optional(),
  maxFileSize: z.number().min(1, 'Max file size must be at least 1').optional(),
})

// GET /api/settings - Get application settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeSensitive = searchParams.get('includeSensitive') === 'true'

    // Get all settings
    const settings = await prisma.settings.findMany({
      orderBy: { key: 'asc' }
    })

    // Convert to object format
    const settingsObject: any = {}
    settings.forEach(setting => {
      // Don't include sensitive data unless explicitly requested
      if (setting.key.includes('secret') || setting.key.includes('api_key')) {
        if (includeSensitive) {
          settingsObject[setting.key] = setting.value
        } else {
          settingsObject[setting.key] = setting.value ? '[HIDDEN]' : null
        }
      } else {
        settingsObject[setting.key] = setting.value
      }
    })

    return NextResponse.json({
      success: true,
      data: settingsObject
    })

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update application settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication and admin role
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = updateSettingsSchema.parse(body)

    // Update settings
    const updatePromises = Object.entries(validatedData).map(([key, value]) => {
      return prisma.settings.upsert({
        where: { key },
        update: { value: value?.toString() || '' },
        create: { key, value: value?.toString() || '' }
      })
    })

    await Promise.all(updatePromises)

    // Get updated settings
    const updatedSettings = await prisma.settings.findMany({
      orderBy: { key: 'asc' }
    })

    const settingsObject: any = {}
    updatedSettings.forEach(setting => {
      if (setting.key.includes('secret') || setting.key.includes('api_key')) {
        settingsObject[setting.key] = '[HIDDEN]'
      } else {
        settingsObject[setting.key] = setting.value
      }
    })

    return NextResponse.json({
      success: true,
      data: settingsObject,
      message: 'Settings updated successfully'
    })

  } catch (error) {
    console.error('Error updating settings:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
