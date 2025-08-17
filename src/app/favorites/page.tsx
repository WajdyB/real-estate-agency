'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import PropertyCard from '@/components/property/PropertyCard'
import { 
  Heart, 
  Search, 
  Filter, 
  Trash2,
  Share2,
  Download,
  Grid3X3,
  List,
  SortAsc
} from 'lucide-react'

// Mock data - en production, ces données viendraient de l'API
const mockFavorites = [
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
    addedToFavorites: '2024-01-20T10:30:00Z',
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
    addedToFavorites: '2024-01-19T14:20:00Z',
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
    addedToFavorites: '2024-01-18T16:45:00Z',
  },
]

export default function FavoritesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState(mockFavorites)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([])

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const handleRemoveFromFavorites = (propertyId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== propertyId))
    setSelectedFavorites(prev => prev.filter(id => id !== propertyId))
  }

  const handleSelectFavorite = (propertyId: string) => {
    setSelectedFavorites(prev => 
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const handleSelectAll = () => {
    setSelectedFavorites(
      selectedFavorites.length === favorites.length 
        ? [] 
        : favorites.map(fav => fav.id)
    )
  }

  const handleBulkRemove = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedFavorites.length} favori(s) ?`)) {
      setFavorites(prev => prev.filter(fav => !selectedFavorites.includes(fav.id)))
      setSelectedFavorites([])
    }
  }

  const filteredFavorites = favorites
    .filter(fav => 
      fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fav.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'surface-desc':
          return b.surface - a.surface
        case 'recent':
        default:
          return new Date(b.addedToFavorites).getTime() - new Date(a.addedToFavorites).getTime()
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Mes Favoris
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Retrouvez toutes les propriétés que vous avez sauvegardées
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                {favorites.length} propriété(s) sauvegardée(s)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher dans mes favoris..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="recent">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="surface-desc">Surface décroissante</option>
              </select>
              
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

          {/* Bulk Actions */}
          {selectedFavorites.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200 mb-6">
              <span className="text-sm text-primary-700">
                {selectedFavorites.length} élément(s) sélectionné(s)
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkRemove}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}

          {/* Select All */}
          {favorites.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFavorites.length === favorites.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Tout sélectionner ({filteredFavorites.length})
                </span>
              </label>
            </div>
          )}
        </div>
      </section>

      {/* Favorites Grid/List */}
      <section className="py-12">
        <div className="container">
          {filteredFavorites.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredFavorites.map((property) => (
                <div key={property.id} className="relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedFavorites.includes(property.id)}
                      onChange={() => handleSelectFavorite(property.id)}
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 bg-white/90"
                    />
                  </div>
                  
                  {/* Remove from Favorites Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => handleRemoveFromFavorites(property.id)}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-soft"
                      title="Retirer des favoris"
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </button>
                  </div>

                  <PropertyCard 
                    property={property} 
                    isFavorite={true}
                    onFavorite={() => handleRemoveFromFavorites(property.id)}
                  />
                  
                  {/* Added Date */}
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Ajouté le {new Date(property.addedToFavorites).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun favori trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Aucune propriété ne correspond à votre recherche "{searchTerm}".
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Effacer la recherche
              </Button>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun favori pour le moment
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez à sauvegarder vos propriétés préférées en cliquant sur le cœur 
                lors de vos recherches.
              </p>
              <Button onClick={() => router.push('/properties')}>
                Découvrir nos propriétés
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      {favorites.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <p className="text-gray-600">
                Gérez vos favoris plus efficacement
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <Card className="text-center hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Share2 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Partager</h3>
                  <p className="text-sm text-gray-600">Partagez vos favoris avec votre famille</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Download className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Exporter</h3>
                  <p className="text-sm text-gray-600">Téléchargez vos favoris en PDF</p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Filter className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Créer une alerte</h3>
                  <p className="text-sm text-gray-600">Recevez des biens similaires</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
