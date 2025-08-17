'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Users, 
  Award, 
  TrendingUp, 
  Shield,
  Heart,
  Target,
  Zap,
  CheckCircle,
  Star,
  Building2,
  Calendar,
  MapPin
} from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Building2, label: 'Propriétés vendues', value: '500+' },
    { icon: Users, label: 'Clients satisfaits', value: '1,200+' },
    { icon: Award, label: 'Années d\'expérience', value: '20+' },
    { icon: TrendingUp, label: 'Taux de satisfaction', value: '98%' },
  ]

  const values = [
    {
      icon: Shield,
      title: 'Confiance',
      description: 'Transparence totale et conseils honnêtes pour chaque client.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Une équipe passionnée par l\'immobilier et le service client.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Recherche constante de l\'excellence dans tous nos services.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Adoption des dernières technologies pour mieux vous servir.',
    },
  ]

  const team = [
    {
      name: 'Marie Dubois',
      role: 'Fondatrice & Directrice',
      experience: '20 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Diplômée en droit immobilier, Marie a fondé l\'agence avec la vision de révolutionner l\'expérience immobilière.',
      specialities: ['Direction', 'Stratégie', 'Développement'],
    },
    {
      name: 'Jean Martin',
      role: 'Directeur Commercial',
      experience: '15 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      bio: 'Expert en négociation immobilière, Jean accompagne nos clients dans leurs projets les plus ambitieux.',
      specialities: ['Vente', 'Négociation', 'Luxe'],
    },
    {
      name: 'Sophie Laurent',
      role: 'Responsable Investissement',
      experience: '12 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      bio: 'Spécialiste de l\'investissement locatif, Sophie optimise la rentabilité de vos projets.',
      specialities: ['Investissement', 'Rentabilité', 'Fiscalité'],
    },
    {
      name: 'Thomas Bernard',
      role: 'Conseiller Senior',
      experience: '10 ans d\'expérience',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Passionné par l\'immobilier parisien, Thomas connaît chaque quartier sur le bout des doigts.',
      specialities: ['Achat', 'Paris', 'Primo-accédants'],
    },
  ]

  const timeline = [
    {
      year: '2004',
      title: 'Création de l\'agence',
      description: 'Ouverture du premier bureau avec une équipe de 3 personnes.',
    },
    {
      year: '2008',
      title: 'Expansion régionale',
      description: 'Ouverture de 2 nouvelles agences en région parisienne.',
    },
    {
      year: '2012',
      title: 'Innovation digitale',
      description: 'Lancement de notre première plateforme en ligne.',
    },
    {
      year: '2016',
      title: 'Certification qualité',
      description: 'Obtention de la certification ISO 9001 pour nos services.',
    },
    {
      year: '2020',
      title: 'Transformation numérique',
      description: 'Digitalisation complète avec visites virtuelles et IA.',
    },
    {
      year: '2024',
      title: 'Nouvelle plateforme',
      description: 'Lancement de notre nouvelle plateforme web moderne.',
    },
  ]

  const certifications = [
    'Certification FNAIM',
    'Assurance RC Professionnelle',
    'Carte Professionnelle T',
    'Garantie Financière',
    'Certification ISO 9001',
    'Label Qualité Service',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920"
            alt="À propos"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative container">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
              À Propos de Nous
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              Depuis plus de 20 ans, nous accompagnons nos clients dans leurs projets 
              immobiliers avec passion, expertise et innovation. Découvrez notre histoire, 
              nos valeurs et l'équipe qui fait notre force.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
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

      {/* Our Story */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Fondée en 2004 par Marie Dubois, Agence Immobilière Premium est née 
                  d'une vision simple : révolutionner l'expérience immobilière en plaçant 
                  l'humain au cœur de chaque transaction.
                </p>
                <p>
                  Forte d'une équipe de professionnels passionnés et d'une connaissance 
                  approfondie du marché parisien, notre agence s'est rapidement imposée 
                  comme une référence dans l'immobilier haut de gamme.
                </p>
                <p>
                  Aujourd'hui, nous continuons d'innover en intégrant les dernières 
                  technologies tout en préservant nos valeurs fondamentales : 
                  transparence, expertise et service personnalisé.
                </p>
              </div>
              <div className="mt-8">
                <Button size="lg">
                  Découvrir nos services
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800"
                  alt="Notre bureau"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-medium">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">4.9/5</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Note client moyenne</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les principes qui guident notre action au quotidien et font notre différence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des professionnels expérimentés et passionnés à votre service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-medium transition-shadow">
                <div className="aspect-[4/5] relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    {member.experience}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {member.specialities.map((speciality, specIndex) => (
                      <Badge key={specIndex} variant="outline" className="text-xs">
                        {speciality}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Notre Parcours
            </h2>
            <p className="text-xl text-gray-600">
              20 ans d'évolution et d'innovation au service de l'immobilier
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>
            
            <div className="space-y-12">
              {timeline.map((event, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <Card className="hover:shadow-medium transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary-600">
                              {event.year}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600">
                          {event.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Certifications & Garanties
            </h2>
            <p className="text-xl text-gray-600">
              Votre sécurité et votre confiance sont nos priorités
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {cert}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Prêt à Nous Rencontrer ?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Découvrez comment notre expertise peut vous aider à concrétiser 
            vos projets immobiliers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <MapPin className="w-5 h-5 mr-2" />
              Nous rendre visite
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Calendar className="w-5 h-5 mr-2" />
              Prendre rendez-vous
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
