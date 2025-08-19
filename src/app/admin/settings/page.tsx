'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Loader2
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Types for settings
interface SettingsData {
  [key: string]: string | null
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Settings state
  const [settings, setSettings] = useState<SettingsData>({})

  // Fetch settings
  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/settings?includeSensitive=true')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch settings')
      }

      setSettings(data.data)
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save settings')
      }

      // Update local state with the response
      setSettings(data.data)
      alert('Paramètres sauvegardés avec succès!')
    } catch (err) {
      console.error('Error saving settings:', err)
      alert('Erreur lors de la sauvegarde des paramètres')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Building2 },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'social', label: 'Réseaux sociaux', icon: Globe },
    { id: 'integrations', label: 'Intégrations', icon: Database }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={fetchSettings}>
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Configurez votre plateforme immobilière</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      {/* Settings tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du site
                </label>
                <Input
                  value={settings.siteName || ''}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  placeholder="Nom de votre agence"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du site
                </label>
                <Input
                  value={settings.siteUrl || ''}
                  onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                  placeholder="https://agence.fr"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du site
                </label>
                <Input
                  value={settings.siteDescription || ''}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  placeholder="Description de votre agence immobilière"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations de contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact
                </label>
                <Input
                  type="email"
                  value={settings.contactEmail || ''}
                  onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  placeholder="contact@agence.fr"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <Input
                  value={settings.contactPhone || ''}
                  onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <Input
                  value={settings.contactAddress || ''}
                  onChange={(e) => handleSettingChange('contactAddress', e.target.value)}
                  placeholder="Adresse complète de l'agence"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Social Media Settings */}
        {activeTab === 'social' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Réseaux sociaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <Input
                  value={settings.socialFacebook || ''}
                  onChange={(e) => handleSettingChange('socialFacebook', e.target.value)}
                  placeholder="https://facebook.com/agence"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <Input
                  value={settings.socialTwitter || ''}
                  onChange={(e) => handleSettingChange('socialTwitter', e.target.value)}
                  placeholder="https://twitter.com/agence"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <Input
                  value={settings.socialInstagram || ''}
                  onChange={(e) => handleSettingChange('socialInstagram', e.target.value)}
                  placeholder="https://instagram.com/agence"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <Input
                  value={settings.socialLinkedin || ''}
                  onChange={(e) => handleSettingChange('socialLinkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/agence"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Integrations Settings */}
        {activeTab === 'integrations' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Intégrations et API</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <Input
                  value={settings.googleAnalyticsId || ''}
                  onChange={(e) => handleSettingChange('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps API Key
                </label>
                <Input
                  value={settings.googleMapsApiKey || ''}
                  onChange={(e) => handleSettingChange('googleMapsApiKey', e.target.value)}
                  placeholder="AIza..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Publishable Key
                </label>
                <Input
                  value={settings.stripePublishableKey || ''}
                  onChange={(e) => handleSettingChange('stripePublishableKey', e.target.value)}
                  placeholder="pk_test_..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Secret Key
                </label>
                <Input
                  type="password"
                  value={settings.stripeSecretKey || ''}
                  onChange={(e) => handleSettingChange('stripeSecretKey', e.target.value)}
                  placeholder="sk_test_..."
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
