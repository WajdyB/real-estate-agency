import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/payments/stats - Get payment statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication and admin role
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date filter
    const dateFilter: any = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) {
        dateFilter.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        dateFilter.createdAt.lte = new Date(endDate)
      }
    }

    // Get total payments and amounts
    const [totalPayments, totalAmount, completedPayments, completedAmount] = await Promise.all([
      prisma.payment.count({ where: dateFilter }),
      prisma.payment.aggregate({
        where: dateFilter,
        _sum: { amount: true }
      }),
      prisma.payment.count({ 
        where: { 
          ...dateFilter,
          status: 'SUCCEEDED' 
        } 
      }),
      prisma.payment.aggregate({
        where: { 
          ...dateFilter,
          status: 'SUCCEEDED' 
        },
        _sum: { amount: true }
      })
    ])

    // Get payments by status
    const paymentsByStatus = await prisma.payment.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { id: true },
      _sum: { amount: true }
    })

    // Get payments by type
    const paymentsByType = await prisma.payment.groupBy({
      by: ['type'],
      where: dateFilter,
      _count: { id: true },
      _sum: { amount: true }
    })

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      where: dateFilter,
      orderBy: { createdAt: 'desc' },
      take: 5,
              select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          type: true,
          createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        property: {
          select: {
            title: true,
            city: true,
          }
        }
      }
    })

    // Get monthly revenue (last 12 months)
    const monthlyRevenue = await prisma.payment.groupBy({
      by: ['createdAt'],
      where: {
        ...dateFilter,
        status: 'SUCCEEDED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), 0, 1) // Start of current year
        }
      },
      _sum: { amount: true }
    })

    // Process monthly data
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const monthPayments = monthlyRevenue.filter(p => 
        new Date(p.createdAt).getMonth() === i
      )
      const total = monthPayments.reduce((sum, p) => sum + Number(p._sum.amount || 0), 0)
      return {
        month: month,
        revenue: total
      }
    })

    // Calculate conversion rate
    const conversionRate = totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0

    // Calculate average payment amount
    const averageAmount = completedPayments > 0 ? Number(completedAmount._sum.amount || 0) / completedPayments : 0

    const stats = {
      overview: {
        totalPayments,
        totalAmount: totalAmount._sum.amount || 0,
        completedPayments,
        completedAmount: completedAmount._sum.amount || 0,
        conversionRate: Math.round(conversionRate * 100) / 100,
        averageAmount: Math.round(averageAmount * 100) / 100
      },
      byStatus: paymentsByStatus.map(item => ({
        status: item.status,
        count: item._count.id,
        amount: item._sum.amount || 0
      })),
      byType: paymentsByType.map(item => ({
        type: item.type,
        count: item._count?.id || 0,
        amount: item._sum?.amount || 0
      })),
      recentPayments,
      monthlyRevenue: monthlyData
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching payment statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payment statistics' },
      { status: 500 }
    )
  }
}
