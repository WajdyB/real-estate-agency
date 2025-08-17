# 🚀 Guide de Déploiement - Agence Immobilière Premium

Ce guide vous accompagne dans le déploiement de l'application en production.

## 📋 Prérequis

- Compte sur une plateforme de déploiement (Vercel, Netlify, Railway, etc.)
- Base de données MySQL en production
- Compte Stripe configuré
- Nom de domaine (optionnel)

## 🌐 Déploiement sur Vercel (Recommandé)

### 1. Préparation du repository
```bash
# Assurez-vous que votre code est sur GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Configuration Vercel
1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Configurez les paramètres :
   - **Framework Preset** : Next.js
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`

### 3. Variables d'environnement
Dans les paramètres Vercel, ajoutez ces variables :

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Agence Immobilière Premium
```

### 4. Déploiement
1. Cliquez sur "Deploy"
2. Attendez la fin du build
3. Votre application sera disponible sur l'URL fournie

## 🗄️ Base de Données en Production

### Option 1: PlanetScale (MySQL Serverless)
1. Créez un compte sur [planetscale.com](https://planetscale.com)
2. Créez une nouvelle base de données
3. Récupérez la connection string
4. Configurez `DATABASE_URL` dans Vercel

```bash
# Déployez le schéma
npx prisma db push

# Alimentez avec des données (optionnel)
npx prisma db seed
```

### Option 2: Railway
1. Créez un compte sur [railway.app](https://railway.app)
2. Créez un service MySQL
3. Récupérez les credentials
4. Configurez la connection string

### Option 3: Supabase (PostgreSQL)
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Récupérez la connection string PostgreSQL
3. Modifiez le provider dans `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 💳 Configuration Stripe Production

### 1. Activation du compte Live
1. Complétez les informations de votre entreprise
2. Activez les paiements en direct
3. Récupérez les clés Live

### 2. Configuration des Webhooks
1. Allez dans Stripe Dashboard > Webhooks
2. Ajoutez un endpoint : `https://your-domain.vercel.app/api/stripe/webhook`
3. Sélectionnez ces événements :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Copiez le secret du webhook

### 3. Tests en production
```bash
# Utilisez les cartes de test Stripe
# 4242 4242 4242 4242 (Visa)
# 4000 0000 0000 0002 (Décliné)
```

## 🔧 Optimisations Production

### 1. Performance
```typescript
// next.config.js
const nextConfig = {
  // Compression
  compress: true,
  
  // Images optimisées
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Headers de cache
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### 2. SEO
- Vérifiez que le sitemap est accessible : `/sitemap.xml`
- Testez les métadonnées avec les outils Google/Facebook
- Configurez Google Search Console
- Ajoutez Google Analytics

### 3. Monitoring
```typescript
// Ajoutez Sentry pour le monitoring des erreurs
npm install @sentry/nextjs

// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV,
})
```

## 🔒 Sécurité Production

### 1. Variables d'environnement
- Utilisez des secrets forts et uniques
- Ne commitez jamais les fichiers `.env`
- Rotez régulièrement les clés API

### 2. Headers de sécurité
```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
      ],
    },
  ]
}
```

### 3. Rate Limiting
```bash
npm install @upstash/ratelimit @upstash/redis
```

## 📊 Monitoring et Analytics

### 1. Vercel Analytics
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Google Analytics
```typescript
// lib/gtag.js
export const GA_TRACKING_ID = 'GA_MEASUREMENT_ID'

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
```

## 🌍 Domaine Personnalisé

### 1. Configuration DNS
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 2. Configuration Vercel
1. Allez dans Settings > Domains
2. Ajoutez votre domaine
3. Vérifiez la configuration DNS
4. Activez HTTPS automatique

## 🔄 CI/CD et Déploiement Automatique

### 1. GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
```

### 2. Branches de déploiement
- `main` → Production
- `staging` → Staging
- `develop` → Development

## 📝 Checklist de Déploiement

### Avant le déploiement
- [ ] Tests passent localement
- [ ] Variables d'environnement configurées
- [ ] Base de données prête
- [ ] Stripe configuré
- [ ] Images optimisées
- [ ] SEO configuré

### Après le déploiement
- [ ] Site accessible
- [ ] Fonctionnalités testées
- [ ] Paiements fonctionnels
- [ ] Emails envoyés
- [ ] Analytics configurés
- [ ] Sitemap accessible
- [ ] Performance vérifiée

## 🆘 Dépannage

### Erreurs communes

**Build Failed**
```bash
# Vérifiez les types TypeScript
npm run type-check

# Vérifiez le linting
npm run lint
```

**Database Connection Error**
```bash
# Testez la connexion
npx prisma db push

# Vérifiez les credentials
echo $DATABASE_URL
```

**Stripe Webhook Failed**
```bash
# Vérifiez l'URL du webhook
# Testez avec Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs Vercel
2. Consultez la documentation
3. Testez localement
4. Contactez le support

---

**Bon déploiement ! 🚀**
