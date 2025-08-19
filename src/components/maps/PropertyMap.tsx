'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/Skeleton'

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)

interface Property {
  id: string
  title: string
  price: number
  latitude: number
  longitude: number
  address: string
  city: string
  type: string
  surface: number
}

interface PropertyMapProps {
  properties: Property[]
  center?: [number, number]
  zoom?: number
  height?: string
  selectedProperty?: string | null
  onPropertySelect?: (propertyId: string) => void
}

export default function PropertyMap({ 
  properties, 
  center = [48.8566, 2.3522], // Paris par défaut
  zoom = 12,
  height = '400px',
  selectedProperty,
  onPropertySelect 
}: PropertyMapProps) {
  // Find a valid center position from properties if available
  const validProperties = properties.filter(property => 
    property.latitude != null && 
    property.longitude != null && 
    !isNaN(property.latitude) && 
    !isNaN(property.longitude)
  )
  
  const mapCenter = validProperties.length > 0 
    ? [validProperties[0].latitude, validProperties[0].longitude] 
    : center

  // Debug logging
  if (properties.length > 0 && validProperties.length === 0) {
    console.warn('PropertyMap: All properties have invalid coordinates:', properties.map(p => ({
      id: p.id,
      title: p.title,
      lat: p.latitude,
      lng: p.longitude
    })))
  }
  const [isClient, setIsClient] = useState(false)
  const [map, setMap] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (map && selectedProperty) {
      const property = properties.find(p => p.id === selectedProperty)
      if (property && 
          property.latitude != null && 
          property.longitude != null && 
          !isNaN(property.latitude) && 
          !isNaN(property.longitude)) {
        map.setView([property.latitude, property.longitude], 15)
      }
    }
  }, [map, selectedProperty, properties])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
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

  if (!isClient) {
    return (
      <div className="w-full rounded-lg overflow-hidden" style={{ height }}>
        <Skeleton className="w-full h-full" />
      </div>
    )
  }

  // Don't render map if no valid center position
  if (!mapCenter || mapCenter[0] == null || mapCenter[1] == null || 
      isNaN(mapCenter[0]) || isNaN(mapCenter[1])) {
    return (
      <div className="w-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center" style={{ height }}>
        <div className="text-center text-gray-500">
          <p>Aucune position valide disponible pour afficher la carte</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties
          .filter(property => 
            property.latitude != null && 
            property.longitude != null && 
            !isNaN(property.latitude) && 
            !isNaN(property.longitude)
          )
          .map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            eventHandlers={{
              click: () => onPropertySelect?.(property.id),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{getTypeLabel(property.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Surface:</span>
                    <span className="font-medium">{property.surface} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix:</span>
                    <span className="font-bold text-primary-600">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {property.address}, {property.city}
                  </p>
                </div>
                <div className="mt-2">
                  <a
                    href={`/properties/${property.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center bg-primary-600 text-white px-3 py-1 rounded text-xs hover:bg-primary-700 transition-colors"
                  >
                    Voir les détails
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
