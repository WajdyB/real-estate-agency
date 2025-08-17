'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { Search, Calendar, User, ArrowRight, TrendingUp } from 'lucide-react'

// Mock data - en production, ces données viendraient de l'API
const mockBlogPosts = [
  {
    id: '1',
    title: 'Guide complet pour acheter son premier appartement en 2024',
    slug: 'guide-premier-achat-appartement-2024',
    excerpt: 'Découvrez tous nos conseils d\'experts pour réussir votre premier achat immobilier sans stress. De la recherche au financement, nous vous accompagnons.',
    content: 'Lorem ipsum dolor sit amet...',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    author: 'Sophie Martin',
    category: 'Conseils Achat',
    isPublished: true,
    views: 1250,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Tendances du marché immobilier français en 2024',
    slug: 'tendances-marche-immobilier-2024',
    excerpt: 'Analyse complète des tendances et prévisions pour le marché immobilier français. Prix, zones en croissance, opportunités d\'investissement.',
    content: 'Lorem ipsum dolor sit amet...',
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800',
    author: 'Jean Dubois',
    category: 'Marché Immobilier',
    isPublished: true,
    views: 890,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Comment bien préparer la vente de votre bien immobilier',
    slug: 'preparer-vente-bien-immobilier',
    excerpt: 'Les étapes clés pour maximiser la valeur de votre bien et accélérer sa vente. Home staging, prix, diagnostics et stratégie marketing.',
    content: 'Lorem ipsum dolor sit amet...',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    author: 'Marie Leroy',
    category: 'Vente',
    isPublished: true,
    views: 675,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
  },
  {
    id: '4',
    title: 'Investissement locatif : les meilleures stratégies 2024',
    slug: 'investissement-locatif-strategies-2024',
    excerpt: 'Découvrez les stratégies gagnantes pour investir dans l\'immobilier locatif. Rendements, fiscalité, choix des biens et gestion.',
    content: 'Lorem ipsum dolor sit amet...',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
    author: 'Pierre Moreau',
    category: 'Investissement',
    isPublished: true,
    views: 1120,
    createdAt: '2024-01-01T16:45:00Z',
    updatedAt: '2024-01-01T16:45:00Z',
  },
  {
    id: '5',
    title: 'Rénovation énergétique : aides et subventions disponibles',
    slug: 'renovation-energetique-aides-subventions',
    excerpt: 'Tour d\'horizon complet des aides financières pour vos travaux de rénovation énergétique. MaPrimeRénov\', CEE, éco-PTZ...',
    content: 'Lorem ipsum dolor sit amet...',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
    author: 'Claire Dubois',
    category: 'Rénovation',
    isPublished: true,
    views: 520,
    createdAt: '2023-12-28T11:20:00Z',
    updatedAt: '2023-12-28T11:20:00Z',
  },
  {
    id: '6',
    title: 'Acheter ou louer : comment faire le bon choix ?',
    slug: 'acheter-ou-louer-bon-choix',
    excerpt: 'Analyse comparative entre achat et location selon votre situation. Critères financiers, personnels et perspectives d\'évolution.',
    content: 'Lorem ipsum dolor sit amet...',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
    author: 'Thomas Bernard',
    category: 'Conseils',
    isPublished: true,
    views: 780,
    createdAt: '2023-12-20T13:10:00Z',
    updatedAt: '2023-12-20T13:10:00Z',
  },
]

const categories = [
  'Tous',
  'Conseils Achat',
  'Marché Immobilier', 
  'Vente',
  'Investissement',
  'Rénovation',
  'Conseils',
]

const featuredPost = mockBlogPosts[0]
const regularPosts = mockBlogPosts.slice(1)

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const filteredPosts = regularPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Blog Immobilier
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Conseils d'experts, analyses de marché et actualités pour réussir 
              tous vos projets immobiliers
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article en vedette</h2>
            <p className="text-gray-600">Notre sélection de la semaine</p>
          </div>

          <Card className="overflow-hidden hover:shadow-medium transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-[16/10] lg:aspect-auto">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="gold">{featuredPost.category}</Badge>
                </div>
              </div>
              <CardContent className="p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(featuredPost.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {featuredPost.views} vues
                    </div>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Button>
                      Lire l'article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Derniers articles
            </h2>
            <p className="text-gray-600">
              {filteredPosts.length} article(s) trouvé(s)
            </p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-medium transition-shadow group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.createdAt)}
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Lire la suite
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche.
              </p>
              <Button onClick={() => {
                setSearchTerm('')
                setSelectedCategory('Tous')
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
