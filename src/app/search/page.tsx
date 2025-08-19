'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  Filter,
  Loader2,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { formatPrice, formatSurface } from '@/lib/utils'

// Types for search functionality
interface Property {
  id: string
  title: string
  description: string
  price: number
  surface: number
  bedrooms: number
  bathrooms: number
  type: string
  category: string
  status: string
  address: string
  city: string
  postalCode: string
  latitude: number
  longitude: number
  images: string[]
  features: string[]
  views: number
  createdAt: string
  updatedAt: string
  agent: {
    id: string
    name: string
    email: string
    phone: string
    image?: string
  }
  _count: {
    favorites: number
    reviews: number
  }
}

interface SearchFilters {
  query: string
  type: string
  category: string
  minPrice: string
  maxPrice: string
  minSurface: string
  maxSurface: string
  bedrooms: string
  bathrooms: string
  city: string
  postalCode: string
  features: string[]
}

interface SearchSuggestion {
  type: 'city' | 'property' | 'address'
  text: string
  subtitle: string
  value: string
  id?: string
}

interface AvailableFilters {
  cities: string[]
  categories: string[]
  priceRange: { min: number; max: number }
  surfaceRange: { min: number; max: number }
  features: string[]
  propertyTypes: Array<{ type: string; count: number }>
  bedrooms: number[]
  bathrooms: number[]
}

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map')
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    maxSurface: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    postalCode: '',
    features: []
  })

  // Fetch available filters
  const fetchFilters = useCallback(async () => {
    try {
      const response = await fetch('/api/search/filters')
      const data = await response.json()
      
      if (data.success) {
        setAvailableFilters(data.data)
      }
    } catch (err) {
      console.error('Error fetching filters:', err)
    }
  }, [])

  // Fetch autocomplete suggestions
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setSuggestions(data.data)
        setShowAutocomplete(true)
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    }
  }, [])

  // Fetch search results
  const fetchResults = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.append(key, value.join(','))
            }
          } else {
            params.append(key, value)
          }
        }
      })

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch search results')
      }

      setProperties(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching search results:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch search results')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Handle filter changes
  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'city') {
      handleFilterChange('city', suggestion.value)
    } else if (suggestion.type === 'property') {
      handleFilterChange('query', suggestion.value)
    } else if (suggestion.type === 'address') {
      handleFilterChange('query', suggestion.value)
    }
    setShowAutocomplete(false)
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults(1)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters, fetchResults])

  // Fetch filters on mount
  useEffect(() => {
    fetchFilters()
  }, [fetchFilters])

  // Handle autocomplete
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(filters.query)
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [filters.query, fetchSuggestions])

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
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher par ville, quartier, adresse..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  onFocus={() => setShowAutocomplete(true)}
                  className="pl-10"
                />
                {filters.query && (
                  <button
                    onClick={() => handleFilterChange('query', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete dropdown */}
              {showAutocomplete && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{suggestion.text}</div>
                      <div className="text-sm text-gray-500">{suggestion.subtitle}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtres
                {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
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
          {showFilters && availableFilters && (
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
                      {availableFilters.propertyTypes.map(pt => (
                        <option key={pt.type} value={pt.type}>
                          {pt.type} ({pt.count})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Toutes catégories</option>
                      {availableFilters.categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Toutes les villes</option>
                      {availableFilters.cities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chambres
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Toutes</option>
                      {availableFilters.bedrooms.map(bed => (
                        <option key={bed} value={bed}>
                          {bed}+ chambres
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix minimum (€)
                    </label>
                    <Input
                      type="number"
                      placeholder={`Min: ${formatPrice(availableFilters.priceRange.min)}`}
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
                      placeholder={`Max: ${formatPrice(availableFilters.priceRange.max)}`}
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
                      placeholder={`Min: ${availableFilters.surfaceRange.min}m²`}
                      value={filters.minSurface}
                      onChange={(e) => handleFilterChange('minSurface', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surface max (m²)
                    </label>
                    <Input
                      type="number"
                      placeholder={`Max: ${availableFilters.surfaceRange.max}m²`}
                      value={filters.maxSurface}
                      onChange={(e) => handleFilterChange('maxSurface', e.target.value)}
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
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
              <p className="text-gray-600">Recherche en cours...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Erreur de recherche
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => fetchResults()}>
                Réessayer
              </Button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <PropertyMap
                  properties={properties}
                  height="600px"
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                />
              </div>
              
              {/* Property List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {pagination.total} propriétés trouvées
                  </h3>
                </div>
                
                {properties.map((property) => (
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
                  {pagination.total} propriétés trouvées
                </h3>
              </div>
              
              {properties.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => fetchResults(pagination.page - 1)}
                          disabled={!pagination.hasPrevPage}
                        >
                          Précédent
                        </Button>
                        
                        <span className="px-4 py-2 text-sm text-gray-600">
                          Page {pagination.page} sur {pagination.totalPages}
                        </span>
                        
                        <Button
                          variant="outline"
                          onClick={() => fetchResults(pagination.page + 1)}
                          disabled={!pagination.hasNextPage}
                        >
                          Suivant
                        </Button>
                      </div>
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
                  <Button onClick={() => setFilters({
                    query: '',
                    type: '',
                    category: '',
                    minPrice: '',
                    maxPrice: '',
                    minSurface: '',
                    maxSurface: '',
                    bedrooms: '',
                    bathrooms: '',
                    city: '',
                    postalCode: '',
                    features: []
                  })}>
                    Effacer les filtres
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
