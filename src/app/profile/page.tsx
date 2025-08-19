'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
  FileText,
  Loader2,
  Home,
  Star,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

// Types for our API responses
interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: 'CLIENT' | 'AGENT' | 'ADMIN'
  image?: string
  bio?: string
  address?: string
  city?: string
  zipCode?: string
  country: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    properties: number
    reviews: number
    favorites: number
    appointments: number
  }
  properties?: Array<{
    id: string
    title: string
    price: number
    city: string
    images?: string[]
    type: string
    isPublished: boolean
    createdAt: string
  }>
  reviews?: Array<{
    id: string
    rating: number
    comment?: string
    createdAt: string
    property: {
      id: string
      title: string
      city: string
    }
  }>
  favorites?: Array<{
    id: string
    createdAt: string
    property: {
      id: string
      title: string
      price: number
      city: string
      images?: string[]
      type: string
      isPublished: boolean
    }
  }>
  appointments?: Array<{
    id: string
    date: string
    time: string
    status: string
    createdAt: string
    property: {
      id: string
      title: string
      city: string
      images?: string[]
    }
  }>
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    bio: '',
  })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, router])

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return

      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/users/profile')
        const data = await response.json()
        
        if (data.success) {
          setUserProfile(data.data)
          setFormData({
            name: data.data.name || '',
            email: data.data.email || '',
            phone: data.data.phone || '',
            address: data.data.address || '',
            city: data.data.city || '',
            zipCode: data.data.zipCode || '',
            bio: data.data.bio || '',
          })
        } else {
          setError(data.error || 'Failed to fetch profile')
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600 mb-6">{error || 'Impossible de charger le profil'}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setUserProfile(data.data)
        toast.success('Profil mis à jour avec succès !')
        setIsEditing(false)
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleCancel = () => {
    setFormData({
      name: userProfile.name || '',
      email: userProfile.email || '',
      phone: userProfile.phone || '',
      address: userProfile.address || '',
      city: userProfile.city || '',
      zipCode: userProfile.zipCode || '',
      bio: userProfile.bio || '',
    })
    setIsEditing(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image')
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La taille de l\'image ne doit pas dépasser 2MB')
      return
    }

    setUploadingAvatar(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        // Update user profile with new avatar
        setUserProfile(prev => prev ? { ...prev, image: data.data.avatarUrl } : null)
        toast.success('Avatar mis à jour avec succès!')
        
        // Dispatch custom event to update header avatar
        window.dispatchEvent(new CustomEvent('avatarUpdated'))
      } else {
        toast.error(data.error || 'Erreur lors du téléchargement')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Erreur lors du téléchargement')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      const response = await fetch('/api/upload/avatar', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setUserProfile(prev => prev ? { ...prev, image: null } : null)
        toast.success('Avatar supprimé avec succès!')
        
        // Dispatch custom event to update header avatar
        window.dispatchEvent(new CustomEvent('avatarUpdated'))
      } else {
        toast.error(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error removing avatar:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Administrateur',
      AGENT: 'Agent immobilier',
      CLIENT: 'Client'
    }
    return labels[role] || role
  }

  const getRoleBadgeVariant = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      ADMIN: 'destructive',
      AGENT: 'secondary',
      CLIENT: 'default'
    }
    return variants[role] || 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={userProfile.image || '/images/placeholders/default-avatar.svg'}
                    alt={userProfile.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  
                  {/* Avatar Upload Button */}
                  <div className="absolute -bottom-2 -right-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      id="avatar-upload"
                      disabled={uploadingAvatar}
                    />
                    <label
                      htmlFor="avatar-upload"
                      className={`w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                        uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                      ) : (
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      )}
                    </label>
                  </div>
                </div>
                
                {/* Remove Avatar Button (if custom avatar exists) */}
                {userProfile.image && userProfile.image !== '/images/placeholders/default-avatar.svg' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    className="mb-4 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Supprimer l'avatar
                  </Button>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {userProfile.name}
                </h2>
                <p className="text-gray-600 mb-4">{userProfile.email}</p>
                <Badge variant={getRoleBadgeVariant(userProfile.role)}>
                  {getRoleLabel(userProfile.role)}
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
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Eye className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {userProfile._count?.properties || 0}
                    </div>
                    <div className="text-xs text-gray-600">Propriétés</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {userProfile._count?.favorites || 0}
                    </div>
                    <div className="text-xs text-gray-600">Favoris</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {userProfile._count?.reviews || 0}
                    </div>
                    <div className="text-xs text-gray-600">Avis</div>
                  </div>
                  <Link href="/appointments" className="text-center hover:scale-105 transition-transform">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {userProfile._count?.appointments || 0}
                    </div>
                    <div className="text-xs text-gray-600">Rendez-vous</div>
                  </Link>
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
                          disabled
                          className="bg-gray-50"
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Parlez-nous un peu de vous..."
                      />
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
                          <p className="font-medium text-gray-900">{userProfile.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{userProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium text-gray-900">{userProfile.phone || 'Non renseigné'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Adresse</p>
                          <p className="font-medium text-gray-900">{userProfile.address || 'Non renseignée'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Membre depuis</p>
                          <p className="font-medium text-gray-900">
                            {new Date(userProfile.createdAt).toLocaleDateString('fr-FR', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {userProfile.bio && (
                        <div className="flex items-start">
                          <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Bio</p>
                            <p className="font-medium text-gray-900">{userProfile.bio}</p>
                          </div>
                        </div>
                      )}
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
                  {userProfile.favorites && userProfile.favorites.length > 0 ? (
                    userProfile.favorites.slice(0, 5).map((favorite) => (
                      <div key={favorite.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            Ajouté aux favoris: {favorite.property.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(favorite.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune activité récente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Mes Favoris</h3>
                  <p className="text-sm text-gray-600">{userProfile._count?.favorites || 0} propriétés sauvegardées</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Home className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Mes Propriétés</h3>
                  <p className="text-sm text-gray-600">{userProfile._count?.properties || 0} propriétés</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Mes Avis</h3>
                  <p className="text-sm text-gray-600">{userProfile._count?.reviews || 0} avis publiés</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
