'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  User,
  CheckCircle,
  XCircle,
  Clock3,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Appointment {
  id: string
  date: string
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED'
  notes?: string
  createdAt: string
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
      image?: string
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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  // Fetch appointments from API
  const fetchAppointments = async (page: number = 1) => {
    if (!session) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'date',
        sortOrder: 'asc'
      })

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/appointments?${params}`)
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
    if (session) {
      fetchAppointments(1)
    }
  }, [session, selectedStatus])

  const handlePageChange = (newPage: number) => {
    fetchAppointments(newPage)
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      return
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Rendez-vous annulé avec succès')
        fetchAppointments(pagination.page)
      } else {
        toast.error('Erreur lors de l\'annulation')
      }
    } catch (error) {
      console.error('Error canceling appointment:', error)
      toast.error('Erreur lors de l\'annulation')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      COMPLETED: 'secondary',
      CANCELED: 'destructive',
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmé',
      COMPLETED: 'Terminé',
      CANCELED: 'Annulé',
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de vos rendez-vous...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => fetchAppointments(1)}>Réessayer</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">Mes Rendez-vous</h1>
              <p className="text-gray-600">Gérez vos visites et consultations</p>
            </div>
            <Link href="/properties">
              <Button>
                <Home className="w-4 h-4 mr-2" />
                Voir les propriétés
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
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
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Rendez-vous ({pagination.total})
              </h2>
            </div>

            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="font-semibold text-gray-900">
                            {appointment.property.title}
                          </h3>
                          <Badge variant={getStatusColor(appointment.status)}>
                            {getStatusLabel(appointment.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateTime(appointment.date, appointment.time)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.property.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Home className="w-4 h-4" />
                            <span>{appointment.property.type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">{formatPrice(appointment.property.price)}</span>
                          </div>
                        </div>

                        {appointment.property.images && appointment.property.images[0] && (
                          <div className="mb-4">
                            <Image
                              src={appointment.property.images[0]}
                              alt={appointment.property.title}
                              width={200}
                              height={120}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        )}

                        {appointment.notes && (
                          <div className="text-sm text-gray-700 mb-4">
                            <strong>Notes:</strong> {appointment.notes}
                          </div>
                        )}

                        {appointment.property.user && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Agent: {appointment.property.user.name || 'Non spécifié'}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/properties/${appointment.property.id}`}>
                          <Button variant="ghost" size="sm" title="Voir la propriété">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        {appointment.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            title="Annuler le rendez-vous"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
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
                  <p className="text-gray-600 mb-6">
                    {selectedStatus === 'all' 
                      ? 'Vous n\'avez pas encore de rendez-vous programmés.'
                      : 'Aucun rendez-vous ne correspond à ce statut.'
                    }
                  </p>
                  <Link href="/properties">
                    <Button>
                      <Home className="w-4 h-4 mr-2" />
                      Parcourir les propriétés
                    </Button>
                  </Link>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
