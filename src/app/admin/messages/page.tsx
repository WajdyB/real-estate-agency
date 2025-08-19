'use client'

import React, { useState, useEffect } from 'react'
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
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Send,
  User,
  Phone,
  Calendar,
  Building2,
  DollarSign,
  AlertTriangle,
  Star,
  Flag
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Message {
  id: string
  subject: string
  sender: string
  senderEmail: string
  content: string
  status: 'PENDING' | 'READ' | 'REPLIED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  date: string
  propertyId?: string
  propertyTitle?: string
  propertyType?: string
  budget?: string
  timeframe?: string
  phone?: string
  response?: string
}

interface ApiResponse {
  success: boolean
  data: Message[]
  pagination: {
    page: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  error?: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showPriorityModal, setShowPriorityModal] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM')
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Fetch messages from API
  const fetchMessages = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }

      const response = await fetch(`/api/messages?${params}`)
      const data: ApiResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch messages')
      }

      setMessages(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages when filters change
  useEffect(() => {
    fetchMessages(1)
  }, [searchTerm, selectedStatus])

  const handlePageChange = (newPage: number) => {
    fetchMessages(newPage)
  }

  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setMessages(messages.map(message => 
          message.id === messageId 
            ? { ...message, status: newStatus as any }
            : message
        ))
        toast.success('Statut mis à jour avec succès')
      } else {
        toast.error('Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      console.error('Error updating message status:', error)
      toast.error('Erreur lors de la mise à jour du statut')
    }
  }

  const handleDelete = async (messageId: string, messageSubject: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le message "${messageSubject}" ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh the list
        fetchMessages(pagination.page)
        toast.success(`Message "${messageSubject}" supprimé avec succès`)
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  // Handle view message
  const handleViewMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedMessage(data.data)
        setShowViewModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching message details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  // Handle reply to message
  const handleReply = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedMessage(data.data)
        setReplyContent('')
        setShowReplyModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching message details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  // Handle reply submission
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMessage || !replyContent.trim()) return

    try {
      const response = await fetch(`/api/messages/${selectedMessage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'REPLIED',
          response: replyContent,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update the local state
        setMessages(messages.map(message => 
          message.id === selectedMessage.id 
            ? { ...message, status: 'REPLIED', response: replyContent }
            : message
        ))
        setShowReplyModal(false)
        setSelectedMessage(null)
        setReplyContent('')
        toast.success('Réponse envoyée avec succès')
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi de la réponse')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Erreur lors de l\'envoi de la réponse')
    }
  }

  // Handle priority change
  const handlePriorityChange = async (messageId: string, newPriority: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      })

      if (response.ok) {
        // Update local state
        setMessages(messages.map(message => 
          message.id === messageId 
            ? { ...message, priority: newPriority as any }
            : message
        ))
        setShowPriorityModal(false)
        setSelectedMessage(null)
        toast.success('Priorité mise à jour avec succès')
      } else {
        toast.error('Erreur lors de la mise à jour de la priorité')
      }
    } catch (error) {
      console.error('Error updating priority:', error)
      toast.error('Erreur lors de la mise à jour de la priorité')
    }
  }

  // Handle priority modal
  const handlePriorityModal = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedMessage(data.data)
        setSelectedPriority(data.data.priority || 'MEDIUM')
        setShowPriorityModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching message details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
      PENDING: 'warning',
      READ: 'success',
      REPLIED: 'success',
      CLOSED: 'secondary',
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      READ: 'Lu',
      REPLIED: 'Répondu',
      CLOSED: 'Fermé',
    }
    return labels[status] || status
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, 'success' | 'warning' | 'destructive'> = {
      LOW: 'success',
      MEDIUM: 'warning',
      HIGH: 'destructive',
      URGENT: 'destructive',
    }
    return colors[priority] || 'success'
  }

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      LOW: 'Faible',
      MEDIUM: 'Moyenne',
      HIGH: 'Élevée',
      URGENT: 'Urgente',
    }
    return labels[priority] || priority
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
          <MessageSquare className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => fetchMessages(1)}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Gérez les messages reçus de vos clients</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher dans les messages..."
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
                <option value="READ">Lus</option>
                <option value="REPLIED">Répondus</option>
                <option value="CLOSED">Fermés</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Messages list */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Messages ({pagination.total})
            </h2>
          </div>

          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{message.subject}</h3>
                        <Badge variant={getStatusColor(message.status)}>
                          {getStatusLabel(message.status)}
                        </Badge>
                        <Badge variant={getPriorityColor(message.priority)}>
                          {getPriorityLabel(message.priority)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>De:</strong> {message.sender} ({message.senderEmail})
                      </div>
                      
                      {message.propertyTitle && (
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Propriété:</strong> {message.propertyTitle}
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                        {message.content}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(message.date)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewMessage(message.id)}
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReply(message.id)}
                        disabled={message.status === 'REPLIED'}
                        title="Répondre"
                      >
                        <Reply className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePriorityModal(message.id)}
                        title="Changer la priorité"
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusChange(message.id, 'CLOSED')}
                        disabled={message.status === 'CLOSED'}
                        title="Archiver"
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(message.id, message.subject)}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun message trouvé
                </h3>
                <p className="text-gray-600">
                  Aucun message ne correspond à vos critères de recherche.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Affichage de {((pagination.page - 1) * 10) + 1} à {Math.min(pagination.page * 10, pagination.total)} sur {pagination.total} messages
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

      {/* View Message Modal */}
      {showViewModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Détails du message</h2>
                    <p className="text-gray-600">Informations complètes et gestion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content - 2 columns */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Message Header */}
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h1>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{selectedMessage.sender}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(selectedMessage.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getPriorityColor(selectedMessage.priority)} className="mb-2">
                          {getPriorityLabel(selectedMessage.priority)}
                        </Badge>
                        <Badge variant={getStatusColor(selectedMessage.status)}>
                          {getStatusLabel(selectedMessage.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Contenu du message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.content}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Response (if exists) */}
                  {selectedMessage.response && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Reply className="w-5 h-5" />
                          Réponse envoyée
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.response}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informations de contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nom</label>
                        <p className="text-sm text-gray-900">{selectedMessage.sender}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-900">{selectedMessage.senderEmail}</p>
                      </div>
                      {selectedMessage.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Téléphone</label>
                          <p className="text-sm text-gray-900">{selectedMessage.phone}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Property Information */}
                  {(selectedMessage.propertyType || selectedMessage.budget || selectedMessage.timeframe || selectedMessage.propertyTitle) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Informations immobilières
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedMessage.propertyTitle && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Propriété</label>
                            <p className="text-sm text-gray-900">{selectedMessage.propertyTitle}</p>
                          </div>
                        )}
                        {selectedMessage.propertyType && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Type de bien</label>
                            <p className="text-sm text-gray-900">{selectedMessage.propertyType}</p>
                          </div>
                        )}
                        {selectedMessage.budget && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Budget</label>
                            <p className="text-sm text-gray-900">{selectedMessage.budget}</p>
                          </div>
                        )}
                        {selectedMessage.timeframe && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Délai</label>
                            <p className="text-sm text-gray-900">{selectedMessage.timeframe}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={() => {
                          setShowViewModal(false)
                          handleReply(selectedMessage.id)
                        }} 
                        className="w-full mb-2"
                        disabled={selectedMessage.status === 'REPLIED'}
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Répondre
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowViewModal(false)
                          handlePriorityModal(selectedMessage.id)
                        }}
                        className="w-full mb-2"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Changer priorité
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowViewModal(false)
                          handleStatusChange(selectedMessage.id, 'CLOSED')
                        }}
                        className="w-full mb-2"
                        disabled={selectedMessage.status === 'CLOSED'}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archiver
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowViewModal(false)
                          handleDelete(selectedMessage.id, selectedMessage.subject)
                        }}
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Répondre au message</h2>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleReplySubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message original
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                    <p className="font-medium mb-2">De: {selectedMessage.sender} ({selectedMessage.senderEmail})</p>
                    <p className="mb-2"><strong>Sujet:</strong> {selectedMessage.subject}</p>
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="reply-content" className="block text-sm font-medium text-gray-700 mb-2">
                    Votre réponse *
                  </label>
                  <textarea
                    id="reply-content"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Tapez votre réponse ici..."
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowReplyModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer la réponse
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
              )}

        {/* Priority Modal */}
        {showPriorityModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Changer la priorité</h2>
                  <button
                    onClick={() => setShowPriorityModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Message: <strong>{selectedMessage.subject}</strong>
                  </p>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouvelle priorité
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="LOW">Faible</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Élevée</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPriorityModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={() => handlePriorityChange(selectedMessage.id, selectedPriority)}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
