import type { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  price?: number
  currency?: string
  availability?: string
}

const defaultMetadata = {
  title: 'Agence Immobilière Premium',
  description: 'Découvrez notre sélection exclusive de propriétés immobilières. Achat, vente, location avec notre équipe d\'experts. Service personnalisé et accompagnement sur mesure.',
  keywords: 'immobilier, achat, vente, location, appartement, maison, villa, Paris, France',
  image: '/images/og-default.jpg',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

export function generateMetadata({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  price,
  currency = 'EUR',
  availability = 'in stock',
}: SEOProps = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${defaultMetadata.title}`
    : defaultMetadata.title

  const fullDescription = description || defaultMetadata.description
  const fullKeywords = keywords || defaultMetadata.keywords
  const fullImage = image || defaultMetadata.image
  const fullUrl = url || defaultMetadata.url

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: fullKeywords,
    authors: author ? [{ name: author }] : [{ name: 'Agence Immobilière Premium' }],
    creator: 'Agence Immobilière Premium',
    publisher: 'Agence Immobilière Premium',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(defaultMetadata.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: 'fr_FR',
      url: fullUrl,
      title: fullTitle,
      description: fullDescription,
      siteName: defaultMetadata.title,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  // Ajout des données structurées pour les articles
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
    }
  }

  // Ajout des données structurées pour les produits immobiliers
  if (type === 'product' && price) {
    metadata.other = {
      'product:price:amount': price.toString(),
      'product:price:currency': currency,
      'product:availability': availability,
    }
  }

  return metadata
}

export function generatePropertyMetadata(property: {
  id: string
  title: string
  description: string
  price: number
  type: string
  surface: number
  rooms: number
  city: string
  images?: string[]
}) {
  const propertyTypes: Record<string, string> = {
    APARTMENT: 'Appartement',
    HOUSE: 'Maison',
    STUDIO: 'Studio',
    LOFT: 'Loft',
    VILLA: 'Villa',
  }

  const typeLabel = propertyTypes[property.type] || property.type
  const priceFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price)

  return generateMetadata({
    title: `${property.title} - ${priceFormatted}`,
    description: `${typeLabel} de ${property.surface}m² à ${property.city}. ${property.description.substring(0, 160)}...`,
    keywords: `${typeLabel.toLowerCase()}, ${property.city.toLowerCase()}, ${property.surface}m², ${property.rooms} pièces, immobilier ${property.city.toLowerCase()}`,
    image: property.images?.[0],
    url: `/properties/${property.id}`,
    type: 'product',
    price: property.price,
    currency: 'EUR',
    availability: 'in stock',
  })
}

export function generateBlogMetadata(post: {
  id: string
  title: string
  excerpt: string
  content: string
  image?: string
  createdAt: string
  updatedAt: string
}) {
  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    keywords: `blog immobilier, conseils immobilier, ${post.title.toLowerCase()}`,
    image: post.image,
    url: `/blog/${post.id}`,
    type: 'article',
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
    author: 'Agence Immobilière Premium',
  })
}

// Génération du sitemap
export function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const staticPages = [
    '',
    '/properties',
    '/search',
    '/about',
    '/contact',
    '/blog',
    '/services',
    '/estimation',
  ]

  return staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page === '' ? 'daily' : 'weekly' as const,
    priority: page === '' ? 1.0 : 0.8,
  }))
}

// Schema.org JSON-LD pour l'organisation
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Agence Immobilière Premium',
    description: 'Votre partenaire immobilier de confiance depuis plus de 20 ans',
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`,
    image: `${process.env.NEXT_PUBLIC_APP_URL}/images/og-default.jpg`,
    telephone: '+33123456789',
    email: 'contact@agence-premium.fr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Avenue des Champs-Élysées',
      addressLocality: 'Paris',
      postalCode: '75008',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.8566,
      longitude: 2.3522,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/agence-premium',
      'https://www.twitter.com/agence-premium',
      'https://www.linkedin.com/company/agence-premium',
    ],
  }
}

// Schema.org JSON-LD pour une propriété
export function generatePropertySchema(property: {
  id: string
  title: string
  description: string
  price: number
  type: string
  surface: number
  rooms: number
  bedrooms: number
  bathrooms: number
  address: string
  city: string
  zipCode: string
  latitude: number
  longitude: number
  images?: string[]
  yearBuilt?: number
}) {
  const propertyTypes: Record<string, string> = {
    APARTMENT: 'Apartment',
    HOUSE: 'House',
    STUDIO: 'Apartment',
    LOFT: 'Apartment',
    VILLA: 'House',
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/properties/${property.id}`,
    image: property.images?.map(img => img),
    datePosted: new Date().toISOString(),
    validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 jours
    price: {
      '@type': 'PriceSpecification',
      price: property.price,
      priceCurrency: 'EUR',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      postalCode: property.zipCode,
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    },
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.surface,
      unitCode: 'MTK',
    },
    numberOfRooms: property.rooms,
    numberOfBedrooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    yearBuilt: property.yearBuilt,
    additionalType: propertyTypes[property.type] || 'RealEstate',
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'RealEstateAgent',
        name: 'Agence Immobilière Premium',
        url: process.env.NEXT_PUBLIC_APP_URL,
      },
    },
  }
}
