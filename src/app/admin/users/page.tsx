'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Power,
  PowerOff,
  Mail,
  Phone,
  Calendar,
  Building2,
  Star,
  Heart,
  Save,
  Calendar as CalendarIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

// Types for our API responses
interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'CLIENT' | 'AGENT' | 'ADMIN'
  image?: string
  bio?: string
  address?: string
  city?: string
  zipCode?: string
  country: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    properties: number
    reviews: number
    favorites: number
    appointments: number
  }
  properties?: Array<{
    id: string
    title: string
    price: number
    city: string
    type: string
    isPublished: boolean
    createdAt: string
  }>
  reviews?: Array<{
    id: string
    rating: number
    comment?: string
    createdAt: string
    property: {
      id: string
      title: string
      city: string
    }
  }>
}

interface ApiResponse {
  success: boolean
  data: User[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  error?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  // Fetch users from API
  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      // Add filters
      if (searchTerm) params.append('search', searchTerm)
      if (selectedRole) params.append('role', selectedRole)
      if (selectedStatus !== '') params.append('isActive', selectedStatus)

      const response = await fetch(`/api/users?${params.toString()}`)
      const data: ApiResponse = await response.json()

      if (data.success) {
        setUsers(data.data)
        if (data.pagination) {
          setPagination(data.pagination)
        }
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers(1)
  }, [searchTerm, selectedRole, selectedStatus])

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage)
  }

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update the local state
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isActive: !currentStatus }
            : user
        ))
      } else {
        console.error('Failed to toggle status:', data.error)
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CLIENT' as 'CLIENT' | 'AGENT' | 'ADMIN',
    isActive: true,
  })
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CLIENT' as 'CLIENT' | 'AGENT' | 'ADMIN',
    password: '',
    isActive: true,
  })

  const handleViewUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedUser(data.data)
        setShowViewModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  const handleEditUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedUser(data.data)
        setEditFormData({
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          role: data.data.role || 'CLIENT',
          isActive: data.data.isActive,
        })
        setShowEditModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      })

      const data = await response.json()

      if (data.success) {
        // Update the local state
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...editFormData }
            : user
        ))
        setShowEditModal(false)
        setSelectedUser(null)
        toast.success('Utilisateur mis à jour avec succès')
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setAddFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleAddUser = () => {
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      role: 'CLIENT',
      password: '',
      isActive: true,
    })
    setShowAddModal(true)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addFormData),
      })

      const data = await response.json()

      if (data.success) {
        // Add the new user to the local state
        setUsers(prevUsers => [data.data, ...prevUsers])
        setShowAddModal(false)
        setAddFormData({
          name: '',
          email: '',
          phone: '',
          role: 'CLIENT',
          password: '',
          isActive: true,
        })
        toast.success('Utilisateur ajouté avec succès')
      } else {
        toast.error(data.error || 'Erreur lors de l\'ajout')
      }
    } catch (error) {
      console.error('Error adding user:', error)
      toast.error('Erreur lors de l\'ajout')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Remove user from local state
        setUsers(users.filter(user => user.id !== userId))
        toast.success(`Utilisateur "${userName}" supprimé avec succès`)
      } else {
        toast.error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      ADMIN: 'destructive',
      AGENT: 'secondary',
      CLIENT: 'default'
    }
    return <Badge variant={variants[role] || 'default'}>{role}</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge variant="default" className="bg-green-100 text-green-800">Actif</Badge>
      : <Badge variant="secondary">Inactif</Badge>
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Admin',
      AGENT: 'Agent',
      CLIENT: 'Client'
    }
    return labels[role] || role
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérez tous les utilisateurs de votre plateforme</p>
        </div>
                 <Button onClick={handleAddUser}>
           <Plus className="w-4 h-4 mr-2" />
           Ajouter un utilisateur
         </Button>
      </div>

      {/* Filters and search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="AGENT">Agent</option>
              <option value="CLIENT">Client</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les statuts</option>
              <option value="true">Actif</option>
              <option value="false">Inactif</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </Card>

      {/* Users table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => fetchUsers(1)}>
              Réessayer
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.image || '/images/placeholders/default-avatar.svg'}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-400">{user.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user._count && (
                          <div className="space-y-1">
                            <div>Propriétés: {user._count.properties}</div>
                            <div>Avis: {user._count.reviews}</div>
                            <div>Favoris: {user._count.favorites}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewUser(user.id)}
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                          title="Modifier l'utilisateur"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          disabled={user.role === 'ADMIN'}
                          className={user.isActive ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}
                          title={user.isActive ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
                        >
                          {user.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          disabled={user.role === 'ADMIN'}
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {!loading && !error && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> à{' '}
            <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> sur{' '}
            <span className="font-medium">{pagination.total}</span> résultats
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
                 </div>
       )}

       {/* View User Modal */}
       {showViewModal && selectedUser && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b">
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-gray-900">Détails de l'utilisateur</h2>
                 <button
                   onClick={() => setShowViewModal(false)}
                   className="text-gray-400 hover:text-gray-600"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
             </div>
             <div className="p-6">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* User Info */}
                 <div className="lg:col-span-1">
                   <Card>
                     <CardHeader>
                       <CardTitle>Informations personnelles</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex items-center space-x-4">
                         <img
                           src={selectedUser.image || '/images/placeholders/default-avatar.svg'}
                           alt={selectedUser.name}
                           className="w-16 h-16 rounded-full"
                         />
                         <div>
                           <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                           <p className="text-gray-600">{selectedUser.email}</p>
                         </div>
                       </div>

                       <div className="space-y-3">
                         <div className="flex items-center space-x-3">
                           <Mail className="w-4 h-4 text-gray-400" />
                           <span className="text-sm text-gray-600">{selectedUser.email}</span>
                         </div>
                         {selectedUser.phone && (
                           <div className="flex items-center space-x-3">
                             <Phone className="w-4 h-4 text-gray-400" />
                             <span className="text-sm text-gray-600">{selectedUser.phone}</span>
                           </div>
                         )}
                         <div className="flex items-center space-x-3">
                           <Calendar className="w-4 h-4 text-gray-400" />
                           <span className="text-sm text-gray-600">
                             Inscrit le {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                           </span>
                         </div>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Statistics */}
                   <Card className="mt-6">
                     <CardHeader>
                       <CardTitle>Statistiques</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="text-center">
                           <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                             <Building2 className="w-6 h-6 text-blue-600" />
                           </div>
                           <div className="text-2xl font-bold text-gray-900">{selectedUser._count?.properties || 0}</div>
                           <div className="text-sm text-gray-600">Propriétés</div>
                         </div>
                         <div className="text-center">
                           <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                             <Star className="w-6 h-6 text-yellow-600" />
                           </div>
                           <div className="text-2xl font-bold text-gray-900">{selectedUser._count?.reviews || 0}</div>
                           <div className="text-sm text-gray-600">Avis</div>
                         </div>
                         <div className="text-center">
                           <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2">
                             <Heart className="w-6 h-6 text-red-600" />
                           </div>
                           <div className="text-2xl font-bold text-gray-900">{selectedUser._count?.favorites || 0}</div>
                           <div className="text-sm text-gray-600">Favoris</div>
                         </div>
                         <div className="text-center">
                           <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                             <CalendarIcon className="w-6 h-6 text-green-600" />
                           </div>
                           <div className="text-2xl font-bold text-gray-900">{selectedUser._count?.appointments || 0}</div>
                           <div className="text-sm text-gray-600">Rendez-vous</div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                 </div>

                 {/* Properties and Reviews */}
                 <div className="lg:col-span-2 space-y-6">
                   {/* Recent Properties */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Propriétés récentes</CardTitle>
                     </CardHeader>
                     <CardContent>
                       {selectedUser.properties && selectedUser.properties.length > 0 ? (
                         <div className="space-y-4">
                           {selectedUser.properties.map((property) => (
                             <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                               <div>
                                 <h4 className="font-medium text-gray-900">{property.title}</h4>
                                 <p className="text-sm text-gray-600">{property.city} • {property.type}</p>
                                 <p className="text-sm text-gray-500">
                                   {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                                 </p>
                               </div>
                               <div className="text-right">
                                 <div className="font-semibold text-gray-900">
                                   {property.price.toLocaleString('fr-FR')} TND
                                 </div>
                                 <Badge variant={property.isPublished ? 'default' : 'secondary'}>
                                   {property.isPublished ? 'Publié' : 'Brouillon'}
                                 </Badge>
                               </div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-gray-500 text-center py-8">Aucune propriété trouvée</p>
                       )}
                     </CardContent>
                   </Card>

                   {/* Recent Reviews */}
                   <Card>
                     <CardHeader>
                       <CardTitle>Avis récents</CardTitle>
                     </CardHeader>
                     <CardContent>
                       {selectedUser.reviews && selectedUser.reviews.length > 0 ? (
                         <div className="space-y-4">
                           {selectedUser.reviews.map((review) => (
                             <div key={review.id} className="p-4 border rounded-lg">
                               <div className="flex items-center justify-between mb-2">
                                 <h4 className="font-medium text-gray-900">{review.property.title}</h4>
                                 <div className="flex items-center space-x-1">
                                   {[...Array(5)].map((_, i) => (
                                     <Star
                                       key={i}
                                       className={`w-4 h-4 ${
                                         i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                       }`}
                                     />
                                   ))}
                                 </div>
                               </div>
                               {review.comment && (
                                 <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                               )}
                               <p className="text-xs text-gray-500">
                                 {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                               </p>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-gray-500 text-center py-8">Aucun avis trouvé</p>
                       )}
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit User Modal */}
       {showEditModal && selectedUser && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b">
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-gray-900">Modifier l'utilisateur</h2>
                 <button
                   onClick={() => setShowEditModal(false)}
                   className="text-gray-400 hover:text-gray-600"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form onSubmit={handleEditSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                       Nom complet *
                     </label>
                     <Input
                       id="edit-name"
                       name="name"
                       type="text"
                       required
                       value={editFormData.name}
                       onChange={handleEditChange}
                       placeholder="Nom complet"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                       Email *
                     </label>
                     <Input
                       id="edit-email"
                       name="email"
                       type="email"
                       required
                       value={editFormData.email}
                       onChange={handleEditChange}
                       placeholder="email@example.com"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                       Téléphone
                     </label>
                     <Input
                       id="edit-phone"
                       name="phone"
                       type="tel"
                       value={editFormData.phone}
                       onChange={handleEditChange}
                       placeholder="+216 71 234 567"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-2">
                       Rôle *
                     </label>
                     <select
                       id="edit-role"
                       name="role"
                       value={editFormData.role}
                       onChange={handleEditChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                     >
                       <option value="CLIENT">Client</option>
                       <option value="AGENT">Agent</option>
                       <option value="ADMIN">Administrateur</option>
                     </select>
                   </div>
                 </div>

                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="edit-isActive"
                     name="isActive"
                     checked={editFormData.isActive}
                     onChange={handleEditChange}
                     className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                   />
                   <label htmlFor="edit-isActive" className="text-sm font-medium text-gray-700">
                     Utilisateur actif
                   </label>
                 </div>

                 <div className="flex justify-end space-x-3">
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => setShowEditModal(false)}
                   >
                     Annuler
                   </Button>
                   <Button type="submit">
                     <Save className="w-4 h-4 mr-2" />
                     Enregistrer
                   </Button>
                 </div>
               </form>
             </div>
           </div>
                    </div>
         )}

         {/* Add User Modal */}
         {showAddModal && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="p-6 border-b">
                 <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-bold text-gray-900">Ajouter un utilisateur</h2>
                   <button
                     onClick={() => setShowAddModal(false)}
                     className="text-gray-400 hover:text-gray-600"
                   >
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                 </div>
               </div>
               <div className="p-6">
                 <form onSubmit={handleAddSubmit} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-2">
                         Nom complet *
                       </label>
                       <Input
                         id="add-name"
                         name="name"
                         type="text"
                         required
                         value={addFormData.name}
                         onChange={handleAddChange}
                         placeholder="Nom complet"
                       />
                     </div>

                     <div>
                       <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-2">
                         Email *
                       </label>
                       <Input
                         id="add-email"
                         name="email"
                         type="email"
                         required
                         value={addFormData.email}
                         onChange={handleAddChange}
                         placeholder="email@example.com"
                       />
                     </div>

                     <div>
                       <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-2">
                         Téléphone
                       </label>
                       <Input
                         id="add-phone"
                         name="phone"
                         type="tel"
                         value={addFormData.phone}
                         onChange={handleAddChange}
                         placeholder="+216 71 234 567"
                       />
                     </div>

                     <div>
                       <label htmlFor="add-role" className="block text-sm font-medium text-gray-700 mb-2">
                         Rôle *
                       </label>
                       <select
                         id="add-role"
                         name="role"
                         value={addFormData.role}
                         onChange={handleAddChange}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                       >
                         <option value="CLIENT">Client</option>
                         <option value="AGENT">Agent</option>
                         <option value="ADMIN">Administrateur</option>
                       </select>
                     </div>

                     <div className="md:col-span-2">
                       <label htmlFor="add-password" className="block text-sm font-medium text-gray-700 mb-2">
                         Mot de passe *
                       </label>
                       <Input
                         id="add-password"
                         name="password"
                         type="password"
                         required
                         value={addFormData.password}
                         onChange={handleAddChange}
                         placeholder="Mot de passe"
                         minLength={6}
                       />
                     </div>
                   </div>

                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="add-isActive"
                       name="isActive"
                       checked={addFormData.isActive}
                       onChange={handleAddChange}
                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                     />
                     <label htmlFor="add-isActive" className="text-sm font-medium text-gray-700">
                       Utilisateur actif
                     </label>
                   </div>

                   <div className="flex justify-end space-x-3">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => setShowAddModal(false)}
                     >
                       Annuler
                     </Button>
                     <Button type="submit">
                       <Plus className="w-4 h-4 mr-2" />
                       Ajouter
                     </Button>
                   </div>
                 </form>
               </div>
             </div>
           </div>
         )}
       </div>
     )
   }
