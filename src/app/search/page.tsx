'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyMap from '@/components/maps/PropertyMap'
import { 
  Search, 
  SlidersHorizontal, 
  Map, 
  Grid3X3,
  MapPin,
  Filter
} from 'lucide-react'

// Mock data - en production, ces données viendraient de l'API
const mockProperties = [
  {
    id: '1',
    title: 'Appartement moderne 3 pièces - Paris 15ème',
    price: 485000,
    type: 'APARTMENT',
    surface: 75,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    address: '25 Rue de la Convention',
    city: 'Paris',
    latitude: 48.8434,
    longitude: 2.2945,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    isFeatured: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Maison familiale avec jardin - Neuilly-sur-Seine',
    price: 1250000,
    type: 'HOUSE',
    surface: 120,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    address: '12 Avenue du Général de Gaulle',
    city: 'Neuilly-sur-Seine',
    latitude: 48.8846,
    longitude: 2.2691,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    isFeatured: true,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Studio lumineux - Quartier Latin',
    price: 295000,
    type: 'STUDIO',
    surface: 25,
    rooms: 1,
    bedrooms: 0,
    bathrooms: 1,
    address: '8 Rue de la Huchette',
    city: 'Paris',
    latitude: 48.8529,
    longitude: 2.3469,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    isFeatured: false,
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    title: 'Villa contemporaine avec piscine - Cannes',
    price: 2800000,
    type: 'VILLA',
    surface: 200,
    rooms: 6,
    bedrooms: 5,
    bathrooms: 3,
    address: '45 Boulevard de la Croisette',
    city: 'Cannes',
    latitude: 43.5528,
    longitude: 7.0174,
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    isFeatured: true,
    createdAt: '2024-01-12',
  },
]

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map')
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    rooms: '',
    city: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Recherche Avancée
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Trouvez votre propriété idéale avec notre outil de recherche interactif
            </p>
          </div>
        </div>
      </section>

      {/* Search Controls */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher par ville, quartier, adresse..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 ${viewMode === 'map' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600'}`}
                >
                  <Map className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtres avancés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de bien
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Tous types</option>
                      <option value="APARTMENT">Appartement</option>
                      <option value="HOUSE">Maison</option>
                      <option value="STUDIO">Studio</option>
                      <option value="LOFT">Loft</option>
                      <option value="VILLA">Villa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix minimum (€)
                    </label>
                    <Input
                      type="number"
                      placeholder="Ex: 200000"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix maximum (€)
                    </label>
                    <Input
                      type="number"
                      placeholder="Ex: 800000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surface min (m²)
                    </label>
                    <Input
                      type="number"
                      placeholder="Ex: 50"
                      value={filters.minSurface}
                      onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container">
          {viewMode === 'map' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <PropertyMap
                  properties={mockProperties}
                  height="600px"
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                />
              </div>
              
              {/* Property List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {mockProperties.length} propriétés trouvées
                  </h3>
                </div>
                
                {mockProperties.map((property) => (
                  <div
                    key={property.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedProperty === property.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mockProperties.length} propriétés trouvées
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}

          {mockProperties.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune propriété trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche pour voir plus de résultats.
              </p>
              <Button onClick={() => setFilters({
                search: '',
                type: '',
                minPrice: '',
                maxPrice: '',
                minSurface: '',
                rooms: '',
                city: '',
              })}>
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
