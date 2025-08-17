'use client'

import React, { useState } from 'react'
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
  ArrowDownRight
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Vues totales',
      value: '24,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Eye,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Propriétés vues',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: Home,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Favoris ajoutés',
      value: '567',
      change: '+15.3%',
      changeType: 'positive',
      icon: Heart,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Messages reçus',
      value: '89',
      change: '+5.7%',
      changeType: 'positive',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const topProperties = [
    {
      id: 1,
      title: 'Appartement 3 pièces - Paris 15ème',
      views: 1247,
      favorites: 89,
      inquiries: 23,
      price: '€485,000'
    },
    {
      id: 2,
      title: 'Villa avec piscine - Nice',
      views: 892,
      favorites: 67,
      inquiries: 18,
      price: '€1,250,000'
    },
    {
      id: 3,
      title: 'Studio moderne - Lyon',
      views: 756,
      favorites: 45,
      inquiries: 12,
      price: '€295,000'
    },
    {
      id: 4,
      title: 'Maison familiale - Bordeaux',
      views: 634,
      favorites: 38,
      inquiries: 9,
      price: '€650,000'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Nouvelle propriété ajoutée',
      description: 'Appartement 4 pièces à Marseille',
      time: 'Il y a 2 heures',
      type: 'property'
    },
    {
      id: 2,
      action: 'Demande de visite',
      description: 'Villa à Cannes - Client très intéressé',
      time: 'Il y a 4 heures',
      type: 'inquiry'
    },
    {
      id: 3,
      action: 'Paiement reçu',
      description: '€2,500 pour location mensuelle',
      time: 'Il y a 6 heures',
      type: 'payment'
    },
    {
      id: 4,
      action: 'Nouveau client inscrit',
      description: 'Marie Dubois - Recherche appartement Paris',
      time: 'Il y a 8 heures',
      type: 'user'
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
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
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

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Aperçu du trafic</h3>
            <Button variant="outline" size="sm">
              Voir plus
            </Button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Graphique du trafic</p>
              <p className="text-sm text-gray-500">
                Intégration avec une bibliothèque de graphiques recommandée
              </p>
            </div>
          </div>
        </Card>

        {/* Property performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance des propriétés</h3>
            <Button variant="outline" size="sm">
              Voir plus
            </Button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Graphique des performances</p>
              <p className="text-sm text-gray-500">
                Intégration avec une bibliothèque de graphiques recommandée
              </p>
            </div>
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
                  Vues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Favoris
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demandes
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
                    <div className="text-sm text-gray-900">{property.views.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.favorites}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.inquiries}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.price}</div>
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
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'property' ? 'bg-blue-500' :
                activity.type === 'inquiry' ? 'bg-green-500' :
                activity.type === 'payment' ? 'bg-purple-500' : 'bg-orange-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Nouveaux utilisateurs</h4>
            <p className="text-3xl font-bold text-blue-600">+156</p>
            <p className="text-sm text-gray-600 mt-2">Ce mois</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <Home className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Propriétés ajoutées</h4>
            <p className="text-3xl font-bold text-green-600">+24</p>
            <p className="text-sm text-gray-600 mt-2">Ce mois</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Revenus générés</h4>
            <p className="text-3xl font-bold text-purple-600">€12,450</p>
            <p className="text-sm text-gray-600 mt-2">Ce mois</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
