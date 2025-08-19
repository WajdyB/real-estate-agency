'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatSurface, formatDate } from '@/lib/utils'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  MapPin,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Home,
  Tag,
  Bed,
  Bath,
  DoorOpen,
  Maximize2,
  Building2,
  Activity,
  BarChart3,
  Heart,
  Star,
  User,
  Phone,
  Upload
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Property {
  id: string
  title: string
  description: string
  price: number
  type: 'APARTMENT' | 'HOUSE' | 'STUDIO'
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'RENTED' | 'DRAFT'
  surface: number
  rooms: number
  bedrooms: number
  bathrooms: number
  floor?: number
  totalFloors?: number
  yearBuilt?: number
  energyClass?: string
  address: string
  city: string
  zipCode: string
  country: string
  latitude?: number
  longitude?: number
  images: string[]
  isPublished: boolean
  isFeatured: boolean
  views: number
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    name: string
    email: string
    phone?: string
    image?: string
  }
  _count?: {
    favorites: number
    reviews: number
  }
}

interface ApiResponse {
  success: boolean
  data: Property[]
  pagination: {
    page: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  error?: string
}

const propertyTypes = [
  { value: '', label: 'Tous types' },
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'STUDIO', label: 'Studio' },
]

const statusOptions = [
  { value: '', label: 'Tous statuts' },
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'RESERVED', label: 'Réservé' },
  { value: 'SOLD', label: 'Vendu' },
  { value: 'RENTED', label: 'Loué' },
  { value: 'DRAFT', label: 'Brouillon' },
]

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    published: '',
  })
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: 0,
    type: 'APARTMENT' as 'APARTMENT' | 'HOUSE' | 'STUDIO',
    status: 'AVAILABLE' as 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'RENTED' | 'DRAFT',
    surface: 0,
    rooms: 0,
    bedrooms: 0,
    bathrooms: 0,
    address: '',
    city: '',
    zipCode: '',
    isPublished: false,
    isFeatured: false,
    images: [] as string[],
  })
  const [uploadingImages, setUploadingImages] = useState(false)
  const [newImages, setNewImages] = useState<File[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Fetch properties from API
  const fetchProperties = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      if (filters.search) {
        params.append('search', filters.search)
      }
      if (filters.type) {
        params.append('type', filters.type)
      }
      if (filters.status) {
        params.append('status', filters.status)
      }
      if (filters.published !== '') {
        params.append('isPublished', filters.published)
      }

      const response = await fetch(`/api/properties?${params}`)
      const data: ApiResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch properties')
      }

      setProperties(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching properties:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties(1)
  }, [filters])

  const handlePageChange = (newPage: number) => {
    fetchProperties(newPage)
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      APARTMENT: 'Appartement',
      HOUSE: 'Maison',
      STUDIO: 'Studio',
    }
    return types[type] || type
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
      AVAILABLE: 'success',
      RESERVED: 'warning',
      SOLD: 'destructive',
      RENTED: 'secondary',
      DRAFT: 'secondary',
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Réservé',
      SOLD: 'Vendu',
      RENTED: 'Loué',
      DRAFT: 'Brouillon',
    }
    return labels[status] || status
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleViewProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedProperty(data.data)
        setShowViewModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching property details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  const handleEditProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedProperty(data.data)
        setEditFormData({
          title: data.data.title || '',
          description: data.data.description || '',
          price: data.data.price || 0,
          type: data.data.type || 'APARTMENT',
          status: data.data.status || 'AVAILABLE',
          surface: data.data.surface || 0,
          rooms: data.data.rooms || 0,
          bedrooms: data.data.bedrooms || 0,
          bathrooms: data.data.bathrooms || 0,
          address: data.data.address || '',
          city: data.data.city || '',
          zipCode: data.data.zipCode || '',
          isPublished: data.data.isPublished,
          isFeatured: data.data.isFeatured,
          images: data.data.images || [],
        })
        setNewImages([])
        setShowEditModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching property details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProperty) return

    try {
      setUploadingImages(true)
      
      // Upload new images if any
      let uploadedImageUrls: string[] = []
      if (newImages.length > 0) {
        try {
          uploadedImageUrls = await uploadImages(newImages)
          toast.success(`${uploadedImageUrls.length} image(s) téléchargée(s) avec succès`)
        } catch (error) {
          toast.error('Erreur lors du téléchargement des images')
          setUploadingImages(false)
          return
        }
      }

      // Combine existing and new images
      const allImages = [...editFormData.images, ...uploadedImageUrls]

      const updateData = {
        ...editFormData,
        images: allImages,
      }

      const response = await fetch(`/api/properties/${selectedProperty.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (data.success) {
        // Update the local state
        setProperties(properties.map(property => 
          property.id === selectedProperty.id 
            ? { ...property, ...updateData }
            : property
        ))
        setShowEditModal(false)
        setSelectedProperty(null)
        setNewImages([])
        toast.success('Propriété mise à jour avec succès')
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating property:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setNewImages(prev => [...prev, ...files])
  }

  // Remove new image from selection
  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
  }

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Upload images to server
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    
    // Add all files to formData
    files.forEach(file => {
      formData.append('files', file)
    })
    
    // Add type for property images
    formData.append('type', 'property')
    
    try {
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.data.uploadedFiles
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      throw new Error('Failed to upload images')
    }
  }

  const togglePropertySelection = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const toggleAllProperties = () => {
    setSelectedProperties(
      selectedProperties.length === properties.length 
        ? [] 
        : properties.map(p => p.id)
    )
  }

  const handleDelete = async (propertyId: string, propertyTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la propriété "${propertyTitle}" ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Remove property from local state
        setProperties(properties.filter(property => property.id !== propertyId))
        toast.success(`Propriété "${propertyTitle}" supprimée avec succès`)
      } else {
        toast.error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) {
      alert('Aucune propriété sélectionnée')
      return
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProperties.length} propriété(s) ?`)) {
      return
    }

    try {
      // Delete each property
      for (const propertyId of selectedProperties) {
        await fetch(`/api/properties/${propertyId}`, {
          method: 'DELETE',
        })
      }

      setSelectedProperties([])
      fetchProperties(pagination.page)
    } catch (error) {
      console.error('Error bulk deleting properties:', error)
      alert('Erreur lors de la suppression en masse')
    }
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
          <Filter className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => fetchProperties(1)}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestion des propriétés</h1>
          <p className="text-gray-600">Gérez toutes les propriétés de votre agence</p>
        </div>
        <Link href="/admin/properties/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle propriété
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recherche
              </label>
              <Input
                placeholder="Rechercher une propriété..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication
              </label>
              <select
                value={filters.published}
                onChange={(e) => handleFilterChange('published', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous</option>
                <option value="true">Publié</option>
                <option value="false">Brouillon</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selectedProperties.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedProperties.length} propriété(s) sélectionnée(s)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProperties([])}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Properties list */}
      <Card>
        <CardHeader>
          <CardTitle>
            Propriétés ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.length === properties.length && properties.length > 0}
                      onChange={toggleAllProperties}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4">Propriété</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Prix</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Vues</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => togglePropertySelection(property.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {property.images && property.images.length > 0 ? (
                            <Image
                              src={property.images[0]}
                              alt={property.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {property.address}, {property.city}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.surface}m² • {property.rooms} pièces • {property.bedrooms} chambres
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">
                        {getTypeLabel(property.type)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {formatPrice(property.price)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusColor(property.status)}>
                        {getStatusLabel(property.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {property.views}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(property.createdAt)}
                      </div>
                    </td>
                                         <td className="py-3 px-4">
                       <div className="flex items-center space-x-2">
                         <Button 
                           variant="ghost" 
                           size="sm"
                           onClick={() => handleViewProperty(property.id)}
                           title="Voir les détails"
                         >
                           <Eye className="w-4 h-4" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="sm"
                           onClick={() => handleEditProperty(property.id)}
                           title="Modifier la propriété"
                         >
                           <Edit className="w-4 h-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleDelete(property.id, property.title)}
                           title="Supprimer la propriété"
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Affichage de {((pagination.page - 1) * 10) + 1} à {Math.min(pagination.page * 10, pagination.total)} sur {pagination.total} propriétés
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

       {/* View Property Modal */}
       {showViewModal && selectedProperty && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
             {/* Header */}
             <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-xl">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="p-2 bg-primary-100 rounded-lg">
                     <Home className="w-6 h-6 text-primary-600" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-bold text-gray-900">Détails de la propriété</h2>
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
                   {/* Hero Section */}
                   <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
                     <div className="flex items-start justify-between mb-4">
                       <div>
                         <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProperty.title}</h1>
                         <div className="flex items-center gap-4 text-gray-600">
                           <div className="flex items-center gap-2">
                             <MapPin className="w-4 h-4" />
                             <span>{selectedProperty.address}, {selectedProperty.city}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Tag className="w-4 h-4" />
                             <span>{getTypeLabel(selectedProperty.type)}</span>
                           </div>
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="text-3xl font-bold text-primary-600">{formatPrice(selectedProperty.price)}</div>
                         <div className="text-sm text-gray-600">{selectedProperty.surface}m²</div>
                       </div>
                     </div>
                     <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
                   </div>

                   {/* Key Stats */}
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <Card className="p-4 text-center">
                       <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                         <Bed className="w-6 h-6 text-blue-600" />
                       </div>
                       <div className="text-2xl font-bold text-gray-900">{selectedProperty.bedrooms}</div>
                       <div className="text-sm text-gray-600">Chambres</div>
                     </Card>
                     <Card className="p-4 text-center">
                       <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                         <Bath className="w-6 h-6 text-green-600" />
                       </div>
                       <div className="text-2xl font-bold text-gray-900">{selectedProperty.bathrooms}</div>
                       <div className="text-sm text-gray-600">Salles de bain</div>
                     </Card>
                     <Card className="p-4 text-center">
                       <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                         <DoorOpen className="w-6 h-6 text-purple-600" />
                       </div>
                       <div className="text-2xl font-bold text-gray-900">{selectedProperty.rooms}</div>
                       <div className="text-sm text-gray-600">Pièces</div>
                     </Card>
                     <Card className="p-4 text-center">
                       <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                         <Maximize2 className="w-6 h-6 text-orange-600" />
                       </div>
                       <div className="text-2xl font-bold text-gray-900">{selectedProperty.surface}</div>
                       <div className="text-sm text-gray-600">m²</div>
                     </Card>
                   </div>

                   {/* Property Images */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                                                   <Image src="/images/placeholders/default-avatar.svg" alt="User" width={20} height={20} className="w-5 h-5" />
                         Galerie d'images
                       </CardTitle>
                     </CardHeader>
                     <CardContent>
                       {selectedProperty.images && selectedProperty.images.length > 0 ? (
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {selectedProperty.images.slice(0, 6).map((image, index) => (
                             <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden group relative">
                               <Image
                                 src={image}
                                 alt={`${selectedProperty.title} - Image ${index + 1}`}
                                 width={300}
                                 height={300}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                               />
                               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                           <div className="text-center">
                                                           <Image src="/images/placeholders/property-1.svg" alt="Property" width={48} height={48} className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                             <p className="text-gray-500">Aucune image disponible</p>
                           </div>
                         </div>
                       )}
                     </CardContent>
                   </Card>

                   {/* Additional Details */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <Building2 className="w-5 h-5" />
                           Caractéristiques
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="text-sm font-medium text-gray-500">Étage</label>
                             <p className="text-gray-900">{selectedProperty.floor || 'N/A'}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-gray-500">Étages total</label>
                             <p className="text-gray-900">{selectedProperty.totalFloors || 'N/A'}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-gray-500">Année de construction</label>
                             <p className="text-gray-900">{selectedProperty.yearBuilt || 'N/A'}</p>
                           </div>
                           <div>
                             <label className="text-sm font-medium text-gray-500">Classe énergétique</label>
                             <p className="text-gray-900">{selectedProperty.energyClass || 'N/A'}</p>
                           </div>
                         </div>
                       </CardContent>
                     </Card>

                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <MapPin className="w-5 h-5" />
                           Localisation
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-4">
                         <div>
                           <label className="text-sm font-medium text-gray-500">Adresse complète</label>
                           <p className="text-gray-900">{selectedProperty.address}</p>
                           <p className="text-gray-900">{selectedProperty.zipCode} {selectedProperty.city}</p>
                           {selectedProperty.country && (
                             <p className="text-gray-900">{selectedProperty.country}</p>
                           )}
                         </div>
                         {(selectedProperty.latitude && selectedProperty.longitude) && (
                           <div>
                             <label className="text-sm font-medium text-gray-500">Coordonnées GPS</label>
                             <p className="text-gray-900 text-sm">
                               {selectedProperty.latitude.toFixed(6)}, {selectedProperty.longitude.toFixed(6)}
                             </p>
                           </div>
                         )}
                       </CardContent>
                     </Card>
                   </div>
                 </div>

                 {/* Sidebar */}
                 <div className="space-y-6">
                   {/* Status & Actions */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <Activity className="w-5 h-5" />
                         Statut & Actions
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex flex-wrap gap-2">
                         <Badge variant={getStatusColor(selectedProperty.status)} className="text-sm">
                           {getStatusLabel(selectedProperty.status)}
                         </Badge>
                         <Badge variant={selectedProperty.isPublished ? 'default' : 'secondary'} className="text-sm">
                           {selectedProperty.isPublished ? 'Publié' : 'Brouillon'}
                         </Badge>
                         {selectedProperty.isFeatured && (
                           <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-sm">
                             En vedette
                           </Badge>
                         )}
                       </div>
                       <div className="pt-4 border-t">
                         <Button onClick={() => {
                           setShowViewModal(false)
                           handleEditProperty(selectedProperty.id)
                         }} className="w-full mb-2">
                           <Edit className="w-4 h-4 mr-2" />
                           Modifier
                         </Button>
                         <Button 
                           variant="outline" 
                           onClick={() => {
                             setShowViewModal(false)
                             handleDelete(selectedProperty.id, selectedProperty.title)
                           }}
                           className="w-full"
                         >
                           <Trash2 className="w-4 h-4 mr-2" />
                           Supprimer
                         </Button>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Analytics */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <BarChart3 className="w-5 h-5" />
                         Statistiques
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Eye className="w-4 h-4 text-blue-500" />
                           <span className="text-sm text-gray-600">Vues</span>
                         </div>
                         <span className="font-semibold text-gray-900">{selectedProperty.views}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Heart className="w-4 h-4 text-red-500" />
                           <span className="text-sm text-gray-600">Favoris</span>
                         </div>
                         <span className="font-semibold text-gray-900">{selectedProperty._count?.favorites || 0}</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Star className="w-4 h-4 text-yellow-500" />
                           <span className="text-sm text-gray-600">Avis</span>
                         </div>
                         <span className="font-semibold text-gray-900">{selectedProperty._count?.reviews || 0}</span>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Agent Info */}
                   {selectedProperty.user && (
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <User className="w-5 h-5" />
                           Agent responsable
                         </CardTitle>
                       </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                             <User className="w-5 h-5 text-primary-600" />
                           </div>
                           <div>
                             <p className="font-medium text-gray-900">{selectedProperty.user.name}</p>
                             <p className="text-sm text-gray-600">{selectedProperty.user.email}</p>
                           </div>
                         </div>
                         {selectedProperty.user.phone && (
                           <div className="flex items-center gap-2 text-sm text-gray-600">
                             <Phone className="w-4 h-4" />
                             <span>{selectedProperty.user.phone}</span>
                           </div>
                         )}
                       </CardContent>
                     </Card>
                   )}

                   {/* Dates */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <Calendar className="w-5 h-5" />
                         Informations temporelles
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                       <div>
                         <label className="text-sm font-medium text-gray-500">Créé le</label>
                         <p className="text-sm text-gray-900">{new Date(selectedProperty.createdAt).toLocaleDateString('fr-FR')}</p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-gray-500">Modifié le</label>
                         <p className="text-sm text-gray-900">{new Date(selectedProperty.updatedAt).toLocaleDateString('fr-FR')}</p>
                       </div>
                       {selectedProperty.publishedAt && (
                         <div>
                           <label className="text-sm font-medium text-gray-500">Publié le</label>
                           <p className="text-sm text-gray-900">{new Date(selectedProperty.publishedAt).toLocaleDateString('fr-FR')}</p>
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Property Modal */}
       {showEditModal && selectedProperty && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b">
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-gray-900">Modifier la propriété</h2>
                 <button
                   onClick={() => setShowEditModal(false)}
                   className="text-gray-400 hover:text-gray-600"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form onSubmit={handleEditSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                       Titre *
                     </label>
                     <Input
                       id="edit-title"
                       name="title"
                       type="text"
                       required
                       value={editFormData.title}
                       onChange={handleEditChange}
                       placeholder="Titre de la propriété"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-2">
                       Prix (TND) *
                     </label>
                     <Input
                       id="edit-price"
                       name="price"
                       type="number"
                       required
                       value={editFormData.price}
                       onChange={handleEditChange}
                       placeholder="0"
                       min="0"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-2">
                       Type *
                     </label>
                     <select
                       id="edit-type"
                       name="type"
                       value={editFormData.type}
                       onChange={handleEditChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                     >
                       <option value="APARTMENT">Appartement</option>
                       <option value="HOUSE">Maison</option>
                       <option value="STUDIO">Studio</option>
                     </select>
                   </div>

                   <div>
                     <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
                       Statut *
                     </label>
                     <select
                       id="edit-status"
                       name="status"
                       value={editFormData.status}
                       onChange={handleEditChange}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                     >
                       <option value="AVAILABLE">Disponible</option>
                       <option value="RESERVED">Réservé</option>
                       <option value="SOLD">Vendu</option>
                       <option value="RENTED">Loué</option>
                       <option value="DRAFT">Brouillon</option>
                     </select>
                   </div>

                   <div>
                     <label htmlFor="edit-surface" className="block text-sm font-medium text-gray-700 mb-2">
                       Surface (m²) *
                     </label>
                     <Input
                       id="edit-surface"
                       name="surface"
                       type="number"
                       required
                       value={editFormData.surface}
                       onChange={handleEditChange}
                       placeholder="0"
                       min="0"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-rooms" className="block text-sm font-medium text-gray-700 mb-2">
                       Nombre de pièces
                     </label>
                     <Input
                       id="edit-rooms"
                       name="rooms"
                       type="number"
                       value={editFormData.rooms}
                       onChange={handleEditChange}
                       placeholder="0"
                       min="0"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                       Chambres
                     </label>
                     <Input
                       id="edit-bedrooms"
                       name="bedrooms"
                       type="number"
                       value={editFormData.bedrooms}
                       onChange={handleEditChange}
                       placeholder="0"
                       min="0"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                       Salles de bain
                     </label>
                     <Input
                       id="edit-bathrooms"
                       name="bathrooms"
                       type="number"
                       value={editFormData.bathrooms}
                       onChange={handleEditChange}
                       placeholder="0"
                       min="0"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-2">
                       Adresse *
                     </label>
                     <Input
                       id="edit-address"
                       name="address"
                       type="text"
                       required
                       value={editFormData.address}
                       onChange={handleEditChange}
                       placeholder="Adresse complète"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700 mb-2">
                       Ville *
                     </label>
                     <Input
                       id="edit-city"
                       name="city"
                       type="text"
                       required
                       value={editFormData.city}
                       onChange={handleEditChange}
                       placeholder="Ville"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                       Code postal
                     </label>
                     <Input
                       id="edit-zipCode"
                       name="zipCode"
                       type="text"
                       value={editFormData.zipCode}
                       onChange={handleEditChange}
                       placeholder="Code postal"
                     />
                   </div>
                 </div>

                                   <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      required
                      value={editFormData.description}
                      onChange={handleEditChange}
                      placeholder="Description détaillée de la propriété"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images de la propriété
                    </label>
                    
                                         {/* Existing Images */}
                     {editFormData.images.length > 0 && (
                       <div className="mb-4">
                         <h4 className="text-sm font-medium text-gray-600 mb-2">Images existantes</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           {editFormData.images.map((image, index) => (
                             <div key={index} className="relative group">
                               <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                 <Image
                                   src={image}
                                   alt={`Image ${index + 1}`}
                                   width={200}
                                   height={200}
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                               <button
                                 type="button"
                                 onClick={() => removeExistingImage(index)}
                                 className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                 title="Supprimer cette image"
                               >
                                 <X className="w-4 h-4" />
                               </button>
                               {index === 0 && (
                                 <Badge className="absolute bottom-2 left-2 text-xs">
                                   Photo principale
                                 </Badge>
                               )}
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                                         {/* New Images Preview */}
                     {newImages.length > 0 && (
                       <div className="mb-4">
                         <h4 className="text-sm font-medium text-gray-600 mb-2">Nouvelles images à télécharger</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                           {newImages.map((file, index) => (
                             <div key={index} className="relative group">
                               <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                 <img
                                   src={URL.createObjectURL(file)}
                                   alt={`Nouvelle image ${index + 1}`}
                                   className="w-full h-full object-cover"
                                 />
                               </div>
                               <button
                                 type="button"
                                 onClick={() => removeNewImage(index)}
                                 className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                 title="Supprimer cette image"
                               >
                                 <X className="w-4 h-4" />
                               </button>
                               <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                 {file.name}
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                                         {/* Upload New Images */}
                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-400 transition-colors">
                       <div className="text-center">
                         <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                         <div className="text-sm text-gray-600 mb-4">
                           Glissez-déposez vos images ou cliquez pour sélectionner
                         </div>
                         <input
                           type="file"
                           multiple
                           accept="image/*"
                           onChange={handleImageSelect}
                           className="hidden"
                           id="image-upload"
                           disabled={uploadingImages}
                         />
                         <Button 
                           type="button" 
                           variant="outline" 
                           size="sm"
                           onClick={() => document.getElementById('image-upload')?.click()}
                           disabled={uploadingImages}
                         >
                           <Plus className="w-4 h-4 mr-2" />
                           {uploadingImages ? 'Téléchargement en cours...' : 'Ajouter des images'}
                         </Button>
                         <div className="text-xs text-gray-500 mt-2">
                           PNG, JPG, JPEG jusqu'à 5MB par image
                         </div>
                       </div>
                     </div>
                  </div>

                 <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="edit-isPublished"
                       name="isPublished"
                       checked={editFormData.isPublished}
                       onChange={handleEditChange}
                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                     />
                     <label htmlFor="edit-isPublished" className="text-sm font-medium text-gray-700">
                       Publié
                     </label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="edit-isFeatured"
                       name="isFeatured"
                       checked={editFormData.isFeatured}
                       onChange={handleEditChange}
                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                     />
                     <label htmlFor="edit-isFeatured" className="text-sm font-medium text-gray-700">
                       En vedette
                     </label>
                   </div>
                 </div>

                                   <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                      disabled={uploadingImages}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={uploadingImages}>
                      {uploadingImages ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer
                        </>
                      )}
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
