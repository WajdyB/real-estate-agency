'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatSurface } from '@/lib/utils'
import { 
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Loader2,
  Trash2,
  Eye,
  Calendar,
  Filter,
  Search
} from 'lucide-react'

// Types for our API responses
interface Favorite {
  id: string
  createdAt: string
  property: {
    id: string
    title: string
    description: string
    price: number
    type: string
    status: string
    surface: number
    rooms: number
    bedrooms: number
    bathrooms: number
    address: string
    city: string
    zipCode: string
    images?: string[]
    isPublished: boolean
    isFeatured: boolean
    views: number
    createdAt: string
    user?: {
      id: string
      name?: string
      email: string
      phone?: string
      image?: string
    }
    _count?: {
      favorites: number
      reviews: number
      appointments: number
    }
  }
}

interface ApiResponse {
  success: boolean
  data: Favorite[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [removingFavorite, setRemovingFavorite] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session) return

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/favorites?page=${pagination.page}&limit=${pagination.limit}`)
        const data: ApiResponse = await response.json()

        if (data.success) {
          setFavorites(data.data)
          setPagination(data.pagination)
        } else {
          setError(data.error || 'Failed to fetch favorites')
        }
      } catch (err) {
        console.error('Error fetching favorites:', err)
        setError('Failed to load favorites')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [session, pagination.page, pagination.limit])

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      setRemovingFavorite(favoriteId)
      
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
        // Update total count
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }))
        
        // Show success message (you can add toast here)
        alert('Property removed from favorites')
      } else {
        alert(data.error || 'Failed to remove from favorites')
      }
    } catch (err) {
      console.error('Error removing favorite:', err)
      alert('Failed to remove from favorites')
    } finally {
      setRemovingFavorite(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      APARTMENT: 'Appartement',
      HOUSE: 'Maison',
      STUDIO: 'Studio',
      LOFT: 'Loft',
      VILLA: 'Villa',
      COMMERCIAL: 'Commercial',
      LAND: 'Terrain',
      PARKING: 'Parking',
    }
    return types[type] || type
  }

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Réservé',
      SOLD: 'Vendu',
      RENTED: 'Loué',
      DRAFT: 'Brouillon',
    }
    return statuses[status] || status
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                Mes Favoris
              </h1>
              <p className="text-gray-600">
                {pagination.total} propriété{pagination.total !== 1 ? 's' : ''} sauvegardée{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Voir toutes les propriétés
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement de vos favoris...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun favori pour le moment
            </h2>
            <p className="text-gray-600 mb-6">
              Commencez à explorer nos propriétés et ajoutez-les à vos favoris !
            </p>
            <Link href="/properties">
              <Button>
                <Eye className="w-4 h-4 mr-2" />
                Découvrir les propriétés
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Link href={`/properties/${favorite.property.id}`}>
                      <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                        {favorite.property.images && favorite.property.images.length > 0 ? (
                          <Image
                            src={favorite.property.images[0]}
                            alt={favorite.property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <Badge variant="gold">Favori</Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant={getStatusColor(favorite.property.status)}>
                            {getStatusLabel(favorite.property.status)}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Remove from favorites button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      disabled={removingFavorite === favorite.id}
                    >
                      {removingFavorite === favorite.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-3">
                      <Badge variant="outline" className="mb-2">
                        {getTypeLabel(favorite.property.type)}
                      </Badge>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        <Link 
                          href={`/properties/${favorite.property.id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {favorite.property.title}
                        </Link>
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{favorite.property.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-primary-700">
                        {formatPrice(favorite.property.price)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {favorite.property.views}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center">
                        <Square className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{formatSurface(favorite.property.surface)}</span>
                      </div>
                      {favorite.property.bedrooms > 0 && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 text-gray-400 mr-1" />
                          <span>{favorite.property.bedrooms}</span>
                        </div>
                      )}
                      {favorite.property.bathrooms > 0 && (
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 text-gray-400 mr-1" />
                          <span>{favorite.property.bathrooms}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <Link href={`/properties/${favorite.property.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    Précédent
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
