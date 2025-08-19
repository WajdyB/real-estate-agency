'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  Calculator, 
  MapPin, 
  Home, 
  TrendingUp,
  CheckCircle,
  FileText,
  Clock,
  Star,
  ArrowRight,
  Building2,
  Square
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function EstimationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Étape 1 - Type et localisation
    propertyType: '',
    address: '',
    city: '',
    zipCode: '',
    
    // Étape 2 - Caractéristiques
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    elevator: false,
    balcony: false,
    parking: false,
    cellar: false,
    
    // Étape 3 - État et équipements
    condition: '',
    yearBuilt: '',
    heating: '',
    renovated: false,
    
    // Étape 4 - Contact
    name: '',
    email: '',
    phone: '',
    visitRequest: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [estimationResult, setEstimationResult] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulation d'estimation - en production, utiliser un algorithme plus sophistiqué
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Calcul basique d'estimation (à améliorer en production)
      const basePrice = parseInt(formData.surface) * 4500 // Prix moyen au m² Tunis
      const typeMultiplier = formData.propertyType === 'APARTMENT' ? 1 : 1.2
      const conditionMultiplier = formData.condition === 'excellent' ? 1.1 : 
                                  formData.condition === 'good' ? 1 : 0.9
      
      const estimation = Math.round(basePrice * typeMultiplier * conditionMultiplier)
      setEstimationResult(estimation)
      
      toast.success('Estimation calculée avec succès !')
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const advantages = [
    {
      icon: Clock,
      title: 'Estimation instantanée',
      description: 'Obtenez une première estimation en quelques minutes',
    },
    {
      icon: TrendingUp,
      title: 'Données du marché',
      description: 'Basée sur les dernières transactions du secteur',
    },
    {
      icon: CheckCircle,
      title: '100% gratuit',
      description: 'Service d\'estimation entièrement gratuit et sans engagement',
    },
    {
      icon: FileText,
      title: 'Rapport détaillé',
      description: 'Recevez un rapport complet par email',
    },
  ]

  const steps = [
    { number: 1, title: 'Type & Localisation', active: currentStep >= 1, completed: currentStep > 1 },
    { number: 2, title: 'Caractéristiques', active: currentStep >= 2, completed: currentStep > 2 },
    { number: 3, title: 'État & Équipements', active: currentStep >= 3, completed: currentStep > 3 },
    { number: 4, title: 'Contact & Résultat', active: currentStep >= 4, completed: false },
  ]

  if (estimationResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="container max-w-2xl">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Estimation Réalisée !
              </h1>
              
              <div className="bg-primary-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Valeur estimée de votre bien :</p>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'TND',
                    minimumFractionDigits: 0,
                  }).format(estimationResult)}
                </div>
                <p className="text-sm text-gray-500">
                  Fourchette : {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'TND',
                    minimumFractionDigits: 0,
                  }).format(estimationResult * 0.9)} - {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'TND',
                    minimumFractionDigits: 0,
                  }).format(estimationResult * 1.1)}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-gray-600">
                  Cette estimation est basée sur les données du marché local et les caractéristiques 
                  de votre bien. Pour une évaluation plus précise, nos experts peuvent réaliser 
                  une visite gratuite.
                </p>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    Fiabilité : 85%
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    Marché favorable
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1">
                  <FileText className="w-5 h-5 mr-2" />
                  Recevoir le rapport détaillé
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Home className="w-5 h-5 mr-2" />
                  Demander une visite d'expert
                </Button>
              </div>

              <button
                onClick={() => {
                  setEstimationResult(null)
                  setCurrentStep(1)
                  setFormData({
                    propertyType: '', address: '', city: '', zipCode: '',
                    surface: '', rooms: '', bedrooms: '', bathrooms: '', floor: '',
                    elevator: false, balcony: false, parking: false, cellar: false,
                    condition: '', yearBuilt: '', heating: '', renovated: false,
                    name: '', email: '', phone: '', visitRequest: false,
                  })
                }}
                className="text-primary-600 hover:text-primary-700 text-sm mt-6"
              >
                Faire une nouvelle estimation
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Estimation Gratuite
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Découvrez la valeur de votre bien immobilier en quelques minutes 
              grâce à notre outil d'estimation en ligne
            </p>
            <div className="flex flex-wrap gap-4">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                  <advantage.icon className="w-5 h-5 mr-2" />
                  {advantage.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : step.active 
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300 text-gray-400'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    step.active ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-px bg-gray-300 mx-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="container max-w-2xl">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-6 h-6 mr-2" />
                  Étape {currentStep}/4
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Étape 1 - Type et localisation */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Type de bien et localisation
                    </h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type de bien *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { value: 'APARTMENT', label: 'Appartement', icon: Building2 },
                          { value: 'HOUSE', label: 'Maison', icon: Home },
                          { value: 'STUDIO', label: 'Studio', icon: Square },
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, propertyType: type.value }))}
                            className={`p-4 border-2 rounded-lg text-center transition-colors ${
                              formData.propertyType === type.value
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <type.icon className="w-8 h-8 mx-auto mb-2" />
                            <span className="text-sm font-medium">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse *
                        </label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="123 rue de la Paix"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville *
                        </label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Tunis"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal *
                      </label>
                      <Input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="1001"
                        required
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Étape 2 - Caractéristiques */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Caractéristiques du bien
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Surface (m²) *
                        </label>
                        <Input
                          name="surface"
                          type="number"
                          value={formData.surface}
                          onChange={handleChange}
                          placeholder="75"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pièces *
                        </label>
                        <Input
                          name="rooms"
                          type="number"
                          value={formData.rooms}
                          onChange={handleChange}
                          placeholder="3"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Chambres
                        </label>
                        <Input
                          name="bedrooms"
                          type="number"
                          value={formData.bedrooms}
                          onChange={handleChange}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salles de bain
                        </label>
                        <Input
                          name="bathrooms"
                          type="number"
                          value={formData.bathrooms}
                          onChange={handleChange}
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Étage
                      </label>
                      <Input
                        name="floor"
                        type="number"
                        value={formData.floor}
                        onChange={handleChange}
                        placeholder="3"
                        className="max-w-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Équipements
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { name: 'elevator', label: 'Ascenseur' },
                          { name: 'balcony', label: 'Balcon' },
                          { name: 'parking', label: 'Parking' },
                          { name: 'cellar', label: 'Cave' },
                        ].map((equipment) => (
                          <label key={equipment.name} className="flex items-center">
                            <input
                              type="checkbox"
                              name={equipment.name}
                              checked={formData[equipment.name as keyof typeof formData] as boolean}
                              onChange={handleChange}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {equipment.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 3 - État et équipements */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      État et équipements
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          État général *
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Bon</option>
                          <option value="average">Moyen</option>
                          <option value="poor">À rénover</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Année de construction
                        </label>
                        <Input
                          name="yearBuilt"
                          type="number"
                          value={formData.yearBuilt}
                          onChange={handleChange}
                          placeholder="1970"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de chauffage
                      </label>
                      <select
                        name="heating"
                        value={formData.heating}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="individual-gas">Individuel gaz</option>
                        <option value="individual-electric">Individuel électrique</option>
                        <option value="collective">Collectif</option>
                        <option value="heat-pump">Pompe à chaleur</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="renovated"
                          checked={formData.renovated}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Rénové récemment (moins de 5 ans)
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Étape 4 - Contact */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Vos coordonnées
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Jean Dupont"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jean@exemple.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="visitRequest"
                          checked={formData.visitRequest}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Je souhaite qu'un expert se déplace pour une estimation précise (gratuit)
                        </span>
                      </label>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Protection des données :</strong> Vos informations sont utilisées 
                        uniquement pour calculer votre estimation et vous envoyer le rapport. 
                        Elles ne seront jamais transmises à des tiers.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Précédent
                  </Button>
                  
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && (!formData.propertyType || !formData.address || !formData.city || !formData.zipCode)) ||
                        (currentStep === 2 && (!formData.surface || !formData.rooms)) ||
                        (currentStep === 3 && !formData.condition)
                      }
                    >
                      Suivant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      disabled={!formData.name || !formData.email}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculer l'estimation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </section>
    </div>
  )
}
