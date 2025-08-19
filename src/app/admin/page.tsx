'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Calendar, 
  FileText,
  TrendingUp,
  Eye,
  Loader2,
  TrendingDown
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface DashboardStats {
  properties: {
    total: number
    published: number
    draft: number
    change: number
  }
  users: {
    total: number
    active: number
    change: number
  }
  payments: {
    total: number
    thisMonth: number
    change: number
  }
  messages: {
    total: number
    unread: number
    change: number
  }
}

interface RecentActivity {
  id: string
  action: string
  description: string
  time: string
  type: 'property' | 'message' | 'payment' | 'user'
}

interface ApiResponse {
  success: boolean
  data: {
    stats: DashboardStats
    recentActivity: RecentActivity[]
  }
  error?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/dashboard')
      const data: ApiResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dashboard data')
      }

      setStats(data.data.stats)
      setRecentActivity(data.data.recentActivity)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
        <Button onClick={fetchDashboardData}>Réessayer</Button>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statsCards = [
    {
      title: 'Propriétés',
      value: stats.properties.total.toString(),
      change: `${stats.properties.change > 0 ? '+' : ''}${stats.properties.change}%`,
      changeType: stats.properties.change >= 0 ? 'positive' : 'negative',
      icon: Home,
      href: '/admin/properties',
      subtitle: `${stats.properties.published} publiées, ${stats.properties.draft} brouillons`
    },
    {
      title: 'Utilisateurs',
      value: stats.users.total.toString(),
      change: `${stats.users.change > 0 ? '+' : ''}${stats.users.change}%`,
      changeType: stats.users.change >= 0 ? 'positive' : 'negative',
      icon: Users,
      href: '/admin/users',
      subtitle: `${stats.users.active} actifs`
    },
    {
      title: 'Paiements',
      value: formatPrice(stats.payments.total),
      change: `${stats.payments.change > 0 ? '+' : ''}${stats.payments.change}%`,
      changeType: stats.payments.change >= 0 ? 'positive' : 'negative',
      icon: CreditCard,
      href: '/admin/payments',
      subtitle: `${formatPrice(stats.payments.thisMonth)} ce mois`
    },
    {
      title: 'Messages',
      value: stats.messages.total.toString(),
      change: `${stats.messages.change > 0 ? '+' : ''}${stats.messages.change}%`,
      changeType: stats.messages.change >= 0 ? 'positive' : 'negative',
      icon: MessageSquare,
      href: '/admin/messages',
      subtitle: `${stats.messages.unread} non lus`
    }
  ]

  const getActivityIcon = (type: string) => {
    const icons: Record<string, any> = {
      property: Home,
      message: MessageSquare,
      payment: CreditCard,
      user: Users
    }
    return icons[type] || FileText
  }

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      property: 'bg-blue-100 text-blue-600',
      message: 'bg-green-100 text-green-600',
      payment: 'bg-purple-100 text-purple-600',
      user: 'bg-orange-100 text-orange-600'
    }
    return colors[type] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre agence immobilière</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getActivityColor(stat.title.toLowerCase())}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent activity */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
            <Link href="/admin/analytics">
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/properties/new">
              <Button className="w-full justify-start">
                <Home className="w-4 h-4 mr-2" />
                Nouvelle propriété
              </Button>
            </Link>
            <Link href="/admin/appointments">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Gérer les RDV
              </Button>
            </Link>
            <Link href="/admin/messages">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
