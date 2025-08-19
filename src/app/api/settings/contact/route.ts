import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/settings/contact - Get contact information
export async function GET(request: NextRequest) {
  try {
    // Get contact-related settings
    const contactSettings = await prisma.settings.findMany({
      where: {
        key: {
          in: [
            'contactEmail',
            'contactPhone',
            'contactAddress',
            'socialFacebook',
            'socialTwitter',
            'socialInstagram',
            'socialLinkedin',
            'siteName',
            'siteDescription'
          ]
        }
      },
      orderBy: { key: 'asc' }
    })

    // Convert to object format
    const contactInfo: any = {}
    contactSettings.forEach(setting => {
      contactInfo[setting.key] = setting.value
    })

    return NextResponse.json({
      success: true,
      data: contactInfo
    })

  } catch (error) {
    console.error('Error fetching contact information:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact information' },
      { status: 500 }
    )
  }
}
