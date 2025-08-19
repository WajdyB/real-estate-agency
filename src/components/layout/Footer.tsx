'use client'

import React from 'react'
import Link from 'next/link'
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-semibold">
                Agence Premium
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Votre partenaire immobilier de confiance en Tunisie depuis plus de 20 ans. 
              Nous vous accompagnons dans tous vos projets immobiliers avec 
              expertise et professionnalisme à travers tout le territoire tunisien.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-white transition-colors">
                  Nos Propriétés
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
                  Recherche Avancée
                </Link>
              </li>
              <li>
                <Link href="/estimation" className="text-gray-400 hover:text-white transition-colors">
                  Estimation Gratuite
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog Immobilier
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nos Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/achat" className="text-gray-400 hover:text-white transition-colors">
                  Achat Immobilier
                </Link>
              </li>
              <li>
                <Link href="/services/vente" className="text-gray-400 hover:text-white transition-colors">
                  Vente Immobilière
                </Link>
              </li>
              <li>
                <Link href="/services/location" className="text-gray-400 hover:text-white transition-colors">
                  Location
                </Link>
              </li>
              <li>
                <Link href="/services/gestion" className="text-gray-400 hover:text-white transition-colors">
                  Gestion Locative
                </Link>
              </li>
              <li>
                <Link href="/services/conseil" className="text-gray-400 hover:text-white transition-colors">
                  Conseil Patrimonial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contactez-nous</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">
                    Avenue Habib Bourguiba, Centre Ville<br />
                    1001 Tunis, Tunisie
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+21671234567"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +216 71 234 567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:contact@agence-premium.tn"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  contact@agence.tn
                </a>
              </div>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-500">
                Ouvert du Lundi au Vendredi<br />
                9h00 - 19h00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Agence Immobilière Premium. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Politique de Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Conditions d'Utilisation
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
