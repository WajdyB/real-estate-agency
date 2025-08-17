'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react'

// Mock data - en production, ces données viendraient de l'API
const stats = [
  {
    title: 'Propriétés actives',
    value: '24',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Building2,
  },
  {
    title: 'Nouveaux clients',
    value: '156',
    change: '+23%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Revenus ce mois',
    value: '€47,500',
    change: '+8%',
    changeType: 'positive' as const,
    icon: CreditCard,
  },
  {
    title: 'Taux de conversion',
    value: '12.5%',
    change: '-2%',
    changeType: 'negative' as const,
    icon: TrendingUp,
  },
]

const recentProperties = [
  {
    id: '1',
    title: 'Appartement moderne 3 pièces',
    price: 485000,
    status: 'AVAILABLE',
    views: 45,
    favorites: 8,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Maison familiale avec jardin',
    price: 1250000,
    status: 'RESERVED',
    views: 89,
    favorites: 12,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Studio lumineux - Quartier Latin',
    price: 295000,
    status: 'AVAILABLE',
    views: 23,
    favorites: 3,
    createdAt: '2024-01-05',
  },
]

const recentActivities = [
  {
    type: 'property',
    title: 'Nouvelle propriété ajoutée',
    description: 'Villa contemporaine avec piscine - Cannes',
    time: 'Il y a 2 heures',
    icon: Building2,
  },
  {
    type: 'user',
    title: 'Nouvel utilisateur inscrit',
    description: 'Marie Dubois a créé un compte',
    time: 'Il y a 4 heures',
    icon: Users,
  },
  {
    type: 'message',
    title: 'Nouveau message reçu',
    description: 'Demande d\'information pour l\'appartement Paris 15ème',
    time: 'Il y a 6 heures',
    icon: MessageSquare,
  },
  {
    type: 'appointment',
    title: 'Rendez-vous planifié',
    description: 'Visite prévue demain à 14h30',
    time: 'Il y a 8 heures',
    icon: Calendar,
  },
]

export default function AdminDashboard() {
  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
      AVAILABLE: 'success',
      RESERVED: 'warning',
      SOLD: 'destructive',
      RENTED: 'secondary',
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Réservé',
      SOLD: 'Vendu',
      RENTED: 'Loué',
    }
    return labels[status] || status
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble de votre activité immobilière
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une propriété
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ml-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  vs mois dernier
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Propriétés récentes</CardTitle>
            <Button variant="outline" size="sm">
              Voir toutes
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="font-semibold text-primary-600">
                        {formatPrice(property.price)}
                      </span>
                      <Badge variant={getStatusColor(property.status)} className="text-xs">
                        {getStatusLabel(property.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {property.views} vues
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {property.favorites} favoris
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performances mensuelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Graphique des performances</p>
              <p className="text-sm text-gray-500">
                Intégration avec une bibliothèque de graphiques recommandée
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
