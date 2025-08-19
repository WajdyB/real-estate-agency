import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { notifyNewAppointment } from '@/lib/notifications'

// Validation schema for creating an appointment
const createAppointmentSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  notes: z.string().optional(),
})

// GET /api/appointments - List user appointments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user) {
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
    const sortBy = searchParams.get('sortBy') || 'date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where: any = { userId: session.user.id }

    // Status filter
    if (status) {
      where.status = status
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch user appointments with pagination
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

// POST /api/appointments - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createAppointmentSchema.parse(body)

    // Check if property exists and is published
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
      select: { id: true, isPublished: true, user: { select: { id: true } } }
    })

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    if (!property.isPublished) {
      return NextResponse.json(
        { success: false, error: 'Cannot schedule appointment for unpublished property' },
        { status: 400 }
      )
    }

    // Validate date (must be in the future)
    const appointmentDate = new Date(validatedData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (appointmentDate < today) {
      return NextResponse.json(
        { success: false, error: 'Appointment date must be in the future' },
        { status: 400 }
      )
    }

    // Check if user already has an appointment for this property on the same date
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        propertyId: validatedData.propertyId,
        userId: session.user.id,
        date: appointmentDate,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'You already have an appointment for this property on this date' },
        { status: 400 }
      )
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        propertyId: validatedData.propertyId,
        userId: session.user.id,
        date: appointmentDate,
        time: validatedData.time,
        notes: validatedData.notes,
        status: 'PENDING',
      },
      select: {
        id: true,
        date: true,
        time: true,
        notes: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
    })

    // Send notification to agent (if property has an agent)
    if (appointment.property.user) {
      await notifyNewAppointment({
        clientName: appointment.user.name || appointment.user.email,
        clientEmail: appointment.user.email,
        propertyTitle: appointment.property.title,
        appointmentDate: appointment.date.toISOString().split('T')[0],
        appointmentTime: appointment.time,
        status: appointment.status,
        agentName: appointment.property.user.name || undefined,
        agentEmail: appointment.property.user.email,
      })
    }

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment scheduled successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating appointment:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to schedule appointment' },
      { status: 500 }
    )
  }
}
