'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PropertyCard from '@/components/property/PropertyCard'
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  MapPin,
  Grid3X3,
  List,
  ChevronDown
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
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    isFeatured: true,
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    title: 'Loft industriel rénové - Belleville',
    price: 650000,
    type: 'LOFT',
    surface: 90,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    address: '18 Rue de Belleville',
    city: 'Paris',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    isFeatured: false,
    createdAt: '2024-01-08',
  },
  {
    id: '6',
    title: 'Appartement haussmannien - 8ème arrondissement',
    price: 1150000,
    type: 'APARTMENT',
    surface: 110,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    address: '32 Avenue des Champs-Élysées',
    city: 'Paris',
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
    isFeatured: true,
    createdAt: '2024-01-14',
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

const priceRanges = [
  { value: '', label: 'Tous budgets' },
  { value: '0-300000', label: 'Moins de 300 000 €' },
  { value: '300000-500000', label: '300 000 € - 500 000 €' },
  { value: '500000-800000', label: '500 000 € - 800 000 €' },
  { value: '800000-1200000', label: '800 000 € - 1 200 000 €' },
  { value: '1200000-', label: 'Plus de 1 200 000 €' },
]

const sortOptions = [
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'surface-desc', label: 'Surface décroissante' },
  { value: 'date-desc', label: 'Plus récents' },
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState(mockProperties)
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    priceRange: '',
    minSurface: '',
    rooms: '',
    city: '',
  })
  const [sortBy, setSortBy] = useState('date-desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...properties]

    // Filtre par recherche textuelle
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.address.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Filtre par type
    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type)
    }

    // Filtre par prix
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(property => {
        if (max) {
          return property.price >= min && property.price <= max
        } else {
          return property.price >= min
        }
      })
    }

    // Filtre par surface minimale
    if (filters.minSurface) {
      filtered = filtered.filter(property => property.surface >= parseInt(filters.minSurface))
    }

    // Filtre par nombre de pièces
    if (filters.rooms) {
      filtered = filtered.filter(property => property.rooms >= parseInt(filters.rooms))
    }

    // Filtre par ville
    if (filters.city) {
      filtered = filtered.filter(property =>
        property.city.toLowerCase().includes(filters.city.toLowerCase())
      )
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'surface-desc':
          return b.surface - a.surface
        case 'date-desc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredProperties(filtered)
  }, [filters, sortBy, properties])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      priceRange: '',
      minSurface: '',
      rooms: '',
      city: '',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Nos Propriétés
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Découvrez notre sélection de biens immobiliers d'exception, 
              soigneusement choisis pour leur qualité et leur emplacement.
            </p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {filteredProperties.length} propriétés disponibles
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher par titre, ville, adresse..."
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
                <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-primary-600'}`}
                >
                  <List className="w-4 h-4" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de bien
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {propertyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {priceRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pièces min
                    </label>
                    <select
                      value={filters.rooms}
                      onChange={(e) => handleFilterChange('rooms', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Indifférent</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={clearFilters}>
                    Effacer les filtres
                  </Button>
                  <div className="text-sm text-gray-600">
                    {filteredProperties.length} résultat(s) trouvé(s)
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sort & Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <p className="text-gray-600 mb-4 sm:mb-0">
              {filteredProperties.length} propriété(s) trouvée(s)
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container">
          {filteredProperties.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
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
              <Button onClick={clearFilters}>
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
