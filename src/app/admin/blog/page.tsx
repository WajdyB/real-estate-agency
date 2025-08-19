'use client'

import React, { useState, useEffect } from 'react'
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
  Clock,
  Loader2,
  X,
  Save,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Globe,
  Eye as EyeIcon,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

// Types for blog posts
interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  isPublished: boolean
  views: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

interface BlogResponse {
  success: boolean
  data: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    isPublished: false,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Fetch blog posts
  const fetchPosts = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        publishedOnly: 'false' // Get all posts including drafts
      })

      if (search) {
        params.append('search', search)
      }

      if (status !== 'all') {
        params.append('isPublished', status === 'published' ? 'true' : 'false')
      }

      const response = await fetch(`/api/blog?${params}`)
      const data: BlogResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch blog posts')
      }

      setPosts(data.data)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchPosts()
  }, [])

  // Handle search and status changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPosts(1, searchTerm, selectedStatus)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedStatus])

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchPosts(newPage, searchTerm, selectedStatus)
  }

  // Handle delete post
  const handleDeletePost = async (slug: string, postTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'article "${postTitle}" ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete post')
      }

      // Refresh the list
      fetchPosts(pagination.page, searchTerm, selectedStatus)
      toast.success(`Article "${postTitle}" supprimé avec succès`)
    } catch (err) {
      console.error('Error deleting post:', err)
      toast.error('Erreur lors de la suppression de l\'article')
    }
  }

  // Handle view post
  const handleViewPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedPost(data.data)
        setShowViewModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching post details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  // Handle edit post
  const handleEditPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedPost(data.data)
        setEditFormData({
          title: data.data.title || '',
          slug: data.data.slug || '',
          excerpt: data.data.excerpt || '',
          content: data.data.content || '',
          image: data.data.image || '',
          isPublished: data.data.isPublished,
        })
        setShowEditModal(true)
      } else {
        toast.error('Erreur lors du chargement des détails')
      }
    } catch (error) {
      console.error('Error fetching post details:', error)
      toast.error('Erreur lors du chargement des détails')
    }
  }

  // Handle edit form changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPost) return

    try {
      const response = await fetch(`/api/blog/${selectedPost.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      })

      const data = await response.json()

      if (data.success) {
        // Update the local state
        setPosts(posts.map(post => 
          post.id === selectedPost.id 
            ? { ...post, ...editFormData }
            : post
        ))
        setShowEditModal(false)
        setSelectedPost(null)
        toast.success('Article mis à jour avec succès')
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'published' && post.isPublished) ||
                         (selectedStatus === 'draft' && !post.isPublished)
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (isPublished: boolean) => {
    if (isPublished) {
      return <Badge variant="default">Publié</Badge>
    } else {
      return <Badge variant="secondary">Brouillon</Badge>
    }
  }

  const getPublishedCount = () => {
    return posts.filter(p => p.isPublished).length
  }

  const getDraftCount = () => {
    return posts.filter(p => !p.isPublished).length
  }

  const getTotalViews = () => {
    return posts.reduce((sum, p) => sum + p.views, 0)
  }

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Chargement des articles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => fetchPosts()}>
          Réessayer
        </Button>
      </div>
    )
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
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
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
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </Card>

      {/* Blog posts list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-start space-x-4">
                {/* Featured image */}
                <div className="flex-shrink-0">
                  <img
                    src={post.image || '/images/placeholders/blog-1.svg'}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{post.title}</h3>
                    {getStatusBadge(post.isPublished)}
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Agence Premium
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {post.isPublished ? formatDate(post.publishedAt || post.createdAt) : 'Non publié'}
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views} vues
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Immobilier
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewPost(post.slug)}
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditPost(post.slug)}
                    title="Modifier l'article"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePost(post.slug, post.title)}
                    title="Supprimer l'article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun article trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche.
          </p>
          <Button onClick={() => {
            setSearchTerm('')
            setSelectedStatus('all')
          }}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">{(pagination.page - 1) * 10 + 1}</span> à{' '}
            <span className="font-medium">{Math.min(pagination.page * 10, pagination.total)}</span> sur{' '}
            <span className="font-medium">{pagination.total}</span> résultats
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!pagination.hasPrevPage}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Précédent
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!pagination.hasNextPage}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Suivant
            </Button>
          </div>
                 </div>
       )}

       {/* View Blog Post Modal */}
       {showViewModal && selectedPost && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
             {/* Header */}
             <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-xl">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="p-2 bg-primary-100 rounded-lg">
                     <FileTextIcon className="w-6 h-6 text-primary-600" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-bold text-gray-900">Détails de l'article</h2>
                     <p className="text-gray-600">Informations complètes et gestion</p>
                   </div>
                 </div>
                 <button
                   onClick={() => setShowViewModal(false)}
                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                 >
                   <X className="w-6 h-6 text-gray-500" />
                 </button>
               </div>
             </div>

             <div className="p-8">
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                 {/* Main Content - 2 columns */}
                 <div className="xl:col-span-2 space-y-8">
                   {/* Hero Section */}
                   <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6">
                     <div className="flex items-start justify-between mb-4">
                       <div>
                         <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPost.title}</h1>
                         <div className="flex items-center gap-4 text-gray-600">
                           <div className="flex items-center gap-2">
                             <User className="w-4 h-4" />
                             <span>Agence Premium</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4" />
                             <span>{formatDate(selectedPost.createdAt)}</span>
                           </div>
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="text-2xl font-bold text-primary-600">{selectedPost.views}</div>
                         <div className="text-sm text-gray-600">vues</div>
                       </div>
                     </div>
                     <p className="text-gray-700 leading-relaxed">{selectedPost.excerpt}</p>
                   </div>

                   {/* Featured Image */}
                   {selectedPost.image && (
                     <Card>
                       <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                           <ImageIcon className="w-5 h-5" />
                           Image principale
                         </CardTitle>
                       </CardHeader>
                       <CardContent>
                         <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                           <img
                             src={selectedPost.image}
                             alt={selectedPost.title}
                             className="w-full h-full object-cover"
                           />
                         </div>
                       </CardContent>
                     </Card>
                   )}

                   {/* Content */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <FileTextIcon className="w-5 h-5" />
                         Contenu de l'article
                       </CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="prose max-w-none">
                         <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                       </div>
                     </CardContent>
                   </Card>
                 </div>

                 {/* Sidebar */}
                 <div className="space-y-6">
                   {/* Status & Actions */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <BarChart3 className="w-5 h-5" />
                         Statut & Actions
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex flex-wrap gap-2">
                         <Badge variant={selectedPost.isPublished ? 'default' : 'secondary'} className="text-sm">
                           {selectedPost.isPublished ? 'Publié' : 'Brouillon'}
                         </Badge>
                       </div>
                       <div className="pt-4 border-t">
                         <Button onClick={() => {
                           setShowViewModal(false)
                           handleEditPost(selectedPost.slug)
                         }} className="w-full mb-2">
                           <Edit className="w-4 h-4 mr-2" />
                           Modifier
                         </Button>
                         <Button 
                           variant="outline" 
                           onClick={() => {
                             setShowViewModal(false)
                             handleDeletePost(selectedPost.slug, selectedPost.title)
                           }}
                           className="w-full"
                         >
                           <Trash2 className="w-4 h-4 mr-2" />
                           Supprimer
                         </Button>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Analytics */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <BarChart3 className="w-5 h-5" />
                         Statistiques
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <EyeIcon className="w-4 h-4 text-blue-500" />
                           <span className="text-sm text-gray-600">Vues</span>
                         </div>
                         <span className="font-semibold text-gray-900">{selectedPost.views}</span>
                       </div>
                     </CardContent>
                   </Card>

                   {/* Dates */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <Calendar className="w-5 h-5" />
                         Informations temporelles
                       </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                       <div>
                         <label className="text-sm font-medium text-gray-500">Créé le</label>
                         <p className="text-sm text-gray-900">{new Date(selectedPost.createdAt).toLocaleDateString('fr-FR')}</p>
                       </div>
                       <div>
                         <label className="text-sm font-medium text-gray-500">Modifié le</label>
                         <p className="text-sm text-gray-900">{new Date(selectedPost.updatedAt).toLocaleDateString('fr-FR')}</p>
                       </div>
                       {selectedPost.publishedAt && (
                         <div>
                           <label className="text-sm font-medium text-gray-500">Publié le</label>
                           <p className="text-sm text-gray-900">{new Date(selectedPost.publishedAt).toLocaleDateString('fr-FR')}</p>
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Blog Post Modal */}
       {showEditModal && selectedPost && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b">
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-gray-900">Modifier l'article</h2>
                 <button
                   onClick={() => setShowEditModal(false)}
                   className="text-gray-400 hover:text-gray-600"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>
             </div>
             <div className="p-6">
               <form onSubmit={handleEditSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                       Titre *
                     </label>
                     <Input
                       id="edit-title"
                       name="title"
                       type="text"
                       required
                       value={editFormData.title}
                       onChange={handleEditChange}
                       placeholder="Titre de l'article"
                     />
                   </div>

                   <div>
                     <label htmlFor="edit-slug" className="block text-sm font-medium text-gray-700 mb-2">
                       Slug *
                     </label>
                     <Input
                       id="edit-slug"
                       name="slug"
                       type="text"
                       required
                       value={editFormData.slug}
                       onChange={handleEditChange}
                       placeholder="slug-de-larticle"
                     />
                   </div>
                 </div>

                 <div>
                   <label htmlFor="edit-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                     Extrait *
                   </label>
                   <textarea
                     id="edit-excerpt"
                     name="excerpt"
                     required
                     value={editFormData.excerpt}
                     onChange={handleEditChange}
                     placeholder="Extrait de l'article"
                     rows={3}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                   />
                 </div>

                 <div>
                   <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-2">
                     URL de l'image
                   </label>
                   <Input
                     id="edit-image"
                     name="image"
                     type="url"
                     value={editFormData.image}
                     onChange={handleEditChange}
                     placeholder="https://example.com/image.jpg"
                   />
                 </div>

                 <div>
                   <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                     Contenu *
                   </label>
                   <textarea
                     id="edit-content"
                     name="content"
                     required
                     value={editFormData.content}
                     onChange={handleEditChange}
                     placeholder="Contenu de l'article"
                     rows={10}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                   />
                 </div>

                 <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       id="edit-isPublished"
                       name="isPublished"
                       checked={editFormData.isPublished}
                       onChange={handleEditChange}
                       className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                     />
                     <label htmlFor="edit-isPublished" className="text-sm font-medium text-gray-700">
                       Publié
                     </label>
                   </div>
                 </div>

                 <div className="flex justify-end space-x-3">
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => setShowEditModal(false)}
                   >
                     Annuler
                   </Button>
                   <Button type="submit">
                     <Save className="w-4 h-4 mr-2" />
                     Enregistrer
                   </Button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }
