import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/providers/SessionProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Agence Immobilière Premium - Votre partenaire immobilier de confiance',
  description: 'Découvrez notre sélection exclusive de propriétés immobilières. Achat, vente, location avec notre équipe d\'experts. Service personnalisé et accompagnement sur mesure.',
  keywords: 'immobilier, achat, vente, location, appartement, maison, villa, Paris, France',
  authors: [{ name: 'Agence Immobilière Premium' }],
  creator: 'Agence Immobilière Premium',
  publisher: 'Agence Immobilière Premium',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'Agence Immobilière Premium',
    description: 'Votre partenaire immobilier de confiance',
    siteName: 'Agence Immobilière Premium',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agence Immobilière Premium',
    description: 'Votre partenaire immobilier de confiance',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
