import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/estimation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  try {
    // Pages des propriétés
    const properties = await prisma.property.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true },
    })

    const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.id}`,
      lastModified: property.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // Pages du blog
    const blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true },
    })

    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

    return [...staticPages, ...propertyPages, ...blogPages]
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error)
    return staticPages
  }
}
