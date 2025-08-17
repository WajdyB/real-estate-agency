'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { 
  Home, 
  Building2, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Heart,
  Bell
} from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Propriétés', href: '/properties', icon: Building2 },
    { name: 'Recherche', href: '/search', icon: Search },
    { name: 'Blog', href: '/blog', icon: null },
    { name: 'Contact', href: '/contact', icon: null },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-semibold text-gray-900">
              Agence Premium
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-gray-700 font-medium">
                    {session.user.name}
                  </span>
                </button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-gray-200 py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Mon Profil</span>
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      <span>Favoris</span>
                    </Link>
                    <Link
                      href="/alerts"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Bell className="w-4 h-4" />
                      <span>Alertes</span>
                    </Link>
                    {(session.user.role === 'ADMIN' || session.user.role === 'AGENT') && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Administration</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut()
                        setIsUserMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Inscription
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="w-5 h-5" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
