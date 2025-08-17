'use client'

import React, { useState } from 'react'
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
  EyeOff
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  // Mock data - replace with real data from your API
  const [profile, setProfile] = useState({
         personal: {
       firstName: 'Jean',
       lastName: 'Martin',
       email: 'jean.martin@agence-premium.fr',
       phone: '+33 6 12 34 56 78',
       dateOfBirth: '1985-03-15',
       address: '45 Rue de la Paix, 75001 Paris',
       bio: 'Agent immobilier expérimenté avec plus de 10 ans d\'expérience dans la vente et la location de biens de prestige à Paris et sa région.',
       avatar: null
     },
    professional: {
      position: 'Agent immobilier senior',
      department: 'Vente de prestige',
      employeeId: 'EMP-001',
      hireDate: '2014-09-01',
      license: 'CARTE-2024-001234',
      specialties: ['Appartements de luxe', 'Villas de prestige', 'Investissement locatif'],
      languages: ['Français', 'Anglais', 'Espagnol']
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorEnabled: true,
      lastPasswordChange: '2024-01-01',
      lastLogin: '2024-01-20T10:30:00'
    }
  })

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Show success message
  }

  const handlePasswordChange = async () => {
    if (profile.security.newPassword !== profile.security.confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }
    
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    
    // Clear password fields
    setProfile(prev => ({
      ...prev,
      security: {
        ...prev.security,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }))
    
    // Show success message
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et professionnelles</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      {/* Profile overview */}
      <Card className="p-6">
        <div className="flex items-center space-x-6">
                     {/* Avatar */}
           <div className="relative">
             <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center overflow-hidden">
               {profile.personal.avatar ? (
                 <img 
                   src={profile.personal.avatar} 
                   alt="Avatar" 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <span className="text-2xl font-bold text-white">
                   {profile.personal.firstName.charAt(0)}{profile.personal.lastName.charAt(0)}
                 </span>
               )}
             </div>
             <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700">
               <Camera className="w-4 h-4" />
             </button>
           </div>

          {/* Basic info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.personal.firstName} {profile.personal.lastName}
            </h2>
            <p className="text-lg text-gray-600">{profile.professional.position}</p>
            <p className="text-gray-500">{profile.professional.department}</p>
            
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {profile.personal.email}
              </span>
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                {profile.personal.phone}
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="text-right">
            <div className="text-sm text-gray-500">Employé depuis</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(profile.professional.hireDate)}
            </div>
            <div className="text-sm text-gray-500 mt-2">Dernière connexion</div>
            <div className="text-sm text-gray-900">
              {formatDateTime(profile.security.lastLogin)}
            </div>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Informations personnelles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <Input
              value={profile.personal.firstName}
              onChange={(e) => handleProfileChange('personal', 'firstName', e.target.value)}
              placeholder="Votre prénom"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <Input
              value={profile.personal.lastName}
              onChange={(e) => handleProfileChange('personal', 'lastName', e.target.value)}
              placeholder="Votre nom"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={profile.personal.email}
              onChange={(e) => handleProfileChange('personal', 'email', e.target.value)}
              placeholder="votre.email@exemple.fr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <Input
              value={profile.personal.phone}
              onChange={(e) => handleProfileChange('personal', 'phone', e.target.value)}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de naissance
            </label>
            <Input
              type="date"
              value={profile.personal.dateOfBirth}
              onChange={(e) => handleProfileChange('personal', 'dateOfBirth', e.target.value)}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <Input
              value={profile.personal.address}
              onChange={(e) => handleProfileChange('personal', 'address', e.target.value)}
              placeholder="Votre adresse complète"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biographie
            </label>
            <textarea
              value={profile.personal.bio}
              onChange={(e) => handleProfileChange('personal', 'bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Parlez-nous de vous..."
            />
          </div>
        </div>
      </Card>

      {/* Professional Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Informations professionnelles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poste
            </label>
            <Input
              value={profile.professional.position}
              onChange={(e) => handleProfileChange('professional', 'position', e.target.value)}
              placeholder="Votre poste actuel"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Département
            </label>
            <Input
              value={profile.professional.department}
              onChange={(e) => handleProfileChange('professional', 'department', e.target.value)}
              placeholder="Votre département"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Employé
            </label>
            <Input
              value={profile.professional.employeeId}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'embauche
            </label>
            <Input
              type="date"
              value={profile.professional.hireDate}
              onChange={(e) => handleProfileChange('professional', 'hireDate', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de carte professionnelle
            </label>
            <Input
              value={profile.professional.license}
              onChange={(e) => handleProfileChange('professional', 'license', e.target.value)}
              placeholder="CARTE-2024-001234"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spécialités
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.professional.specialties.map((specialty, index) => (
                <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langues parlées
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.professional.languages.map((language, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Sécurité et mot de passe
        </h3>
        
        <div className="space-y-6">
          {/* Current password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={profile.security.currentPassword}
                onChange={(e) => handleProfileChange('security', 'currentPassword', e.target.value)}
                placeholder="Entrez votre mot de passe actuel"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <Input
                type="password"
                value={profile.security.confirmPassword}
                onChange={(e) => handleProfileChange('security', 'confirmPassword', e.target.value)}
                placeholder="Confirmez le nouveau mot de passe"
              />
            </div>
          </div>

          {/* Password change button */}
          <div className="flex items-center justify-between">
            <Button onClick={handlePasswordChange} disabled={isSaving}>
              <Key className="w-4 h-4 mr-2" />
              {isSaving ? 'Modification...' : 'Modifier le mot de passe'}
            </Button>
            
            <div className="text-sm text-gray-500">
              Dernière modification : {formatDate(profile.security.lastPasswordChange)}
            </div>
          </div>

          {/* Two-factor authentication */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
              <p className="text-sm text-gray-600">Sécurisez votre compte avec un code supplémentaire</p>
            </div>
            <input
              type="checkbox"
              checked={profile.security.twoFactorEnabled}
              onChange={(e) => handleProfileChange('security', 'twoFactorEnabled', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
