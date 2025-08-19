'use client'

import React, { useState, useEffect } from 'react'
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
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface Appointment {
  id: string
  date: string
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED'
  notes?: string
  createdAt: string
  user: {
    id: string
    name?: string
    email: string
    phone?: string
  }
  property: {
    id: string
    title: string
    price: number
    city: string
    images?: string[]
    type: string
    user?: {
      id: string
      name?: string
      email: string
      phone?: string
    }
  }
}

interface ApiResponse {
  success: boolean
  data: Appointment[]
  pagination: {
    page: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  error?: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
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

  // Fetch appointments from API
  const fetchAppointments = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'date',
        sortOrder: 'asc'
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/admin/appointments?${params}`)
      const data: ApiResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch appointments')
      }

      setAppointments(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  // Fetch appointments when filters change
  useEffect(() => {
    fetchAppointments(1)
  }, [searchTerm, selectedStatus])

  const handlePageChange = (newPage: number) => {
    fetchAppointments(newPage)
  }

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh the list
        fetchAppointments(pagination.page)
      } else {
        alert('Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
      alert('Erreur lors de la mise à jour du statut')
    }
  }

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      return
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh the list
        fetchAppointments(pagination.page)
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      CANCELED: 'destructive',
      COMPLETED: 'secondary',
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmé',
      CANCELED: 'Annulé',
      COMPLETED: 'Terminé',
    }
    return labels[status] || status
  }



  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          <Calendar className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => fetchAppointments(1)}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Rendez-vous</h1>
          <p className="text-gray-600">Gérez les rendez-vous et visites de vos clients</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un client ou une propriété..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmés</option>
                <option value="COMPLETED">Terminés</option>
                <option value="CANCELED">Annulés</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Appointments list */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Rendez-vous ({pagination.total})
            </h2>
          </div>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {appointment.user.name || appointment.user.email} - {appointment.property.title}
                        </h3>
                        <Badge variant={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{appointment.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDateTime(appointment.date, appointment.time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          <span>{appointment.property.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{appointment.property.city}</span>
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="text-sm text-gray-700 mb-3">
                          <strong>Notes:</strong> {appointment.notes}
                        </div>
                      )}
                      
                      {appointment.property.user && (
                        <div className="text-xs text-gray-500">
                          Agent: {appointment.property.user.name || appointment.property.user.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {appointment.status === 'PENDING' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(appointment.id, 'CANCELED')}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'CONFIRMED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(appointment.id, 'COMPLETED')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun rendez-vous trouvé
                </h3>
                <p className="text-gray-600">
                  Aucun rendez-vous ne correspond à vos critères de recherche.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Affichage de {((pagination.page - 1) * 10) + 1} à {Math.min(pagination.page * 10, pagination.total)} sur {pagination.total} rendez-vous
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} sur {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
