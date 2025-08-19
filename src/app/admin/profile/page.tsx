'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  User, 
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Eye,
  EyeOff,
  Loader2,
  Edit3,
  X
} from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  role: 'CLIENT' | 'AGENT' | 'ADMIN'
  image?: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  data: UserProfile
  error?: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [profile, setProfile] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      image: '',
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  })
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/users/profile')
      const data: ApiResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch profile')
      }

      setProfile({
        personal: {
          name: data.data.name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          image: data.data.image || '',
        },
        security: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }
      })
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchProfile()
    }
  }, [session])

  const handleProfileChange = (section: string, key: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.personal.name,
          email: profile.personal.email,
          phone: profile.personal.phone,
        }),
      })

      if (response.ok) {
        alert('Profil mis à jour avec succès!')
        // Clear password fields
        setProfile(prev => ({
          ...prev,
          security: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }
        }))
      } else {
        const data = await response.json()
        alert(data.error || 'Erreur lors de la mise à jour du profil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Erreur lors de la mise à jour du profil')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (profile.security.newPassword !== profile.security.confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }

    if (profile.security.newPassword.length < 6) {
      alert('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/users/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: profile.security.currentPassword,
          newPassword: profile.security.newPassword,
        }),
      })

      if (response.ok) {
        alert('Mot de passe mis à jour avec succès!')
        // Clear password fields
        setProfile(prev => ({
          ...prev,
          security: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }
        }))
      } else {
        const data = await response.json()
        alert(data.error || 'Erreur lors de la mise à jour du mot de passe')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Erreur lors de la mise à jour du mot de passe')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('La taille de l\'image ne doit pas dépasser 2MB')
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
        // Update profile with new avatar
        setProfile(prev => ({
          ...prev,
          personal: { ...prev.personal, image: data.data.avatarUrl }
        }))
        alert('Avatar mis à jour avec succès!')
        
        // Dispatch custom event to update header avatar
        window.dispatchEvent(new CustomEvent('avatarUpdated'))
      } else {
        alert(data.error || 'Erreur lors du téléchargement')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Erreur lors du téléchargement')
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
        setProfile(prev => ({
          ...prev,
          personal: { ...prev.personal, image: '' }
        }))
        alert('Avatar supprimé avec succès!')
        
        // Dispatch custom event to update header avatar
        window.dispatchEvent(new CustomEvent('avatarUpdated'))
      } else {
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error removing avatar:', error)
      alert('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={fetchProfile}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
                <p className="text-sm text-gray-600">Mettez à jour vos informations de base</p>
              </div>
            </div>

            {/* Avatar Upload Section */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="relative">
                {profile.personal.image ? (
                  <Image
                    src={profile.personal.image}
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                
                {/* Avatar Upload Button */}
                <div className="absolute -bottom-1 -right-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="admin-avatar-upload"
                    disabled={uploadingAvatar}
                  />
                  <label
                    htmlFor="admin-avatar-upload"
                    className={`w-6 h-6 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${
                      uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploadingAvatar ? (
                      <Loader2 className="w-3 h-3 text-gray-600 animate-spin" />
                    ) : (
                      <Edit3 className="w-3 h-3 text-gray-600" />
                    )}
                  </label>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Photo de profil</h3>
                <p className="text-xs text-gray-600 mb-2">JPG, PNG ou WebP. Max 2MB.</p>
                {profile.personal.image && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Supprimer
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <Input
                  value={profile.personal.name}
                  onChange={(e) => handleProfileChange('personal', 'name', e.target.value)}
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={profile.personal.email}
                  onChange={(e) => handleProfileChange('personal', 'email', e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <Input
                  value={profile.personal.phone}
                  onChange={(e) => handleProfileChange('personal', 'phone', e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder les modifications
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sécurité</h2>
                <p className="text-sm text-gray-600">Changez votre mot de passe</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={profile.security.currentPassword}
                    onChange={(e) => handleProfileChange('security', 'currentPassword', e.target.value)}
                    placeholder="Votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={profile.security.newPassword}
                    onChange={(e) => handleProfileChange('security', 'newPassword', e.target.value)}
                    placeholder="Nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <Input
                  type="password"
                  value={profile.security.confirmPassword}
                  onChange={(e) => handleProfileChange('security', 'confirmPassword', e.target.value)}
                  placeholder="Confirmez le nouveau mot de passe"
                />
              </div>

              <Button 
                onClick={handlePasswordChange} 
                disabled={isSaving}
                variant="outline"
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Informations du compte</h2>
              <p className="text-sm text-gray-600">Détails de votre compte</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Rôle</p>
                  <p className="text-sm text-gray-600">
                    {session?.user?.role === 'ADMIN' ? 'Administrateur' : 
                     session?.user?.role === 'AGENT' ? 'Agent immobilier' : 'Client'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Membre depuis</p>
                  <p className="text-sm text-gray-600">
                    {session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email de connexion</p>
                  <p className="text-sm text-gray-600">{session?.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Statut du compte</p>
                  <p className="text-sm text-green-600">Actif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
