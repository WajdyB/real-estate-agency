'use client'

import React, { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

// Types for payments
interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  stripePaymentIntentId?: string
  description?: string
  metadata?: any
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  property: {
    id: string
    title: string
    price: number
    images: string[]
  }
}

interface PaymentStats {
  overview: {
    totalPayments: number
    totalAmount: number
    completedPayments: number
    completedAmount: number
    conversionRate: number
    averageAmount: number
  }
  byStatus: Array<{
    status: string
    count: number
    amount: number
  }>
  byMethod: Array<{
    method: string
    count: number
    amount: number
  }>
  recentPayments: Payment[]
  monthlyRevenue: Array<{
    month: number
    revenue: number
  }>
}

interface PaymentResponse {
  success: boolean
  data: Payment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

interface StatsResponse {
  success: boolean
  data: PaymentStats
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Fetch payments
  const fetchPayments = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      if (search) {
        params.append('search', search)
      }

      if (status !== 'all') {
        params.append('status', status)
      }

      const response = await fetch(`/api/payments?${params}`)
      const data: PaymentResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch payments')
      }

      setPayments(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching payments:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  // Fetch payment statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/payments/stats')
      const data: StatsResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch payment statistics')
      }

      setStats(data.data)
    } catch (err) {
      console.error('Error fetching payment statistics:', err)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPayments()
    fetchStats()
  }, [])

  // Handle search and status changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPayments(1, searchTerm, selectedStatus)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedStatus])

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchPayments(newPage, searchTerm, selectedStatus)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      COMPLETED: 'default',
      PENDING: 'secondary',
      PROCESSING: 'secondary',
      FAILED: 'destructive',
      CANCELLED: 'destructive',
      REFUNDED: 'secondary'
    }
    
    const labels: Record<string, string> = {
      COMPLETED: 'Complété',
      PENDING: 'En attente',
      PROCESSING: 'En cours',
      FAILED: 'Échoué',
      CANCELLED: 'Annulé',
      REFUNDED: 'Remboursé'
    }

    return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="w-4 h-4" />
      case 'bank_transfer':
        return <span>🏦</span>
      case 'cash':
        return <span>💵</span>
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      stripe: 'Carte bancaire',
      bank_transfer: 'Virement bancaire',
      cash: 'Espèces'
    }
    return labels[method] || method
  }

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Chargement des paiements...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => fetchPayments()}>
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestion des paiements</h1>
          <p className="text-gray-600">Suivez et gérez tous les paiements de votre plateforme</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Summary cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total reçu</p>
                <p className="text-2xl font-bold text-gray-900">€{stats.overview.completedAmount.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">€{(stats.overview.totalAmount - stats.overview.completedAmount).toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overview.totalPayments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overview.conversionRate}%</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters and search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par client ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="COMPLETED">Complété</option>
              <option value="PENDING">En attente</option>
              <option value="PROCESSING">En cours</option>
              <option value="FAILED">Échoué</option>
              <option value="CANCELLED">Annulé</option>
              <option value="REFUNDED">Remboursé</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </Card>

      {/* Payments table */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      ) : payments.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriété
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                        {payment.stripePaymentIntentId && (
                          <div className="text-sm text-gray-500">{payment.stripePaymentIntentId}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.user.name}</div>
                        <div className="text-sm text-gray-500">{payment.user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.property.title}</div>
                        <div className="text-sm text-gray-500">€{payment.property.price.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.amount.toLocaleString()} {payment.currency.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMethodIcon(payment.paymentMethod)}
                        <span className="ml-2 text-sm text-gray-900">{getMethodLabel(payment.paymentMethod)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/admin/payments/${payment.id}`}>
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun paiement trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche.
          </p>
          <Button onClick={() => {
            setSearchTerm('')
            setSelectedStatus('all')
          }}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{(pagination.page - 1) * 10 + 1}</span> à{' '}
            <span className="font-medium">{Math.min(pagination.page * 10, pagination.total)}</span> sur{' '}
            <span className="font-medium">{pagination.total}</span> résultats
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!pagination.hasPrevPage}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Précédent
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
