'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Save,
  X,
  Heart,
  Bell,
  Eye,
  Settings,
  CreditCard,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  })

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    try {
      // En production, envoyer les données à l'API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profil mis à jour avec succès !')
      setIsEditing(false)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
    })
    setIsEditing(false)
  }

  // Mock data pour les statistiques utilisateur
  const userStats = [
    { label: 'Propriétés vues', value: '24', icon: Eye },
    { label: 'Favoris', value: '8', icon: Heart },
    { label: 'Alertes actives', value: '3', icon: Bell },
    { label: 'Messages', value: '12', icon: Mail },
  ]

  const recentActivity = [
    {
      type: 'view',
      title: 'Appartement 3 pièces - Paris 15ème',
      date: '2024-01-20T10:30:00Z',
      icon: Eye,
    },
    {
      type: 'favorite',
      title: 'Maison avec jardin - Neuilly',
      date: '2024-01-19T14:20:00Z',
      icon: Heart,
    },
    {
      type: 'message',
      title: 'Message envoyé à l\'agent Sophie Martin',
      date: '2024-01-18T16:45:00Z',
      icon: Mail,
    },
    {
      type: 'alert',
      title: 'Nouvelle alerte créée pour Paris 16ème',
      date: '2024-01-17T09:15:00Z',
      icon: Bell,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {session.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {session.user.name}
                </h2>
                <p className="text-gray-600 mb-4">{session.user.email}</p>
                <Badge variant={session.user.role === 'CLIENT' ? 'default' : 'gold'}>
                  {session.user.role}
                </Badge>
                
                <div className="mt-6 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {userStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <stat.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Informations personnelles</CardTitle>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
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
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Code postal
                        </label>
                        <Input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse
                        </label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Nom</p>
                          <p className="font-medium text-gray-900">{session.user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{session.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium text-gray-900">{formData.phone || 'Non renseigné'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Adresse</p>
                          <p className="font-medium text-gray-900">{formData.address || 'Non renseignée'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Membre depuis</p>
                          <p className="font-medium text-gray-900">Janvier 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Mes Favoris</h3>
                  <p className="text-sm text-gray-600">8 propriétés sauvegardées</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Bell className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Mes Alertes</h3>
                  <p className="text-sm text-gray-600">3 alertes actives</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CreditCard className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Paiements</h3>
                  <p className="text-sm text-gray-600">Historique des transactions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
