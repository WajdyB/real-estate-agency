'use client'

import React, { useState } from 'react'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Mail,
  Eye,
  Reply,
  Archive,
  Trash2,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock data - replace with real data from your API
  const messages = [
    {
      id: 1,
      subject: 'Demande de visite - Appartement Paris 15ème',
      sender: 'Marie Dubois',
      senderEmail: 'marie.dubois@email.com',
      content: 'Bonjour, je suis intéressée par l\'appartement 3 pièces à Paris 15ème. Serait-il possible d\'organiser une visite ?',
      status: 'unread',
      priority: 'high',
      date: '2024-01-20T10:30:00',
      propertyId: 'PROP-001',
      propertyTitle: 'Appartement 3 pièces - Paris 15ème'
    },
    {
      id: 2,
      subject: 'Question sur la villa à Nice',
      sender: 'Jean Martin',
      senderEmail: 'jean.martin@email.com',
      content: 'Bonjour, j\'aimerais des informations supplémentaires sur la villa à Nice. Quels sont les frais de notaire ?',
      status: 'read',
      priority: 'medium',
      date: '2024-01-19T14:15:00',
      propertyId: 'PROP-002',
      propertyTitle: 'Villa avec piscine - Nice'
    },
    {
      id: 3,
      subject: 'Réservation pour location courte durée',
      sender: 'Sophie Bernard',
      senderEmail: 'sophie.bernard@email.com',
      content: 'Je souhaite réserver le studio à Lyon pour la semaine du 15 au 22 février. Est-ce disponible ?',
      status: 'replied',
      priority: 'high',
      date: '2024-01-18T09:45:00',
      propertyId: 'PROP-003',
      propertyTitle: 'Studio moderne - Lyon'
    },
    {
      id: 4,
      subject: 'Demande de devis pour achat',
      sender: 'Pierre Moreau',
      senderEmail: 'pierre.moreau@email.com',
      content: 'Bonjour, pouvez-vous me faire un devis détaillé pour l\'achat de la maison à Bordeaux ?',
      status: 'archived',
      priority: 'low',
      date: '2024-01-17T16:20:00',
      propertyId: 'PROP-004',
      propertyTitle: 'Maison familiale - Bordeaux'
    }
  ]

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || message.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      unread: 'destructive',
      read: 'default',
      replied: 'secondary',
      archived: 'secondary'
    }
    
    const labels: Record<string, string> = {
      unread: 'Non lu',
      read: 'Lu',
      replied: 'Répondu',
      archived: 'Archivé'
    }

    return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    }
    
    const labels: Record<string, string> = {
      high: 'Haute',
      medium: 'Moyenne',
      low: 'Basse'
    }

    return <Badge variant={variants[priority] || 'secondary'}>{labels[priority] || priority}</Badge>
  }

  const getUnreadCount = () => {
    return messages.filter(m => m.status === 'unread').length
  }

  const getHighPriorityCount = () => {
    return messages.filter(m => m.priority === 'high').length
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('fr-FR')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestion des messages</h1>
          <p className="text-gray-600">Gérez toutes les demandes et questions de vos clients</p>
        </div>
        <Button>
          <Mail className="w-4 h-4 mr-2" />
          Nouveau message
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Non lus</p>
              <p className="text-2xl font-bold text-gray-900">{getUnreadCount()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Priorité haute</p>
              <p className="text-2xl font-bold text-gray-900">{getHighPriorityCount()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{filteredMessages.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par sujet ou expéditeur..."
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
              <option value="unread">Non lu</option>
              <option value="read">Lu</option>
              <option value="replied">Répondu</option>
              <option value="archived">Archivé</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </Card>

      {/* Messages list */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className={`p-6 ${message.status === 'unread' ? 'border-l-4 border-l-red-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{message.subject}</h3>
                  {getStatusBadge(message.status)}
                  {getPriorityBadge(message.priority)}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {message.sender} ({message.senderEmail})
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(message.date)}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Propriété :</strong> {message.propertyTitle}
                  </p>
                  <p className="text-gray-700">{message.content}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Reply className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredMessages.length}</span> sur{' '}
          <span className="font-medium">{messages.length}</span> résultats
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Précédent
          </Button>
          <Button variant="outline" size="sm" disabled>
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
