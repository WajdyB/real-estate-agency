'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import PropertyCard from '@/components/property/PropertyCard'
import { 
  Search, 
  Building2, 
  Users, 
  Award, 
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Star,
  CheckCircle,
  Home,
  Key,
  HeartHandshake
} from 'lucide-react'

// Mock data - en production, ces données viendraient de l'API
const featuredProperties = [
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
  },
  {
    id: '3',
    title: 'Studio lumineux - Quartier Latin',
    price: 295000,
    type: 'STUDIO',
    surface: 25,
    rooms: 1,
    bedrooms: 0,
    bathrooms: 1,
    address: '8 Rue de la Huchette',
    city: 'Paris',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    isFeatured: false,
    createdAt: '2024-01-05',
  },
]

const stats = [
  { icon: Building2, label: 'Propriétés vendues', value: '500+' },
  { icon: Users, label: 'Clients satisfaits', value: '1,200+' },
  { icon: Award, label: 'Années d\'expérience', value: '20+' },
  { icon: TrendingUp, label: 'Taux de réussite', value: '95%' },
]

const services = [
  {
    icon: Home,
    title: 'Achat Immobilier',
    description: 'Nous vous accompagnons dans la recherche et l\'achat de votre bien idéal.',
    features: ['Recherche personnalisée', 'Visite accompagnée', 'Négociation', 'Suivi juridique']
  },
  {
    icon: Key,
    title: 'Vente Immobilière',
    description: 'Vendez votre bien au meilleur prix avec notre expertise du marché.',
    features: ['Estimation gratuite', 'Marketing digital', 'Visites qualifiées', 'Accompagnement total']
  },
  {
    icon: HeartHandshake,
    title: 'Gestion Locative',
    description: 'Confiez-nous la gestion de votre patrimoine immobilier en toute sérénité.',
    features: ['Sélection locataires', 'Encaissement loyers', 'Maintenance', 'Suivi juridique']
  },
]

const testimonials = [
  {
    name: 'Marie Dubois',
    role: 'Propriétaire',
    content: 'Service exceptionnel ! L\'équipe m\'a accompagnée tout au long de la vente de mon appartement. Professionnalisme et résultats au rendez-vous.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100'
  },
  {
    name: 'Jean Martin',
    role: 'Acheteur',
    content: 'Grâce à leur expertise, j\'ai trouvé la maison de mes rêves en quelques semaines. Un accompagnement personnalisé et des conseils précieux.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
  },
  {
    name: 'Sophie Laurent',
    role: 'Investisseur',
    content: 'Excellent conseil en investissement locatif. Rentabilité au rendez-vous et gestion sans souci. Je recommande vivement !',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop"
            alt="Luxury real estate"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6 animate-fade-in">
              Trouvez Votre
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
                Propriété Idéale
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-200 animate-slide-up">
              Découvrez notre sélection exclusive de biens immobiliers premium 
              avec l\'accompagnement d\'experts passionnés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Link href="/properties">
                <Button size="xl" variant="gold" className="min-w-48">
                  Découvrir nos biens
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/estimation">
                <Button size="xl" variant="outline" className="min-w-48 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                  Estimation gratuite
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Type de bien</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Tous types</option>
                    <option>Appartement</option>
                    <option>Maison</option>
                    <option>Studio</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Localisation</label>
                  <input
                    type="text"
                    placeholder="Ville, quartier..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Budget max</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Sans limite</option>
                    <option>200 000 €</option>
                    <option>500 000 €</option>
                    <option>1 000 000 €</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full h-12">
                    <Search className="w-5 h-5 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Propriétés en Vedette
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de biens d\'exception, choisis pour leur qualité 
              et leur emplacement privilégié
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/properties">
              <Button size="lg" variant="outline">
                Voir toutes les propriétés
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Un accompagnement complet pour tous vos projets immobiliers, 
              de l\'achat à la gestion locative
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Témoignages Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La satisfaction de nos clients est notre plus belle récompense
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-display font-bold mb-4">
            Prêt à Concrétiser Votre Projet ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Contactez nos experts pour un accompagnement personnalisé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <Button size="xl" variant="secondary">
                <Mail className="w-5 h-5 mr-2" />
                Nous contacter
              </Button>
            </Link>
            <a href="tel:+33123456789">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Phone className="w-5 h-5 mr-2" />
                01 23 45 67 89
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
