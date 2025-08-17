'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatSurface } from '@/lib/utils'
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
  Maximize
} from 'lucide-react'

// Mock data - en production, ces données viendraient de l'API
const mockProperty = {
  id: '1',
  title: 'Appartement moderne 3 pièces - Paris 15ème',
  description: 'Magnifique appartement de 75m² entièrement rénové avec goût. Situé au 4ème étage avec ascenseur, il offre une vue dégagée sur un jardin privatif. Composé d\'un séjour lumineux de 30m², 2 chambres confortables, cuisine équipée moderne, salle de bain avec baignoire et douche, WC séparé. Proche de toutes commodités : métro Convention (ligne 12), commerces, écoles et parcs. Idéal pour une famille ou un investissement locatif.',
  price: 485000,
  type: 'APARTMENT',
  status: 'AVAILABLE',
  surface: 75,
  rooms: 3,
  bedrooms: 2,
  bathrooms: 1,
  floor: 4,
  totalFloors: 6,
  yearBuilt: 1970,
  energyClass: 'C',
  address: '25 Rue de la Convention',
  city: 'Paris',
  zipCode: '75015',
  latitude: 48.8434,
  longitude: 2.2945,
  features: {
    elevator: true,
    balcony: false,
    parking: false,
    cellar: true,
    garden: false,
    terrace: false,
    security: true,
    internet: true,
  },
  images: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800',
    'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800',
    'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800',
  ],
  virtualTour: 'https://example.com/virtual-tour',
  videoUrl: 'https://example.com/video',
  isFeatured: true,
  views: 245,
  createdAt: '2024-01-15',
  agent: {
    id: '1',
    name: 'Sophie Martin',
    email: 'sophie.martin@agence-premium.fr',
    phone: '+33 1 23 45 67 89',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  }
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const property = mockProperty

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
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
    }
    return types[type] || type
  }

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      AVAILABLE: 'Disponible',
      RESERVED: 'Réservé',
      SOLD: 'Vendu',
      RENTED: 'Loué',
    }
    return statuses[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
      AVAILABLE: 'success',
      RESERVED: 'warning',
      SOLD: 'destructive',
      RENTED: 'secondary',
    }
    return colors[status] || 'secondary'
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
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
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
            <Image
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
            />
            
            {/* Navigation Arrows */}
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

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>

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
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium">Année de construction</div>
                        <div className="text-sm text-gray-600">{property.yearBuilt}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <div className="text-sm font-bold text-primary-600">{property.energyClass}</div>
                      </div>
                      <div>
                        <div className="font-medium">Classe énergétique</div>
                        <div className="text-sm text-gray-600">DPE {property.energyClass}</div>
                      </div>
                    </div>
                    {property.floor && (
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
                  <div className="flex items-center space-x-4 mb-6">
                    <Image
                      src={property.agent.image}
                      alt={property.agent.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{property.agent.name}</h3>
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
    </div>
  )
}
