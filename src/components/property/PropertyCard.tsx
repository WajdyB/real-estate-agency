'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatSurface } from '@/lib/utils'
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye,
  Calendar
} from 'lucide-react'

interface Property {
  id: string
  title: string
  price: number
  type: string
  surface: number
  rooms: number
  bedrooms: number
  bathrooms: number
  address: string
  city: string
  images?: string[]
  isFeatured: boolean
  createdAt: string
}

interface PropertyCardProps {
  property: Property
  onFavorite?: (propertyId: string) => void
  isFavorite?: boolean
}

export default function PropertyCard({ 
  property, 
  onFavorite, 
  isFavorite = false 
}: PropertyCardProps) {
  const mainImage = property.images?.[0] || '/images/placeholders/property-1.svg'

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      APARTMENT: 'Appartement',
      HOUSE: 'Maison',
      STUDIO: 'Studio',
      LOFT: 'Loft',
      VILLA: 'Villa',
      COMMERCIAL: 'Commercial',
      LAND: 'Terrain',
      PARKING: 'Parking'
    }
    return types[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'gold'> = {
      APARTMENT: 'default',
      HOUSE: 'success',
      STUDIO: 'info',
      LOFT: 'warning',
      VILLA: 'gold',
      COMMERCIAL: 'secondary',
      LAND: 'success',
      PARKING: 'secondary'
    }
    return colors[type] || 'default'
  }

  return (
    <Card hover className="group overflow-hidden">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant={getTypeColor(property.type)}>
            {getTypeLabel(property.type)}
          </Badge>
          {property.isFeatured && (
            <Badge variant="gold">
              Premium
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onFavorite?.(property.id)}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-soft"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`} 
          />
        </button>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary">
              <Eye className="w-4 h-4 mr-2" />
              Voir
            </Button>
            <Button size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Visite
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-primary-700">
            {formatPrice(property.price)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">
            {property.address}, {property.city}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{formatSurface(property.surface)}</span>
          </div>
          <div className="flex items-center">
            <span>{property.rooms} pièces</span>
          </div>
          {property.bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/properties/${property.id}`} className="block">
          <Button className="w-full" size="sm">
            Voir les détails
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
