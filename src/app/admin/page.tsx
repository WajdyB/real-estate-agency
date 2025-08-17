'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Home, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Calendar, 
  FileText,
  TrendingUp,
  Eye
} from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function AdminDashboard() {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Propriétés',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Home,
      href: '/admin/properties'
    },
    {
      title: 'Utilisateurs',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Users,
      href: '/admin/users'
    },
    {
      title: 'Paiements',
      value: '€12,450',
      change: '+23%',
      changeType: 'positive',
      icon: CreditCard,
      href: '/admin/payments'
    },
    {
      title: 'Messages',
      value: '89',
      change: '+5%',
      changeType: 'positive',
      icon: MessageSquare,
      href: '/admin/messages'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'Nouvelle propriété ajoutée',
      description: 'Appartement 3 pièces à Paris',
      time: 'Il y a 2 heures',
      type: 'property'
    },
    {
      id: 2,
      action: 'Nouveau message reçu',
      description: 'Demande de visite pour villa à Nice',
      time: 'Il y a 4 heures',
      type: 'message'
    },
    {
      id: 3,
      action: 'Paiement reçu',
      description: '€2,500 pour location mensuelle',
      time: 'Il y a 6 heures',
      type: 'payment'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre agence immobilière</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ajouter une propriété</h3>
              <p className="text-gray-600">Créer une nouvelle annonce</p>
            </div>
          </div>
          <Link href="/admin/properties/new" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
            Commencer <TrendingUp className="w-4 h-4 ml-2" />
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gérer les RDV</h3>
              <p className="text-gray-600">Planifier les visites</p>
            </div>
          </div>
          <Link href="/admin/appointments" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
            Voir <Eye className="w-4 h-4 ml-2" />
          </Link>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Blog</h3>
              <p className="text-gray-600">Gérer le contenu</p>
            </div>
          </div>
          <Link href="/admin/blog" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
            Éditer <TrendingUp className="w-4 h-4 ml-2" />
          </Link>
        </Card>
      </div>

      {/* Recent activities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'property' ? 'bg-blue-500' :
                activity.type === 'message' ? 'bg-green-500' : 'bg-purple-500'
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
    </div>
  )
}
