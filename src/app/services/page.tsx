'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Home, 
  Key, 
  TrendingUp, 
  Calculator,
  FileText,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  Calendar
} from 'lucide-react'

export default function ServicesPage() {
  const mainServices = [
    {
      icon: Home,
      title: 'Achat Immobilier',
      subtitle: 'Trouvez le bien de vos rêves',
      description: 'Nous vous accompagnons dans la recherche et l\'achat de votre bien idéal avec notre expertise du marché local.',
      features: [
        'Recherche personnalisée selon vos critères',
        'Visite accompagnée par nos experts',
        'Négociation du prix et des conditions',
        'Suivi juridique et administratif complet',
        'Aide au financement et montage de dossier'
      ],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600',
      price: 'Commission vendeur',
      duration: '2-6 mois',
      satisfaction: '98%',
      color: 'blue'
    },
    {
      icon: Key,
      title: 'Vente Immobilière',
      subtitle: 'Vendez au meilleur prix',
      description: 'Maximisez la valeur de votre bien avec notre stratégie marketing personnalisée et notre réseau d\'acquéreurs qualifiés.',
      features: [
        'Estimation gratuite et précise',
        'Marketing digital et traditionnel',
        'Photos et visites virtuelles professionnelles',
        'Présélection des acquéreurs',
        'Accompagnement jusqu\'à la signature'
      ],
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600',
      price: '3-5% du prix',
      duration: '3-8 semaines',
      satisfaction: '96%',
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: 'Investissement Locatif',
      subtitle: 'Optimisez votre rentabilité',
      description: 'Constituez et développez votre patrimoine immobilier avec nos conseils d\'experts en investissement.',
      features: [
        'Analyse de rentabilité détaillée',
        'Sélection de biens à fort potentiel',
        'Optimisation fiscale (Pinel, LMNP, etc.)',
        'Gestion locative complète',
        'Suivi de performance de votre portefeuille'
      ],
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',
      price: 'Sur devis',
      duration: 'Long terme',
      satisfaction: '94%',
      color: 'purple'
    }
  ]

  const additionalServices = [
    {
      icon: Calculator,
      title: 'Estimation Gratuite',
      description: 'Obtenez une évaluation précise de votre bien en ligne ou avec nos experts.',
      features: ['Estimation en ligne instantanée', 'Visite d\'expert gratuite', 'Rapport détaillé'],
      link: '/estimation'
    },
    {
      icon: FileText,
      title: 'Gestion Locative',
      description: 'Confiez-nous la gestion complète de vos biens locatifs.',
      features: ['Sélection des locataires', 'Encaissement des loyers', 'Maintenance et travaux'],
      link: '/services/gestion-locative'
    },
    {
      icon: Shield,
      title: 'Conseil Patrimonial',
      description: 'Optimisez votre stratégie patrimoniale avec nos experts.',
      features: ['Analyse patrimoine', 'Stratégie fiscale', 'Transmission patrimoine'],
      link: '/services/conseil-patrimonial'
    },
    {
      icon: Users,
      title: 'Accompagnement Primo-accédants',
      description: 'Un accompagnement spécialisé pour votre premier achat.',
      features: ['Formation aux étapes', 'Aide au financement', 'Négociation adaptée'],
      link: '/services/primo-accedants'
    }
  ]

  const processSteps = [
    {
      step: 1,
      title: 'Premier Contact',
      description: 'Échange sur vos besoins et objectifs',
      duration: '30 min'
    },
    {
      step: 2,
      title: 'Analyse & Stratégie',
      description: 'Définition de la stratégie personnalisée',
      duration: '1-2 jours'
    },
    {
      step: 3,
      title: 'Mise en Œuvre',
      description: 'Exécution du plan d\'action',
      duration: 'Variable'
    },
    {
      step: 4,
      title: 'Suivi & Finalisation',
      description: 'Accompagnement jusqu\'à la conclusion',
      duration: 'Jusqu\'à signature'
    }
  ]

  const testimonials = [
    {
      name: 'Claire Dubois',
      service: 'Achat Appartement',
      content: 'Service exceptionnel ! L\'équipe m\'a trouvé l\'appartement parfait en 3 semaines.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      name: 'Pierre Martin',
      service: 'Vente Maison',
      content: 'Vendu 15% au-dessus de l\'estimation initiale grâce à leur stratégie marketing.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    {
      name: 'Sophie Laurent',
      service: 'Investissement',
      content: 'Portfolio locatif rentable grâce à leurs conseils avisés.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500'
    }
    return colors[color] || 'bg-primary-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Nos Services
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed mb-8">
              Un accompagnement complet et personnalisé pour tous vos projets immobiliers. 
              Notre expertise à votre service depuis plus de 20 ans.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Accompagnement personnalisé
              </div>
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <Star className="w-5 h-5 mr-2" />
                96% de satisfaction client
              </div>
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <Clock className="w-5 h-5 mr-2" />
                Disponible 7j/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Services Principaux
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trois domaines d'expertise pour répondre à tous vos besoins immobiliers
            </p>
          </div>

          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className={`w-16 h-16 ${getColorClasses(service.color)} rounded-2xl flex items-center justify-center mb-6`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-display font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {service.subtitle}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Tarif</div>
                      <div className="font-semibold text-gray-900">{service.price}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Durée</div>
                      <div className="font-semibold text-gray-900">{service.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Satisfaction</div>
                      <div className="font-semibold text-green-600">{service.satisfaction}</div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button size="lg">
                      En savoir plus
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button variant="outline" size="lg">
                      <Calendar className="w-5 h-5 mr-2" />
                      Prendre RDV
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Services Complémentaires
            </h2>
            <p className="text-xl text-gray-600">
              Des services additionnels pour un accompagnement complet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="hover:shadow-medium transition-shadow group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <service.icon className="w-6 h-6 text-primary-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-1 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-gray-500 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={service.link}>
                    <Button variant="outline" size="sm" className="w-full">
                      Découvrir
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Notre Processus
            </h2>
            <p className="text-xl text-gray-600">
              Une méthode éprouvée en 4 étapes pour garantir votre succès
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200 transform translate-x-8" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {step.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {step.duration}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Témoignages Clients
            </h2>
            <p className="text-xl text-gray-600">
              La satisfaction de nos clients témoigne de la qualité de nos services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-8 text-center">
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
                      <div className="text-sm text-gray-600">{testimonial.service}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Prêt à Démarrer Votre Projet ?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Contactez nos experts pour un accompagnement personnalisé 
            et découvrez comment nous pouvons vous aider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="secondary">
              <Phone className="w-5 h-5 mr-2" />
              01 23 45 67 89
            </Button>
            <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              <Mail className="w-5 h-5 mr-2" />
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
