'use client'

import React, { useState } from 'react'
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
  Calendar
} from 'lucide-react'

// Mock data - en production, ces données viendraient de l'API
const mockProperties = [
  {
    id: '1',
    title: 'Appartement moderne 3 pièces - Paris 15ème',
    price: 485000,
    type: 'APARTMENT',
    status: 'AVAILABLE',
    surface: 75,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    address: '25 Rue de la Convention',
    city: 'Paris',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300'],
    isPublished: true,
    isFeatured: true,
    views: 245,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    title: 'Maison familiale avec jardin - Neuilly-sur-Seine',
    price: 1250000,
    type: 'HOUSE',
    status: 'RESERVED',
    surface: 120,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    address: '12 Avenue du Général de Gaulle',
    city: 'Neuilly-sur-Seine',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300'],
    isPublished: true,
    isFeatured: true,
    views: 189,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
  },
  {
    id: '3',
    title: 'Studio lumineux - Quartier Latin',
    price: 295000,
    type: 'STUDIO',
    status: 'AVAILABLE',
    surface: 25,
    rooms: 1,
    bedrooms: 0,
    bathrooms: 1,
    address: '8 Rue de la Huchette',
    city: 'Paris',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300'],
    isPublished: false,
    isFeatured: false,
    views: 67,
    createdAt: '2024-01-05T11:45:00Z',
    updatedAt: '2024-01-15T16:20:00Z',
  },
  {
    id: '4',
    title: 'Villa contemporaine avec piscine - Cannes',
    price: 2800000,
    type: 'VILLA',
    status: 'AVAILABLE',
    surface: 200,
    rooms: 6,
    bedrooms: 5,
    bathrooms: 3,
    address: '45 Boulevard de la Croisette',
    city: 'Cannes',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300'],
    isPublished: true,
    isFeatured: true,
    views: 312,
    createdAt: '2024-01-12T16:30:00Z',
    updatedAt: '2024-01-19T10:45:00Z',
  },
]

const propertyTypes = [
  { value: '', label: 'Tous types' },
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'LOFT', label: 'Loft' },
  { value: 'VILLA', label: 'Villa' },
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
  const [properties, setProperties] = useState(mockProperties)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    published: '',
  })
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      APARTMENT: 'Appartement',
      HOUSE: 'Maison',
      STUDIO: 'Studio',
      LOFT: 'Loft',
      VILLA: 'Villa',
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

  const handleDelete = (propertyId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      setProperties(prev => prev.filter(p => p.id !== propertyId))
      setSelectedProperties(prev => prev.filter(id => id !== propertyId))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedProperties.length} propriété(s) ?`)) {
      setProperties(prev => prev.filter(p => !selectedProperties.includes(p.id)))
      setSelectedProperties([])
    }
  }

  // Filtrage des propriétés
  const filteredProperties = properties.filter(property => {
    if (filters.search && !property.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !property.city.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.type && property.type !== filters.type) return false
    if (filters.status && property.status !== filters.status) return false
    if (filters.published === 'published' && !property.isPublished) return false
    if (filters.published === 'unpublished' && property.isPublished) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Gestion des Propriétés
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredProperties.length} propriété(s) trouvée(s)
          </p>
        </div>
        <Link href="/admin/properties/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une propriété
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par titre, ville..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <select
              value={filters.published}
              onChange={(e) => handleFilterChange('published', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Toutes</option>
              <option value="published">Publiées</option>
              <option value="unpublished">Non publiées</option>
            </select>
          </div>
          
          {selectedProperties.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
              <span className="text-sm text-primary-700">
                {selectedProperties.length} propriété(s) sélectionnée(s)
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Publier
                </Button>
                <Button variant="outline" size="sm">
                  Dépublier
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="w-12 p-4">
                    <input
                      type="checkbox"
                      checked={selectedProperties.length === properties.length}
                      onChange={toggleAllProperties}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-900">Propriété</th>
                  <th className="text-left p-4 font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Prix</th>
                  <th className="text-left p-4 font-medium text-gray-900">Statut</th>
                  <th className="text-left p-4 font-medium text-gray-900">Vues</th>
                  <th className="text-left p-4 font-medium text-gray-900">Modifié</th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => togglePropertySelection(property.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {property.images[0] && (
                            <Image
                              src={property.images[0]}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/admin/properties/${property.id}`}
                            className="font-medium text-gray-900 hover:text-primary-600 truncate block"
                          >
                            {property.title}
                          </Link>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{property.address}, {property.city}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {property.isFeatured && (
                              <Badge variant="gold" className="text-xs">Premium</Badge>
                            )}
                            {!property.isPublished && (
                              <Badge variant="secondary" className="text-xs">Brouillon</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {getTypeLabel(property.type)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">
                        {formatPrice(property.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatSurface(property.surface)} • {property.rooms} pièces
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusColor(property.status)}>
                        {getStatusLabel(property.status)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="w-4 h-4 mr-1" />
                        {property.views}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(property.updatedAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/properties/${property.id}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/properties/${property.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:text-red-700"
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
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune propriété trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                Modifiez vos filtres ou ajoutez une nouvelle propriété.
              </p>
              <Link href="/admin/properties/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une propriété
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
