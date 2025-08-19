import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { 
  sendAppointmentConfirmation, 
  sendAppointmentCancellation, 
  sendAppointmentCompletion 
} from '@/lib/notifications'

// Validation schema for updating an appointment
const updateAppointmentSchema = z.object({
  date: z.string().min(1, 'Date is required').optional(),
  time: z.string().min(1, 'Time is required').optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED']).optional(),
})

// GET /api/appointments/[id] - Get single appointment
export async function GET(
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

    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        userId: session.user.id
      },
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
    })

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: appointment
    })

  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
}

// PUT /api/appointments/[id] - Update appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = params
    const body = await request.json()

    // Check authentication
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate input
    const validatedData = updateAppointmentSchema.parse(body)

    // Check if appointment exists and belongs to user
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      select: { id: true, status: true }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Prevent updates to cancelled appointments
    if (existingAppointment.status === 'CANCELED') {
      return NextResponse.json(
        { success: false, error: 'Cannot update cancelled appointments' },
        { status: 400 }
      )
    }

    // Validate date if being updated
    if (validatedData.date) {
      const appointmentDate = new Date(validatedData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (appointmentDate < today) {
        return NextResponse.json(
          { success: false, error: 'Appointment date must be in the future' },
          { status: 400 }
        )
      }
    }

    // Update appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: validatedData,
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

    // Send notifications based on status change
    if (validatedData.status) {
      const notificationData = {
        clientName: appointment.user.name || appointment.user.email,
        clientEmail: appointment.user.email,
        propertyTitle: appointment.property.title,
        appointmentDate: appointment.date.toISOString().split('T')[0],
        appointmentTime: appointment.time,
        status: appointment.status,
      }

      switch (validatedData.status) {
        case 'CONFIRMED':
          await sendAppointmentConfirmation(notificationData)
          break
        case 'CANCELED':
          await sendAppointmentCancellation(notificationData)
          break
        case 'COMPLETED':
          await sendAppointmentCompletion(notificationData)
          break
      }
    }

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully'
    })

  } catch (error) {
    console.error('Error updating appointment:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

// DELETE /api/appointments/[id] - Cancel appointment
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

    // Check if appointment exists and belongs to user
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      select: { id: true, status: true, property: { select: { title: true } } }
    })

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Cancel appointment (soft delete by updating status)
    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELED' }
    })

    return NextResponse.json({
      success: true,
      message: `Appointment for "${appointment.property.title}" cancelled successfully`
    })

  } catch (error) {
    console.error('Error cancelling appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel appointment' },
      { status: 500 }
    )
  }
}
