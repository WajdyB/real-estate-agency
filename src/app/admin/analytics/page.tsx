'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Home,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/lib/utils'

// Types for analytics data
interface AnalyticsData {
  overview: {
    totalProperties: number
    publishedProperties: number
    soldProperties: number
    averagePrice: number
    totalViews: number
    totalUsers: number
    newUsers: number
    activeUsers: number
    totalRevenue: number
    completedPayments: number
    pendingPayments: number
    totalFavorites: number
    totalAppointments: number
    totalReviews: number
  }
  trends: {
    monthly: Array<{
      month: string
      properties: number
      users: number
      revenue: number
      views: number
    }>
  }
  topProperties: Array<{
    id: string
    title: string
    price: number
    views: number
    city: string
    _count: {
      favorites: number
      reviews: number
    }
  }>
  propertyTypes: Array<{
    type: string
    count: number
  }>
  propertyCities: Array<{
    city: string
    count: number
    totalValue: number
  }>
  recentActivity: {
    properties: Array<{
      id: string
      title: string
      price: number
      createdAt: string
      agent: {
        name: string
      }
    }>
    users: Array<{
      id: string
      name: string
      email: string
      createdAt: string
      role: string
    }>
    payments: Array<{
      id: string
      amount: number
      createdAt: string
      user: {
        name: string
      }
      property: {
        title: string
      }
    }>
    reviews: Array<{
      id: string
      rating: number
      comment: string
      createdAt: string
      user: {
        name: string
      }
      property: {
        title: string
      }
    }>
  }
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/analytics?period=${selectedPeriod}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch analytics')
      }

      setAnalyticsData(data.data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [selectedPeriod])

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
  }

  // Generate report
  const handleGenerateReport = async (type: string) => {
    try {
      const response = await fetch(`/api/analytics/reports?type=${type}&period=${selectedPeriod}`)
      const data = await response.json()

      if (data.success) {
        // In a real app, you might download this as a file
        console.log(`${type} report:`, data.data)
        alert(`${type} report generated successfully!`)
      }
    } catch (err) {
      console.error('Error generating report:', err)
      alert('Failed to generate report')
    }
  }

  // Fetch data on mount and when period changes
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingDown className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={fetchAnalytics}>Réessayer</Button>
      </div>
    )
  }

  if (!analyticsData) {
    return null
  }

  const { overview, trends, topProperties, propertyTypes, propertyCities, recentActivity } = analyticsData

  // Calculate percentage changes (mock for now)
  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const stats = [
    {
      title: 'Vues totales',
      value: overview.totalViews.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Propriétés publiées',
      value: overview.publishedProperties.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: Home,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Favoris ajoutés',
      value: overview.totalFavorites.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: Heart,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Revenus totaux',
      value: formatPrice(overview.totalRevenue),
      change: '+5.7%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const getChangeIcon = (changeType: string) => {
    return changeType === 'positive' 
      ? <ArrowUpRight className="w-4 h-4 text-green-600" />
      : <ArrowDownRight className="w-4 h-4 text-red-600" />
  }

  const getChangeColor = (changeType: string) => {
    return changeType === 'positive' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Analytics & Statistiques</h1>
          <p className="text-gray-600">Suivez les performances de votre plateforme immobilière</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
            <option value="365">Cette année</option>
          </select>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" onClick={() => handleGenerateReport('overview')}>
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {getChangeIcon(stat.changeType)}
                  <span className={`text-sm font-medium ml-1 ${getChangeColor(stat.changeType)}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">vs période précédente</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Utilisateurs</h4>
            <p className="text-3xl font-bold text-blue-600">{overview.totalUsers}</p>
            <p className="text-sm text-gray-600 mt-2">
              {overview.newUsers} nouveaux ({selectedPeriod}j)
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <Home className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Propriétés</h4>
            <p className="text-3xl font-bold text-green-600">{overview.totalProperties}</p>
            <p className="text-sm text-gray-600 mt-2">
              {overview.soldProperties} vendues
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Paiements</h4>
            <p className="text-3xl font-bold text-purple-600">{overview.completedPayments}</p>
            <p className="text-sm text-gray-600 mt-2">
              {overview.pendingPayments} en attente
            </p>
          </div>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendances mensuelles</h3>
            <Button variant="outline" size="sm" onClick={() => handleGenerateReport('performance')}>
              Rapport
            </Button>
          </div>
          <div className="space-y-4">
            {trends.monthly.slice(-6).map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{month.month}</span>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-blue-600">{month.properties} propriétés</span>
                  <span className="text-green-600">{month.users} utilisateurs</span>
                  <span className="text-purple-600">{formatPrice(month.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Property distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Distribution par type</h3>
            <Button variant="outline" size="sm" onClick={() => handleGenerateReport('properties')}>
              Rapport
            </Button>
          </div>
          <div className="space-y-3">
            {propertyTypes.map((type) => (
              <div key={type.type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{type.type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(type.count / overview.totalProperties) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{type.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top performing properties */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Propriétés les plus performantes</h3>
          <Button variant="outline" size="sm">
            Voir toutes
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propriété
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Favoris
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.views.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property._count.favorites}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property._count.reviews}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatPrice(property.price)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </div>
        <div className="space-y-4">
          {/* Recent properties */}
          {recentActivity.properties.slice(0, 3).map((property) => (
            <div key={property.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouvelle propriété ajoutée</p>
                <p className="text-sm text-gray-600">{property.title} - {formatPrice(property.price)}</p>
              </div>
              <span className="text-xs text-gray-500">{formatDate(property.createdAt)}</span>
            </div>
          ))}
          
          {/* Recent payments */}
          {recentActivity.payments.slice(0, 2).map((payment) => (
            <div key={payment.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Paiement reçu</p>
                <p className="text-sm text-gray-600">{formatPrice(payment.amount)} - {payment.property.title}</p>
              </div>
              <span className="text-xs text-gray-500">{formatDate(payment.createdAt)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
