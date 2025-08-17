'use client'

import React, { useState } from 'react'
import { 
  FileText, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  TrendingUp,
  Clock
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock data - replace with real data from your API
  const blogPosts = [
    {
      id: 1,
      title: 'Guide complet pour acheter sa première maison',
      slug: 'guide-achat-premiere-maison',
      excerpt: 'Tout ce que vous devez savoir pour faire votre premier achat immobilier en toute sérénité...',
      content: 'Contenu complet de l\'article...',
      author: 'Sophie Bernard',
      status: 'published',
      publishedAt: '2024-01-20T10:00:00',
      updatedAt: '2024-01-20T10:00:00',
      views: 1247,
      likes: 89,
      comments: 23,
      tags: ['Achat', 'Premier achat', 'Conseils'],
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
    },
    {
      id: 2,
      title: 'Les tendances immobilières 2024',
      slug: 'tendances-immobilieres-2024',
      excerpt: 'Découvrez les nouvelles tendances qui vont marquer le marché immobilier cette année...',
      content: 'Contenu complet de l\'article...',
      author: 'Jean Martin',
      status: 'draft',
      publishedAt: null,
      updatedAt: '2024-01-19T15:30:00',
      views: 0,
      likes: 0,
      comments: 0,
      tags: ['Tendances', 'Marché', '2024'],
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
    },
    {
      id: 3,
      title: 'Investir dans l\'immobilier locatif',
      slug: 'investir-immobilier-locatif',
      excerpt: 'Stratégies et conseils pour réussir dans l\'investissement immobilier locatif...',
      content: 'Contenu complet de l\'article...',
      author: 'Marie Dubois',
      status: 'published',
      publishedAt: '2024-01-18T09:15:00',
      updatedAt: '2024-01-18T09:15:00',
      views: 892,
      likes: 67,
      comments: 18,
      tags: ['Investissement', 'Location', 'Rentabilité'],
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
    },
    {
      id: 4,
      title: 'Comment négocier le prix d\'une maison',
      slug: 'negocier-prix-maison',
      excerpt: 'Techniques et astuces pour négocier efficacement lors de l\'achat d\'un bien immobilier...',
      content: 'Contenu complet de l\'article...',
      author: 'Pierre Moreau',
      status: 'scheduled',
      publishedAt: '2024-01-25T08:00:00',
      updatedAt: '2024-01-17T14:20:00',
      views: 0,
      likes: 0,
      comments: 0,
      tags: ['Négociation', 'Prix', 'Achat'],
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'destructive'
    }
    
    const labels: Record<string, string> = {
      published: 'Publié',
      draft: 'Brouillon',
      scheduled: 'Programmé'
    }

    return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>
  }

  const getPublishedCount = () => {
    return blogPosts.filter(p => p.status === 'published').length
  }

  const getDraftCount = () => {
    return blogPosts.filter(p => p.status === 'draft').length
  }

  const getTotalViews = () => {
    return blogPosts.reduce((sum, p) => sum + p.views, 0)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non publié'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Gestion du blog</h1>
          <p className="text-gray-600">Créez et gérez le contenu de votre blog immobilier</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publiés</p>
              <p className="text-2xl font-bold text-gray-900">{getPublishedCount()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-gray-900">{getDraftCount()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vues totales</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalViews().toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{filteredPosts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and search */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par titre ou auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
              <option value="scheduled">Programmé</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </Card>

      {/* Blog posts list */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="flex items-start space-x-4">
              {/* Featured image */}
              <div className="flex-shrink-0">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{post.title}</h3>
                  {getStatusBadge(post.status)}
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {post.views} vues
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredPosts.length}</span> sur{' '}
          <span className="font-medium">{blogPosts.length}</span> résultats
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Précédent
          </Button>
          <Button variant="outline" size="sm" disabled>
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
