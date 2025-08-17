'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Users,
  Mail,
  Calendar,
  FileText
} from 'lucide-react'

export default function PrivacyPage() {
  const lastUpdated = '15 janvier 2024'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-8">
        <div className="container">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Nous nous engageons à protéger et respecter votre vie privée. 
              Cette politique explique comment nous collectons, utilisons et protégeons vos données personnelles.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              Dernière mise à jour : {lastUpdated}
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sommaire */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg">Sommaire</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <a href="#collecte" className="block text-sm text-primary-600 hover:text-primary-700">
                      1. Collecte des données
                    </a>
                    <a href="#utilisation" className="block text-sm text-primary-600 hover:text-primary-700">
                      2. Utilisation des données
                    </a>
                    <a href="#partage" className="block text-sm text-primary-600 hover:text-primary-700">
                      3. Partage des données
                    </a>
                    <a href="#protection" className="block text-sm text-primary-600 hover:text-primary-700">
                      4. Protection des données
                    </a>
                    <a href="#droits" className="block text-sm text-primary-600 hover:text-primary-700">
                      5. Vos droits
                    </a>
                    <a href="#cookies" className="block text-sm text-primary-600 hover:text-primary-700">
                      6. Cookies
                    </a>
                    <a href="#contact" className="block text-sm text-primary-600 hover:text-primary-700">
                      7. Contact
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-8">
              {/* Introduction */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Notre engagement
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        Agence Immobilière Premium s'engage à protéger la confidentialité et la sécurité 
                        de vos données personnelles conformément au Règlement Général sur la Protection 
                        des Données (RGPD) et à la loi française "Informatique et Libertés".
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 1. Collecte des données */}
              <Card id="collecte">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-6 h-6 mr-2" />
                    1. Collecte des données personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Données collectées
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Nous collectons les données personnelles suivantes :
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <strong>Données de localisation :</strong> adresse postale, préférences géographiques
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <strong>Données de navigation :</strong> adresse IP, cookies, pages visitées
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <strong>Données transactionnelles :</strong> historique des recherches, favoris, transactions
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Moyens de collecte
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Formulaires de contact et d'inscription</li>
                        <li>• Création de compte utilisateur</li>
                        <li>• Navigation sur notre site web</li>
                        <li>• Échanges téléphoniques et emails</li>
                        <li>• Rendez-vous et visites de biens</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Utilisation des données */}
              <Card id="utilisation">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-6 h-6 mr-2" />
                    2. Utilisation des données personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Vos données personnelles sont utilisées pour les finalités suivantes :
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Services principaux</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Gestion de votre compte</li>
                          <li>• Recherche de biens immobiliers</li>
                          <li>• Organisation de visites</li>
                          <li>• Traitement des transactions</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Communication</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Réponse à vos demandes</li>
                          <li>• Envoi d'alertes personnalisées</li>
                          <li>• Newsletter et actualités</li>
                          <li>• Support client</li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-900 mb-2">Amélioration</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Analyse de l'utilisation</li>
                          <li>• Personnalisation de l'expérience</li>
                          <li>• Développement de nouveaux services</li>
                          <li>• Mesure de satisfaction</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-900 mb-2">Obligations légales</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Respect des réglementations</li>
                          <li>• Prévention de la fraude</li>
                          <li>• Archivage légal</li>
                          <li>• Contrôles administratifs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Partage des données */}
              <Card id="partage">
                <CardHeader>
                  <CardTitle>3. Partage des données personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement dans les cas suivants :
                    </p>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Prestataires de services</h4>
                        <p className="text-sm text-gray-700">
                          Avec nos partenaires techniques (hébergement, paiement, marketing) sous contrat de confidentialité strict.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Partenaires immobiliers</h4>
                        <p className="text-sm text-gray-700">
                          Avec d'autres agences ou professionnels pour répondre à vos demandes spécifiques, avec votre consentement.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Obligations légales</h4>
                        <p className="text-sm text-gray-700">
                          Avec les autorités compétentes en cas de réquisition judiciaire ou d'obligation légale.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. Protection des données */}
              <Card id="protection">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-6 h-6 mr-2" />
                    4. Protection et sécurité des données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Mesures techniques</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Chiffrement des données (SSL/TLS)</li>
                          <li>• Sauvegardes régulières sécurisées</li>
                          <li>• Pare-feu et protection anti-intrusion</li>
                          <li>• Authentification forte</li>
                          <li>• Surveillance continue des systèmes</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Mesures organisationnelles</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Formation du personnel à la RGPD</li>
                          <li>• Accès limité aux données (besoin d'en connaître)</li>
                          <li>• Contrats de confidentialité</li>
                          <li>• Procédures de gestion des incidents</li>
                          <li>• Audits de sécurité réguliers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Vos droits */}
              <Card id="droits">
                <CardHeader>
                  <CardTitle>5. Vos droits sur vos données personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Conformément au RGPD, vous disposez des droits suivants :
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Droit d'accès</h4>
                        <p className="text-sm text-gray-700">
                          Vous pouvez demander l'accès aux données personnelles que nous détenons sur vous.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Droit de rectification</h4>
                        <p className="text-sm text-gray-700">
                          Vous pouvez demander la correction de données inexactes ou incomplètes.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Droit à l'effacement</h4>
                        <p className="text-sm text-gray-700">
                          Vous pouvez demander la suppression de vos données dans certaines conditions.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Droit à la portabilité</h4>
                        <p className="text-sm text-gray-700">
                          Vous pouvez récupérer vos données dans un format structuré et lisible.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Droit d'opposition</h4>
                        <p className="text-sm text-gray-700">
                          Vous pouvez vous opposer au traitement de vos données à des fins de marketing direct.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Comment exercer vos droits :</strong> Contactez-nous à l'adresse 
                        <a href="mailto:dpo@agence-premium.fr" className="text-blue-600 underline ml-1">
                          dpo@agence-premium.fr
                        </a> avec une pièce d'identité. Nous répondrons dans un délai d'un mois.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 6. Cookies */}
              <Card id="cookies">
                <CardHeader>
                  <CardTitle>6. Politique des cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Notre site utilise des cookies pour améliorer votre expérience de navigation :
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Cookies essentiels</h4>
                        <p className="text-sm text-gray-700">
                          Nécessaires au fonctionnement du site (authentification, panier, préférences).
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">Cookies analytiques</h4>
                        <p className="text-sm text-gray-700">
                          Nous aident à comprendre comment vous utilisez notre site (Google Analytics).
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900">Cookies marketing</h4>
                        <p className="text-sm text-gray-700">
                          Permettent de personnaliser les publicités et mesurer leur efficacité.
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur 
                      ou notre bandeau de consentement.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 7. Contact */}
              <Card id="contact">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-6 h-6 mr-2" />
                    7. Contact et réclamations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Délégué à la Protection des Données (DPO)</h4>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>Email : <a href="mailto:dpo@agence-premium.fr" className="text-primary-600 underline">dpo@agence-premium.fr</a></p>
                        <p>Adresse : 123 Avenue des Champs-Élysées, 75008 Paris</p>
                        <p>Téléphone : +33 1 23 45 67 89</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Autorité de contrôle</h4>
                      <p className="text-sm text-gray-700">
                        Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation 
                        auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">CNIL</a>.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mise à jour */}
              <Card>
                <CardContent className="p-6 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Modifications de cette politique</h4>
                      <p className="text-sm text-gray-700">
                        Cette politique peut être mise à jour occasionnellement. 
                        Nous vous informerons des changements significatifs par email ou via notre site web.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Version actuelle : 2.1 - Dernière mise à jour : {lastUpdated}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
