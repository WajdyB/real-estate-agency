'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  Building2, 
  LayoutDashboard, 
  Home, 
  Users, 
  CreditCard, 
  MessageSquare, 
  Calendar, 
  Settings, 
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react'

const navigation = [
  {
    name: 'Tableau de bord',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Propriétés',
    href: '/admin/properties',
    icon: Home,
    children: [
      { name: 'Toutes les propriétés', href: '/admin/properties' },
      { name: 'Ajouter une propriété', href: '/admin/properties/new' },
    ]
  },
  {
    name: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Paiements',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    name: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    name: 'Rendez-vous',
    href: '/admin/appointments',
    icon: Calendar,
  },
  {
    name: 'Blog',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    name: 'Statistiques',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Redirection si non authentifié ou pas les bonnes permissions
  React.useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    if (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'AGENT')) {
    return null
  }

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-display font-semibold text-gray-900">
              Admin Panel
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const isExpanded = expandedItems.includes(item.name)
            
            return (
              <div key={item.name}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`flex-1 flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                  {item.children && (
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </button>
                  )}
                </div>
                
                {item.children && isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === child.href
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {session.user.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.role}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between lg:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                Voir le site
              </Button>
            </Link>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
