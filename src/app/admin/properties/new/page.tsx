'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { 
  ArrowLeft,
  Save,
  Eye,
  Upload,
  MapPin,
  Home,
  Euro,
  Square,
  Bed,
  Bath,
  Calendar,
  Image as ImageIcon,
  X,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewPropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Informations générales
    title: '',
    description: '',
    price: '',
    type: '',
    
    // Localisation
    address: '',
    city: '',
    zipCode: '',
    latitude: '',
    longitude: '',
    
    // Caractéristiques
    surface: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    totalFloors: '',
    yearBuilt: '',
    energyClass: '',
    
    // Équipements
    features: {
      elevator: false,
      balcony: false,
      parking: false,
      cellar: false,
      garden: false,
      terrace: false,
      security: false,
      internet: false,
    },
    
    // Publication
    isPublished: false,
    isFeatured: false,
    
    // Médias
    images: [] as string[],
    virtualTour: '',
    videoUrl: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name.startsWith('features.')) {
      const featureName = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [featureName]: (e.target as HTMLInputElement).checked
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData()
      Array.from(files).forEach(file => {
        uploadFormData.append('files', file)
      })
      uploadFormData.append('type', 'property')

      // Upload files to our API
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      // Add uploaded images to state
      if (data.data.uploadedFiles && data.data.uploadedFiles.length > 0) {
        setUploadedImages(prev => [...prev, ...data.data.uploadedFiles])
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.data.uploadedFiles]
        }))
        toast.success(`${data.data.totalUploaded} image(s) uploadée(s) avec succès`)
      }

      // Show errors if any
      if (data.data.errors && data.data.errors.length > 0) {
        data.data.errors.forEach((error: string) => {
          toast.error(error)
        })
      }

    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Erreur lors de l\'upload des images')
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleNextStep = () => {
    // Validate current step before advancing
    if (currentStep === 1) {
      if (!formData.title || !formData.description || !formData.price || !formData.type) {
        toast.error('Veuillez remplir tous les champs obligatoires de cette étape')
        return
      }
      toast.success('Étape 1 complétée ! Informations générales sauvegardées.')
    } else if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.zipCode) {
        toast.error('Veuillez remplir tous les champs obligatoires de cette étape')
        return
      }
      toast.success('Étape 2 complétée ! Localisation sauvegardée.')
    } else if (currentStep === 3) {
      if (!formData.surface || !formData.rooms) {
        toast.error('Veuillez remplir tous les champs obligatoires de cette étape')
        return
      }
      toast.success('Étape 3 complétée ! Caractéristiques sauvegardées.')
    }
    
    // Advance to next step
    setCurrentStep(Math.min(4, currentStep + 1))
  }

  const handlePreviousStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Form submission triggered on step:', currentStep)
    
    // Only allow submission on the final step
    if (currentStep !== 4) {
      console.warn('Form submission attempted on step', currentStep, '- ignoring')
      toast.error('Veuillez compléter toutes les étapes avant de créer la propriété')
      return
    }
    
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.price || !formData.type || 
          !formData.address || !formData.city || !formData.zipCode || !formData.surface || 
          !formData.rooms) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }

      // Prepare data for API
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        type: formData.type,
        surface: parseInt(formData.surface),
        rooms: parseInt(formData.rooms),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        floor: formData.floor ? parseInt(formData.floor) : undefined,
        totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : undefined,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
        energyClass: formData.energyClass || undefined,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: 'Tunisia',
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        features: formData.features,
        images: formData.images,
        virtualTour: formData.virtualTour || undefined,
        videoUrl: formData.videoUrl || undefined,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
      }

      // Call the API
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create property')
      }

      toast.success('Propriété créée avec succès !')
      router.push('/admin/properties')
    } catch (error) {
      console.error('Error creating property:', error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de la propriété')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Informations générales' },
    { number: 2, title: 'Localisation' },
    { number: 3, title: 'Caractéristiques' },
    { number: 4, title: 'Médias & Publication' },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Ajouter une propriété
            </h1>
            <p className="text-gray-600 mt-1">
              Créez une nouvelle annonce immobilière
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled={!formData.title}>
            <Eye className="w-4 h-4 mr-2" />
            Aperçu
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 max-w-2xl">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.number
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-gray-300 text-gray-400'
            }`}>
              {currentStep === step.number ? (
                <span className="text-sm font-bold">{step.number}</span>
              ) : currentStep > step.number ? (
                <span className="text-white text-sm">✓</span>
              ) : (
                <span className="text-gray-400 text-sm">{step.number}</span>
              )}
            </div>
            <div className="ml-3 hidden sm:block">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
              {currentStep === step.number && (
                <p className="text-xs text-primary-500 mt-1">Étape actuelle</p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-px bg-gray-300 mx-4 hidden md:block" />
            )}
          </div>
        ))}
      </div>

      <div>
        {/* Étape 1 - Informations générales */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-6 h-6 mr-2" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'annonce *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Appartement moderne 3 pièces avec balcon"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Décrivez le bien en détail..."
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (TND) *
                  </label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="350000"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de bien *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="APARTMENT">Appartement</option>
                    <option value="HOUSE">Maison</option>
                    <option value="STUDIO">Studio</option>
                    <option value="LOFT">Loft</option>
                    <option value="VILLA">Villa</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="LAND">Terrain</option>
                    <option value="PARKING">Parking</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 2 - Localisation */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                Localisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Avenue Habib Bourguiba"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <Input
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="36.8065"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <Input
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="10.1815"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Astuce :</strong> Les coordonnées GPS permettent un positionnement précis sur la carte. 
                  Vous pouvez les obtenir depuis Google Maps.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 3 - Caractéristiques */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Square className="w-6 h-6 mr-2" />
                Caractéristiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Étage
                  </label>
                  <Input
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleChange}
                    placeholder="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre d'étages total
                  </label>
                  <Input
                    name="totalFloors"
                    type="number"
                    value={formData.totalFloors}
                    onChange={handleChange}
                    placeholder="6"
                  />
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
                  Classe énergétique
                </label>
                <select
                  name="energyClass"
                  value={formData.energyClass}
                  onChange={handleChange}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sélectionnez</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Équipements
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(formData.features).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        name={`features.${key}`}
                        checked={value}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {key === 'elevator' && 'Ascenseur'}
                        {key === 'balcony' && 'Balcon'}
                        {key === 'parking' && 'Parking'}
                        {key === 'cellar' && 'Cave'}
                        {key === 'garden' && 'Jardin'}
                        {key === 'terrace' && 'Terrasse'}
                        {key === 'security' && 'Sécurité'}
                        {key === 'internet' && 'Internet'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 4 - Médias & Publication */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-6 h-6 mr-2" />
                Médias & Publication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                             {/* Upload d'images */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Photos de la propriété
                 </label>
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                   <div className="text-center">
                     <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                     <div className="text-sm text-gray-600 mb-4">
                       Glissez-déposez vos images ou cliquez pour sélectionner
                     </div>
                     <input
                       type="file"
                       multiple
                       accept="image/*"
                       onChange={handleImageUpload}
                       className="hidden"
                       id="image-upload"
                     />
                     <Button 
                       type="button" 
                       variant="outline" 
                       size="sm"
                       onClick={() => document.getElementById('image-upload')?.click()}
                     >
                       <Plus className="w-4 h-4 mr-2" />
                       Ajouter des images
                     </Button>
                   </div>
                 </div>

                {/* Aperçu des images */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 text-xs">
                            Photo principale
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Visite virtuelle et vidéo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien visite virtuelle 360°
                  </label>
                  <Input
                    name="virtualTour"
                    value={formData.virtualTour}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lien vidéo
                  </label>
                  <Input
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              {/* Options de publication */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Options de publication
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Publier immédiatement
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Mettre en vedette (Premium)
                    </span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          
          {currentStep < 4 && (
            <Button
              type="button"
              onClick={handleNextStep}
            >
              Suivant
            </Button>
          )}
        </div>
      </div>
      
      {/* Separate form for final submission */}
      {currentStep === 4 && (
        <div className="mt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Toutes les étapes sont complétées !
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Vous pouvez maintenant créer votre propriété en cliquant sur le bouton ci-dessous.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Créer la propriété
                </>
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
