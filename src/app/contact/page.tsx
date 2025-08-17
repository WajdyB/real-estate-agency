'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Send,
  CheckCircle,
  User,
  Building2,
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: '',
    budget: '',
    timeframe: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulation d'envoi - en production, remplacer par un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        propertyType: '',
        budget: '',
        timeframe: '',
      })
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['123 Avenue des Champs-Élysées', '75008 Paris, France'],
      action: 'Voir sur la carte',
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+33 1 23 45 67 89', '+33 6 12 34 56 78'],
      action: 'Appeler maintenant',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@agence-premium.fr', 'info@agence-premium.fr'],
      action: 'Envoyer un email',
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lun - Ven : 9h00 - 19h00', 'Sam : 9h00 - 17h00', 'Dim : Fermé'],
      action: null,
    },
  ]

  const team = [
    {
      name: 'Sophie Martin',
      role: 'Directrice Commerciale',
      phone: '+33 1 23 45 67 80',
      email: 'sophie.martin@agence-premium.fr',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150',
      speciality: 'Achat / Vente',
    },
    {
      name: 'Jean Dubois',
      role: 'Conseiller Senior',
      phone: '+33 1 23 45 67 81',
      email: 'jean.dubois@agence-premium.fr',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      speciality: 'Investissement',
    },
    {
      name: 'Marie Leroy',
      role: 'Conseillère Immobilier',
      phone: '+33 1 23 45 67 82',
      email: 'marie.leroy@agence-premium.fr',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      speciality: 'Location',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
              Contactez-nous
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Notre équipe d'experts est à votre écoute pour vous accompagner 
              dans tous vos projets immobiliers
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Réponse sous 24h
              </div>
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Consultation gratuite
              </div>
              <div className="flex items-center bg-white/20 rounded-lg px-4 py-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                Accompagnement personnalisé
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2" />
                    Envoyez-nous un message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sujet *
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="achat">Achat immobilier</option>
                          <option value="vente">Vente immobilier</option>
                          <option value="location">Location</option>
                          <option value="investissement">Investissement</option>
                          <option value="estimation">Estimation gratuite</option>
                          <option value="gestion">Gestion locative</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type de bien
                        </label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="appartement">Appartement</option>
                          <option value="maison">Maison</option>
                          <option value="studio">Studio</option>
                          <option value="loft">Loft</option>
                          <option value="villa">Villa</option>
                          <option value="commercial">Commercial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="0-200000">Moins de 200 000 €</option>
                          <option value="200000-400000">200 000 € - 400 000 €</option>
                          <option value="400000-600000">400 000 € - 600 000 €</option>
                          <option value="600000-1000000">600 000 € - 1 000 000 €</option>
                          <option value="1000000+">Plus de 1 000 000 €</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Délai
                        </label>
                        <select
                          name="timeframe"
                          value={formData.timeframe}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="immediate">Immédiat</option>
                          <option value="1-3-mois">1-3 mois</option>
                          <option value="3-6-mois">3-6 mois</option>
                          <option value="6-12-mois">6-12 mois</option>
                          <option value="plus-12-mois">Plus de 12 mois</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Décrivez-nous votre projet en détail..."
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      loading={isSubmitting}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Details */}
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600 text-sm">
                            {detail}
                          </p>
                        ))}
                        {info.action && (
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2">
                            {info.action}
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Actions rapides
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Prendre rendez-vous
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Building2 className="w-4 h-4 mr-2" />
                      Estimation gratuite
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat en ligne
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Notre Équipe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des professionnels expérimentés à votre service pour vous accompagner 
              dans tous vos projets immobiliers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-shadow">
                <CardContent className="p-8">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Spécialité : {member.speciality}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {member.phone}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {member.email}
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-1" />
                      Appeler
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Nous Trouver
            </h2>
            <p className="text-gray-600">
              Venez nous rendre visite dans nos locaux au cœur de Paris
            </p>
          </div>
          
          {/* Placeholder for map - In production, integrate Google Maps or OpenStreetMap */}
          <div className="aspect-[21/9] bg-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600">
                Carte interactive - Intégration Google Maps
              </p>
              <p className="text-sm text-gray-500 mt-2">
                123 Avenue des Champs-Élysées, 75008 Paris
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
