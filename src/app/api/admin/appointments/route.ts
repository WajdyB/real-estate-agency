import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/appointments - List all appointments (admin/agent only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication and admin/agent role
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = {}

    // Status filter
    if (status) {
      where.status = status
    }

    // Search filter
    if (search) {
      where.OR = [
        {
          user: {
            name: {
              contains: search,
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
            }
          }
        },
        {
          property: {
            title: {
              contains: search,
            }
          }
        },
        {
          property: {
            city: {
              contains: search,
            }
          }
        }
      ]
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch all appointments with pagination
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          date: true,
          time: true,
          notes: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            }
          },
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              city: true,
              images: true,
              type: true,
              isPublished: true,
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
          }
        }
      }),
      prisma.appointment.count({ where })
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      success: true,
      data: appointments,
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
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}
