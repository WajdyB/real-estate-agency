'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Loader2
} from 'lucide-react'

// Types for blog post
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
}

interface BlogResponse {
  success: boolean
  data: BlogPost
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch blog post
  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/blog/${params.slug}`)
      const data: BlogResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch blog post')
      }

      setPost(data.data)
    } catch (err) {
      console.error('Error fetching blog post:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch blog post')
    } finally {
      setLoading(false)
    }
  }

  // Fetch post on component mount
  useEffect(() => {
    fetchPost()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Article non trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "L'article que vous recherchez n'existe pas ou a été supprimé."}
          </p>
          <Link href="/blog">
            <Button>
              Retour au blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/blog/${post.slug}`
  const shareTitle = encodeURIComponent(post.title)

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(' ').length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container py-4">
          <Link href="/blog" className="flex items-center text-gray-600 hover:text-primary-600">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative">
        <div className="aspect-[21/9] relative">
          <Image
            src={post.image || '/images/placeholders/blog-1.svg'}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Article Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container">
              <div className="max-w-4xl">
                <Badge variant="gold" className="mb-4">
                  Immobilier
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Agence Premium
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {readingTime} min de lecture
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {post.views} vues
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-3">
              <div className="max-w-none">
                {/* Article Excerpt */}
                <div className="text-xl text-gray-600 leading-relaxed mb-8 p-6 bg-primary-50 rounded-lg border-l-4 border-primary-500">
                  {post.excerpt}
                </div>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-display prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-sm">
                      Immobilier
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Conseils
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      Marché
                    </Badge>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Partager cet article
                  </h3>
                  <div className="flex space-x-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={`mailto:?subject=${shareTitle}&body=Je%20pense%20que%20cet%20article%20pourrait%20vous%20intéresser%20:%20${shareUrl}`}
                      className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Author Bio */}
                <Card className="mt-12">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src="/images/placeholders/avatar-1.svg"
                        alt="Agence Premium"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          À propos de l'Agence Premium
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Expert en immobilier avec une expertise approfondie dans le domaine.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Share Sticky */}
              <Card className="sticky top-32">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Partager
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mb-3"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          text: post.excerpt,
                          url: shareUrl,
                        })
                      } else {
                        navigator.clipboard.writeText(shareUrl)
                        // You could add a toast notification here
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager l'article
                  </Button>
                  <div className="text-sm text-gray-600 text-center">
                    {post.views} vues • {readingTime} min
                  </div>
                </CardContent>
              </Card>

              {/* Article Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Informations
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Publié le:</span>
                      <span className="text-gray-900">{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vues:</span>
                      <span className="text-gray-900">{post.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
