'use client'

import React from 'react'
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
  Mail
} from 'lucide-react'

// Mock data - en production, ces données viendraient de l'API
const mockBlogPost = {
  id: '1',
  title: 'Guide complet pour acheter son premier appartement en 2024',
  slug: 'guide-premier-achat-appartement-2024',
  excerpt: 'Découvrez tous nos conseils d\'experts pour réussir votre premier achat immobilier sans stress. De la recherche au financement, nous vous accompagnons.',
  content: `
    <h2>Introduction</h2>
    <p>Acheter son premier appartement est une étape importante de la vie. C'est souvent l'investissement le plus important que vous ferez, et il est normal de se sentir un peu dépassé par toutes les démarches à effectuer.</p>
    
    <p>Dans ce guide complet, nous vous accompagnons pas à pas dans votre projet d'achat immobilier, de la définition de votre budget jusqu'à la remise des clés.</p>

    <h2>1. Définir votre budget</h2>
    <p>Avant de commencer vos recherches, il est essentiel de définir précisément votre budget. Celui-ci doit tenir compte de plusieurs éléments :</p>
    
    <ul>
      <li><strong>Votre apport personnel</strong> : généralement 10% du prix d'achat minimum</li>
      <li><strong>Votre capacité d'emprunt</strong> : calculée selon vos revenus et charges</li>
      <li><strong>Les frais annexes</strong> : notaire, garantie, assurance (environ 8% du prix)</li>
      <li><strong>Les travaux éventuels</strong> : prévoyez une réserve pour les imprévus</li>
    </ul>

    <h2>2. Obtenir un accord de principe</h2>
    <p>Une fois votre budget défini, rendez-vous chez votre banquier ou courtier pour obtenir un accord de principe. Ce document vous permettra de :</p>
    
    <ul>
      <li>Crédibiliser vos offres d'achat</li>
      <li>Négocier plus efficacement</li>
      <li>Accélérer le processus d'achat</li>
    </ul>

    <h2>3. Définir vos critères de recherche</h2>
    <p>Listez vos critères essentiels et secondaires :</p>
    
    <h3>Critères essentiels :</h3>
    <ul>
      <li>Localisation (proximité travail, transports, écoles)</li>
      <li>Surface minimale</li>
      <li>Nombre de pièces</li>
      <li>Étage (avec ou sans ascenseur)</li>
    </ul>

    <h3>Critères secondaires :</h3>
    <ul>
      <li>Balcon ou terrasse</li>
      <li>Parking</li>
      <li>Cave ou cellier</li>
      <li>Exposition</li>
    </ul>

    <h2>4. La recherche active</h2>
    <p>Multipliez les canaux de recherche :</p>
    
    <ul>
      <li><strong>Agences immobilières</strong> : expertise locale et accompagnement personnalisé</li>
      <li><strong>Portails en ligne</strong> : large choix et mise à jour régulière</li>
      <li><strong>Notaires</strong> : ventes de succession parfois intéressantes</li>
      <li><strong>Bouche-à-oreille</strong> : n'hésitez pas à faire savoir que vous cherchez</li>
    </ul>

    <h2>5. Les visites</h2>
    <p>Lors des visites, soyez méthodique :</p>
    
    <ul>
      <li>Visitez à différents moments de la journée si possible</li>
      <li>Vérifiez l'état général (plomberie, électricité, isolation)</li>
      <li>Renseignez-vous sur les charges de copropriété</li>
      <li>Demandez le règlement de copropriété et les PV d'AG</li>
    </ul>

    <h2>6. Faire une offre</h2>
    <p>Une fois le bien trouvé :</p>
    
    <ul>
      <li>Étudiez les prix du marché local</li>
      <li>N'hésitez pas à négocier (5 à 10% en général)</li>
      <li>Formalisez votre offre par écrit</li>
      <li>Prévoyez des conditions suspensives</li>
    </ul>

    <h2>7. Le compromis de vente</h2>
    <p>Une fois votre offre acceptée, vous signerez un compromis de vente qui fixe :</p>
    
    <ul>
      <li>Le prix définitif</li>
      <li>Les conditions suspensives</li>
      <li>La date de signature chez le notaire</li>
      <li>Le montant du dépôt de garantie (5 à 10%)</li>
    </ul>

    <h2>8. Finaliser le financement</h2>
    <p>Vous avez généralement 45 jours pour :</p>
    
    <ul>
      <li>Finaliser votre dossier de prêt</li>
      <li>Souscrire l'assurance emprunteur</li>
      <li>Obtenir l'offre de prêt définitive</li>
    </ul>

    <h2>Conclusion</h2>
    <p>Acheter son premier appartement demande du temps et de la préparation, mais c'est un projet passionnant qui vous permettra de devenir propriétaire et de constituer un patrimoine.</p>
    
    <p>N'hésitez pas à vous faire accompagner par des professionnels : agent immobilier, courtier, notaire. Leur expertise vous fera gagner du temps et vous évitera des erreurs coûteuses.</p>

    <p><strong>Notre équipe d'experts reste à votre disposition pour vous accompagner dans votre projet d'achat immobilier.</strong></p>
  `,
  image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
  author: 'Sophie Martin',
      authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  authorBio: 'Experte en immobilier depuis plus de 10 ans, Sophie accompagne les primo-accédants dans leur projet d\'achat.',
  category: 'Conseils Achat',
  readingTime: '8 min',
  isPublished: true,
  views: 1250,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
}

const relatedPosts = [
  {
    id: '2',
    title: 'Comment négocier le prix d\'un appartement ?',
    slug: 'negocier-prix-appartement',
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400',
    category: 'Conseils Achat',
    createdAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Les erreurs à éviter lors d\'un premier achat',
    slug: 'erreurs-eviter-premier-achat',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    category: 'Conseils',
    createdAt: '2024-01-08T09:15:00Z',
  },
  {
    id: '4',
    title: 'Financement immobilier : tout savoir sur les prêts',
    slug: 'financement-immobilier-prets',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    category: 'Financement',
    createdAt: '2024-01-05T16:45:00Z',
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = mockBlogPost // En production, fetch basé sur params.slug

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`
  const shareTitle = encodeURIComponent(post.title)

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
            src={post.image}
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
                  {post.category}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {post.readingTime} de lecture
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
                        src={post.authorImage}
                        alt={post.author}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          À propos de {post.author}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {post.authorBio}
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
                  <Button variant="outline" size="sm" className="w-full mb-3">
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager l'article
                  </Button>
                  <div className="text-sm text-gray-600 text-center">
                    {post.views} vues • {post.readingTime}
                  </div>
                </CardContent>
              </Card>

              {/* Related Articles */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Articles similaires
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
                              {relatedPost.title}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <Badge variant="outline" className="text-xs mr-2">
                                {relatedPost.category}
                              </Badge>
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(relatedPost.createdAt)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
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
