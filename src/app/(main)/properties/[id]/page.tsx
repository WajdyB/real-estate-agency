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
import BookingModal from '@/components/appointment/BookingModal'
import { 
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  Car,
  ArrowUpDown,
  TreePine,
  Wifi,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Play,
  Maximize,
  Loader2,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  User,
  Clock
} from 'lucide-react'

// Types for our API responses
interface Property {
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
  features?: any
  images?: string[]
  documents?: string[]
  virtualTour?: string
  videoUrl?: string
  isPublished: boolean
  isFeatured: boolean
  views: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
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
  reviews?: Array<{
    id: string
    rating: number
    comment?: string
    createdAt: string
    user: {
      id: string
      name?: string
      image?: string
    }
  }>
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewStats, setReviewStats] = useState<any>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  // Fetch property data from API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/properties/${params.id}`)
        const data = await response.json()
        
        if (data.success) {
          setProperty(data.data)
          // Track view
          await fetch(`/api/properties/${params.id}/views`, { method: 'POST' })
        } else {
          setError(data.error || 'Property not found')
        }
      } catch (err) {
        console.error('Error fetching property:', err)
        setError('Failed to load property')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  // Fetch reviews and stats
  useEffect(() => {
    const fetchReviews = async () => {
      if (!params.id) return

      try {
        // Fetch reviews
        const reviewsResponse = await fetch(`/api/reviews?propertyId=${params.id}&limit=10`)
        const reviewsData = await reviewsResponse.json()
        
        if (reviewsData.success) {
          setReviews(reviewsData.data)
        }

        // Fetch review stats
        const statsResponse = await fetch(`/api/reviews/stats?propertyId=${params.id}`)
        const statsData = await statsResponse.json()
        
        if (statsData.success) {
          setReviewStats(statsData.data)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
      }
    }

    fetchReviews()
  }, [params.id])

  // Check if property is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session?.user || !property) return

      try {
        const response = await fetch(`/api/favorites?propertyId=${property.id}`)
        const data = await response.json()
        
        if (data.success && data.data.length > 0) {
          setIsFavorite(true)
          setFavoriteId(data.data[0].id)
        }
      } catch (err) {
        console.error('Error checking favorite status:', err)
      }
    }

    checkFavoriteStatus()
  }, [session?.user, property])

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      // Redirect to sign in
      router.push('/auth/signin')
      return
    }

    if (!property) return

    try {
      if (isFavorite && favoriteId) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${favoriteId}`, {
          method: 'DELETE',
        })

        const data = await response.json()

        if (data.success) {
          setIsFavorite(false)
          setFavoriteId(null)
          alert('Property removed from favorites')
        } else {
          alert(data.error || 'Failed to remove from favorites')
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId: property.id
          }),
        })

        const data = await response.json()

        if (data.success) {
          setIsFavorite(true)
          setFavoriteId(data.data.id)
          alert('Property added to favorites')
        } else {
          alert(data.error || 'Failed to add to favorites')
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      alert('Failed to update favorites')
    }
  }

  const handleSubmitReview = async () => {
    if (!property || !reviewForm.comment.trim()) return

    try {
      setSubmittingReview(true)
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh reviews
        const reviewsResponse = await fetch(`/api/reviews?propertyId=${params.id}&limit=10`)
        const reviewsData = await reviewsResponse.json()
        
        if (reviewsData.success) {
          setReviews(reviewsData.data)
        }

        // Reset form
        setReviewForm({ rating: 5, comment: '' })
        setShowReviewForm(false)
        
        // Show success message (you can add toast here)
        alert('Review submitted successfully!')
      } else {
        alert(data.error || 'Failed to submit review')
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      alert('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  const nextImage = () => {
    if (!property?.images) return
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!property?.images) return
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de la propriété...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Propriété non trouvée
          </h1>
          <p className="text-gray-600 mb-6">{error || 'Cette propriété n\'existe pas ou n\'est plus disponible.'}</p>
          <Link href="/properties">
            <Button>
              Retour aux propriétés
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/properties" className="flex items-center text-gray-600 hover:text-primary-600">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux propriétés
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowBookingModal(true)}
                size="sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Prendre RDV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFavorite}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Retiré' : 'Favori'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="bg-black">
        <div className="container py-8">
          <div className="relative aspect-[16/9] max-h-[600px] rounded-xl overflow-hidden">
            {property.images && property.images.length > 0 ? (
              <Image
                src={property.images[currentImageIndex]}
                alt={`${property.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Aucune image disponible</p>
                </div>
              </div>
            )}
            
            {/* Navigation Arrows */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            )}

            {/* Virtual Tour & Video Buttons */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              {property.virtualTour && (
                <Button size="sm" variant="secondary">
                  <Maximize className="w-4 h-4 mr-2" />
                  Visite 360°
                </Button>
              )}
              {property.videoUrl && (
                <Button size="sm" variant="secondary">
                  <Play className="w-4 h-4 mr-2" />
                  Vidéo
                </Button>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {property.images && property.images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                    index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Property Details */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Info */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="default">{getTypeLabel(property.type)}</Badge>
                    <Badge variant={getStatusColor(property.status)}>
                      {getStatusLabel(property.status)}
                    </Badge>
                    {property.isFeatured && (
                      <Badge variant="gold">Premium</Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
                    {property.title}
                  </h1>
                  
                  <div className="flex items-center text-gray-600 mb-6">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.address}, {property.zipCode} {property.city}</span>
                  </div>

                  <div className="text-4xl font-bold text-primary-700 mb-6">
                    {formatPrice(property.price)}
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Square className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                      <div className="font-semibold">{formatSurface(property.surface)}</div>
                      <div className="text-sm text-gray-600">Surface</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600 mb-1">{property.rooms}</div>
                      <div className="text-sm text-gray-600">Pièces</div>
                    </div>
                    {property.bedrooms > 0 && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Bed className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                        <div className="font-semibold">{property.bedrooms}</div>
                        <div className="text-sm text-gray-600">Chambres</div>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Bath className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                        <div className="font-semibold">{property.bathrooms}</div>
                        <div className="text-sm text-gray-600">Salles de bain</div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Features & Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.yearBuilt && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium">Année de construction</div>
                          <div className="text-sm text-gray-600">{property.yearBuilt}</div>
                        </div>
                      </div>
                    )}
                    {property.energyClass && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <div className="text-sm font-bold text-primary-600">{property.energyClass}</div>
                        </div>
                        <div>
                          <div className="font-medium">Classe énergétique</div>
                          <div className="text-sm text-gray-600">DPE {property.energyClass}</div>
                        </div>
                      </div>
                    )}
                    {property.floor && property.totalFloors && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <div className="text-sm font-bold text-primary-600">{property.floor}</div>
                        </div>
                        <div>
                          <div className="font-medium">Étage</div>
                          <div className="text-sm text-gray-600">{property.floor}/{property.totalFloors}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {property.features && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-gray-900 mb-4">Équipements</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.features.elevator && (
                          <div className="flex items-center space-x-2">
                            <ArrowUpDown className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Ascenseur</span>
                          </div>
                        )}
                        {property.features.parking && (
                          <div className="flex items-center space-x-2">
                            <Car className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Parking</span>
                          </div>
                        )}
                        {property.features.garden && (
                          <div className="flex items-center space-x-2">
                            <TreePine className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Jardin</span>
                          </div>
                        )}
                        {property.features.internet && (
                          <div className="flex items-center space-x-2">
                            <Wifi className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Internet</span>
                          </div>
                        )}
                        {property.features.security && (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Sécurité</span>
                          </div>
                        )}
                        {property.features.cellar && (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                            <span className="text-sm">Cave</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reviews Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Avis clients
                      {reviewStats && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({reviewStats.overview.total} avis)
                        </span>
                      )}
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Laisser un avis
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Review Stats */}
                  {reviewStats && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="text-3xl font-bold text-gray-900 mr-3">
                            {reviewStats.overview.average}
                          </div>
                          <div>
                            <div className="flex items-center mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < Math.round(reviewStats.overview.average) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <div className="text-sm text-gray-600">
                              Basé sur {reviewStats.overview.total} avis
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Rating Distribution */}
                      <div className="space-y-2">
                        {reviewStats.distribution.map((item: any) => (
                          <div key={item.rating} className="flex items-center">
                            <span className="text-sm text-gray-600 w-8">{item.rating}★</span>
                            <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Form */}
                  {showReviewForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold mb-4">Laisser un avis</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Note
                          </label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                className="text-2xl"
                              >
                                <Star 
                                  className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Commentaire
                          </label>
                          <textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Partagez votre expérience..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={handleSubmitReview}
                            disabled={submittingReview || !reviewForm.comment.trim()}
                            size="sm"
                          >
                            {submittingReview ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Envoi...
                              </>
                            ) : (
                              'Publier'
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setShowReviewForm(false)
                              setReviewForm({ rating: 5, comment: '' })
                            }}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Image
                                src={review.user.image || '/images/placeholders/default-avatar.svg'}
                                alt={review.user.name || 'User'}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {review.user.name || 'Utilisateur anonyme'}
                                </div>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucun avis pour le moment</p>
                        <p className="text-sm text-gray-400">Soyez le premier à laisser un avis !</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Contact */}
              <Card className="sticky top-32">
                <CardHeader>
                  <CardTitle>Votre conseiller</CardTitle>
                </CardHeader>
                <CardContent>
                  {property.user ? (
                    <>
                      <div className="flex items-center space-x-4 mb-6">
                        <Image
                          src={property.user.image || '/images/placeholders/default-avatar.svg'}
                          alt={property.user.name || 'Agent'}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{property.user.name || 'Agent'}</h3>
                          <p className="text-sm text-gray-600">Agent immobilier</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full" size="lg">
                          <Calendar className="w-5 h-5 mr-2" />
                          Planifier une visite
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Appeler
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600">Aucun agent assigné</p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-gold-50 border border-gold-200 rounded-lg">
                    <h4 className="font-semibold text-gold-800 mb-2">Réservation en ligne</h4>
                    <p className="text-sm text-gold-700 mb-3">
                      Sécurisez ce bien avec un acompte de 5000€
                    </p>
                    <Button variant="gold" size="sm" className="w-full">
                      Réserver maintenant
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Property Stats */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {property.views}
                    </div>
                    <div className="text-sm text-gray-600">Vues cette semaine</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {property && (
        <BookingModal
          property={{
            id: property.id,
            title: property.title,
            price: property.price,
            city: property.city,
            address: property.address,
            images: property.images,
            type: property.type
          }}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  )
}
