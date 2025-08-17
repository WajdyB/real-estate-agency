'use client'

import React, { useState } from 'react'
import { 
  Calendar, 
  Search, 
  Filter, 
  Clock,
  MapPin,
  User,
  Home,
  CheckCircle,
  XCircle,
  Clock3,
  Plus
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock data - replace with real data from your API
  const appointments = [
    {
      id: 1,
      client: 'Marie Dubois',
      clientEmail: 'marie.dubois@email.com',
      clientPhone: '06 12 34 56 78',
      property: 'Appartement 3 pièces - Paris 15ème',
      propertyId: 'PROP-001',
      date: '2024-01-25',
      time: '14:30',
      duration: 60,
      status: 'confirmed',
      type: 'visit',
      notes: 'Client très intéressée, première visite',
      agent: 'Jean Martin'
    },
    {
      id: 2,
      client: 'Sophie Bernard',
      clientEmail: 'sophie.bernard@email.com',
      clientPhone: '06 98 76 54 32',
      property: 'Villa avec piscine - Nice',
      propertyId: 'PROP-002',
      date: '2024-01-26',
      time: '10:00',
      duration: 90,
      status: 'pending',
      type: 'visit',
      notes: 'Visite avec les parents',
      agent: 'Sophie Bernard'
    },
    {
      id: 3,
      client: 'Pierre Moreau',
      clientEmail: 'pierre.moreau@email.com',
      clientPhone: '06 11 22 33 44',
      property: 'Studio moderne - Lyon',
      propertyId: 'PROP-003',
      date: '2024-01-24',
      time: '16:00',
      duration: 45,
      status: 'cancelled',
      type: 'visit',
      notes: 'Annulé par le client',
      agent: 'Jean Martin'
    },
    {
      id: 4,
      client: 'Alice Dubois',
      clientEmail: 'alice.dubois@email.com',
      clientPhone: '06 55 66 77 88',
      property: 'Maison familiale - Bordeaux',
      propertyId: 'PROP-004',
      date: '2024-01-27',
      time: '11:30',
      duration: 75,
      status: 'confirmed',
      type: 'signature',
      notes: 'Signature du compromis de vente',
      agent: 'Sophie Bernard'
    }
  ]

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.property.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      confirmed: 'default',
      pending: 'secondary',
      cancelled: 'destructive'
    }
    
    const labels: Record<string, string> = {
      confirmed: 'Confirmé',
      pending: 'En attente',
      cancelled: 'Annulé'
    }

    return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary'> = {
      visit: 'default',
      signature: 'secondary'
    }
    
    const labels: Record<string, string> = {
      visit: 'Visite',
      signature: 'Signature'
    }

    return <Badge variant={variants[type] || 'secondary'}>{labels[type] || type}</Badge>
  }

  const getConfirmedCount = () => {
    return appointments.filter(a => a.status === 'confirmed').length
  }

  const getPendingCount = () => {
    return appointments.filter(a => a.status === 'pending').length
  }

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0]
    return appointments.filter(a => a.date === today).length
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Demain'
    } else {
      return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestion des rendez-vous</h1>
          <p className="text-gray-600">Planifiez et gérez toutes les visites et signatures</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmés</p>
              <p className="text-2xl font-bold text-gray-900">{getConfirmedCount()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{getPendingCount()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{getTodayAppointments()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Home className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{filteredAppointments.length}</p>
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
                placeholder="Rechercher par client ou propriété..."
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
              <option value="confirmed">Confirmé</option>
              <option value="pending">En attente</option>
              <option value="cancelled">Annulé</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </Card>

      {/* Appointments list */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className={`p-6 ${appointment.status === 'cancelled' ? 'opacity-75' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {appointment.client}
                  </h3>
                  {getStatusBadge(appointment.status)}
                  {getTypeBadge(appointment.type)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Home className="w-4 h-4 mr-2" />
                      <span className="font-medium">Propriété :</span>
                      <span className="ml-2">{appointment.property}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">Date :</span>
                      <span className="ml-2">{formatDate(appointment.date)} à {appointment.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">Durée :</span>
                      <span className="ml-2">{appointment.duration} min</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">Agent :</span>
                      <span className="ml-2">{appointment.agent}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="font-medium">Contact :</span>
                      <span className="ml-2">{appointment.clientPhone}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Email :</span>
                      <span className="ml-2">{appointment.clientEmail}</span>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Notes :</strong> {appointment.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredAppointments.length}</span> sur{' '}
          <span className="font-medium">{appointments.length}</span> résultats
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
