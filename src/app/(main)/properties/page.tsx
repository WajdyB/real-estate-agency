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
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Types for our API responses
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
  }
}

interface ApiResponse {
  success: boolean
  data: Property[]
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

const propertyTypes = [
  { value: '', label: 'Tous types' },
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'LOFT', label: 'Loft' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Terrain' },
  { value: 'PARKING', label: 'Parking' },
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
  { value: 'createdAt-desc', label: 'Plus récents' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'surface-desc', label: 'Surface décroissante' },
  { value: 'views-desc', label: 'Plus vus' },
]

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    priceRange: '',
    minSurface: '',
    rooms: '',
    city: '',
  })
  const [sortBy, setSortBy] = useState('createdAt-desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  // Fetch properties from API
  const fetchProperties = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sortBy.split('-')[0],
        sortOrder: sortBy.split('-')[1] || 'desc',
      })

      // Add filters
      if (filters.search) params.append('search', filters.search)
      if (filters.type) params.append('type', filters.type)
      if (filters.city) params.append('city', filters.city)
      if (filters.minSurface) params.append('minSurface', filters.minSurface)
      if (filters.rooms) params.append('rooms', filters.rooms)

      // Handle price range
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number)
        if (min !== undefined) params.append('minPrice', min.toString())
        if (max !== undefined) params.append('maxPrice', max.toString())
      }

      const response = await fetch(`/api/properties?${params.toString()}`)
      const data: ApiResponse = await response.json()

      if (data.success) {
        setProperties(data.data)
        if (data.pagination) {
          setPagination(data.pagination)
        }
      } else {
        setError(data.error || 'Failed to fetch properties')
      }
    } catch (err) {
      console.error('Error fetching properties:', err)
      setError('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  // Fetch properties when filters or sort changes
  useEffect(() => {
    fetchProperties(1)
  }, [filters, sortBy])

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

  const handlePageChange = (newPage: number) => {
    fetchProperties(newPage)
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
                {pagination.total} propriétés disponibles
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
                    {pagination.total} résultat(s) trouvé(s)
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sort & Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <p className="text-gray-600 mb-4 sm:mb-0">
              {pagination.total} propriété(s) trouvée(s)
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
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Chargement des propriétés...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => fetchProperties(1)}>
                Réessayer
              </Button>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Précédent
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === pagination.page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="flex items-center"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
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
