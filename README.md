# 🏠 Agence Immobilière Premium

Une application web complète et moderne pour agences immobilières, développée avec Next.js 14, MySQL, Stripe et les dernières technologies web. Interface professionnelle, sécurisée et prête pour la production.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?logo=mysql)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-teal?logo=tailwindcss)

## 🌟 Aperçu

Application fullstack complète offrant une expérience utilisateur exceptionnelle pour clients et agents immobiliers, avec interface d'administration avancée, paiements sécurisés et design moderne.

## ✨ Fonctionnalités Complètes

### 🏡 **Front-office (Interface Publique)**

#### **Pages Principales**
- 🏠 **Page d'accueil** - Présentation élégante avec recherche rapide et propriétés vedettes
- 🏘️ **Catalogue complet** - Liste des biens avec filtres avancés (type, prix, superficie, localisation, pièces)
- 🔍 **Recherche avancée** - Interface avec carte interactive Leaflet/OpenStreetMap et géolocalisation
- 📋 **Fiche détaillée** - Galerie photos HD, visite virtuelle 360°, caractéristiques complètes
- 💳 **Paiement Stripe** - Réservation et acomptes sécurisés avec historique des transactions
- 📱 **Blog immobilier** - Articles, actualités, conseils avec système de catégories
- 📞 **Contact multi-canal** - Formulaire, chat en ligne, WhatsApp, prise de RDV
- ℹ️ **À propos** - Présentation de l'équipe, histoire, valeurs, certifications
- 🛠️ **Services détaillés** - Achat, vente, investissement, gestion locative
- 📊 **Estimation en ligne** - Outil d'évaluation gratuite en 4 étapes

#### **Espace Utilisateur Personnel**
- 🔐 **Authentification complète** - Email/password + OAuth (Google, Facebook)
- 👤 **Profil personnalisé** - Gestion des informations, préférences, historique
- ❤️ **Favoris avancés** - Sauvegarde, organisation, partage, export PDF
- 🔔 **Alertes intelligentes** - Notifications email/SMS pour nouveaux biens correspondants
- 📈 **Tableau de bord** - Statistiques personnelles, activité récente
- 💰 **Historique paiements** - Suivi des transactions et factures

### 🛠️ **Back-office (Administration)**

#### **Tableau de Bord Analytique**
- 📊 **Statistiques temps réel** - Propriétés en ligne, visites, utilisateurs actifs
- 💹 **Métriques financières** - CA, transactions Stripe, commissions
- 📈 **Graphiques interactifs** - Évolution des ventes, performance agents
- 🎯 **Indicateurs KPI** - Taux de conversion, satisfaction client

#### **Gestion Complète des Propriétés**
- ➕ **Ajout guidé** - Formulaire en 4 étapes avec validation
- 🖼️ **Upload média** - Images HD, vidéos, visites virtuelles 360°
- ✏️ **Édition avancée** - Modification complète, gestion du statut
- 🗺️ **Géolocalisation** - Positionnement GPS précis sur carte
- 🏷️ **Gestion des tags** - Équipements, caractéristiques, mise en vedette
- 📋 **Import/Export** - Fichiers CSV, synchronisation MLS

#### **Administration Utilisateurs**
- 👥 **Gestion des rôles** - Admin, Agent, Client avec permissions granulaires
- 📝 **Profils détaillés** - Informations complètes, historique d'activité
- 📧 **Communication** - Envoi d'emails groupés, newsletters
- 🚫 **Modération** - Suspension, activation, gestion des signalements

#### **Suivi Commercial**
- 💳 **Transactions Stripe** - Historique, remboursements, réconciliation
- 📅 **Rendez-vous** - Planning, confirmations, rappels automatiques
- 💬 **Messages clients** - Centre de communication unifié
- 📊 **Rapports détaillés** - Performance, commissions, statistiques

#### **Gestion de Contenu**
- ✍️ **Blog management** - Création, édition, publication d'articles
- 📚 **Revue digitale** - Catalogues PDF interactifs
- ⚙️ **Paramètres SEO** - Meta tags, URLs, Schema.org
- 🏢 **Informations agence** - Coordonnées, équipe, services

### 🔧 **Fonctionnalités Techniques Avancées**

#### **Architecture Moderne**
- ⚡ **Next.js 14** - App Router, Server Components, optimisations automatiques
- 🗄️ **Base de données MySQL** - Prisma ORM, migrations, relations complexes
- 🔐 **NextAuth.js** - Authentification sécurisée, sessions, JWT
- 💳 **Stripe intégré** - Paiements, webhooks, gestion des erreurs
- 🗺️ **Cartes interactives** - Leaflet, OpenStreetMap, clustering
- 🎨 **Tailwind CSS** - Design system cohérent, responsive
- 📱 **TypeScript** - Sécurité du code, auto-complétion

#### **SEO & Performance**
- 🔍 **SEO optimisé** - Meta tags dynamiques, Schema.org, sitemap.xml
- ⚡ **Performance** - Images optimisées, lazy loading, caching
- 📱 **PWA Ready** - Installation, notifications push, mode offline
- 🌐 **Multilingue** - Support français/arabe avec next-intl
- 🔒 **Sécurité OWASP** - Protection XSS, CSRF, injection SQL

#### **Intégrations Tierces**
- 📧 **Nodemailer** - Envoi d'emails transactionnels
- 🖼️ **Sharp** - Optimisation et redimensionnement d'images
- 📊 **Analytics** - Google Analytics, tracking des conversions
- 💬 **Chat en direct** - Widget de discussion intégré
- 📱 **WhatsApp** - Lien direct pour contact rapide

### 📄 **Pages Légales Complètes**
- 🔒 **Politique de confidentialité** - Conforme RGPD, détaillée
- ⚖️ **Conditions générales** - Utilisation du site, services
- 🍪 **Politique cookies** - Gestion des préférences utilisateur

## 🚀 Guide d'Installation Détaillé

### 📋 **Prérequis Système**

Avant de commencer, assurez-vous d'avoir installé :

| Logiciel | Version Minimale | Recommandée | Lien de téléchargement |
|----------|------------------|-------------|------------------------|
| **Node.js** | 18.0+ | 20.0+ LTS | [nodejs.org](https://nodejs.org) |
| **npm** | 9.0+ | 10.0+ | Inclus avec Node.js |
| **MySQL** | 8.0+ | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| **Git** | 2.30+ | Latest | [git-scm.com](https://git-scm.com) |

#### **Comptes Tiers (Optionnels)**
- 💳 **Stripe** - Pour les paiements ([dashboard.stripe.com](https://dashboard.stripe.com))
- 🔑 **Google OAuth** - Pour l'authentification Google ([console.cloud.google.com](https://console.cloud.google.com))
- 📘 **Facebook OAuth** - Pour l'authentification Facebook ([developers.facebook.com](https://developers.facebook.com))

---

### 📁 **1. Cloner et Préparer le Projet**

```bash
# Cloner le repository
git clone <repository-url>
cd real-estate-app

# Vérifier la version de Node.js
node --version
# Doit afficher v18.0.0 ou supérieur

# Vérifier npm
npm --version
```

---

### 📦 **2. Installation des Dépendances**

```bash
# Installation des dépendances principales et de développement
npm install

# Vérification de l'installation
npm list --depth=0
```

**Dépendances principales installées :**
- `next` - Framework React fullstack
- `react` & `react-dom` - Bibliothèque UI
- `prisma` & `@prisma/client` - ORM base de données
- `next-auth` - Authentification
- `stripe` - Paiements en ligne
- `tailwindcss` - Framework CSS
- `typescript` - Typage statique

---

### ⚙️ **3. Configuration de l'Environnement**

#### **3.1 Créer le fichier d'environnement**

```bash
# Copier le fichier d'exemple
cp env.example .env.local

# Ou sur Windows
copy env.example .env.local
```

#### **3.2 Configurer les variables d'environnement**

Éditez le fichier `.env.local` avec vos valeurs :

```env
# ===========================================
# 🗄️  BASE DE DONNÉES
# ===========================================
DATABASE_URL="mysql://username:password@localhost:3306/real_estate_db"
# Remplacez 'username' et 'password' par vos identifiants MySQL

# ===========================================
# 🔐 AUTHENTIFICATION NEXTAUTH
# ===========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-super-longue-et-sécurisée"
# Générez une clé sécurisée avec : openssl rand -base64 32

# ===========================================
# 🔑 OAUTH PROVIDERS (OPTIONNEL)
# ===========================================
# Google OAuth
GOOGLE_CLIENT_ID="votre-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"

# Facebook OAuth  
FACEBOOK_CLIENT_ID="votre-facebook-app-id"
FACEBOOK_CLIENT_SECRET="votre-facebook-app-secret"

# ===========================================
# 💳 STRIPE PAIEMENTS
# ===========================================
STRIPE_PUBLISHABLE_KEY="pk_test_51..."
STRIPE_SECRET_KEY="sk_test_51..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ===========================================
# 🌐 CONFIGURATION APPLICATION
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ===========================================
# 📧 EMAIL (OPTIONNEL)
# ===========================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"
```

#### **3.3 Générer une clé NEXTAUTH_SECRET sécurisée**

```bash
# Méthode 1 : OpenSSL (recommandée)
openssl rand -base64 32

# Méthode 2 : Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Méthode 3 : En ligne
# Visitez : https://generate-secret.vercel.app/32
```

---

### 🗄️ **4. Configuration de la Base de Données MySQL**

#### **4.1 Créer la base de données**

```sql
-- Se connecter à MySQL
mysql -u root -p

-- Créer la base de données
CREATE DATABASE real_estate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer un utilisateur dédié (recommandé)
CREATE USER 'real_estate_user'@'localhost' IDENTIFIED BY 'mot_de_passe_fort';

-- Donner les permissions
GRANT ALL PRIVILEGES ON real_estate_db.* TO 'real_estate_user'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;

-- Quitter MySQL
EXIT;
```

#### **4.2 Initialiser Prisma**

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer le schéma à la base de données
npx prisma db push

# Vérifier la connexion (optionnel)
npx prisma studio
# Ouvre l'interface web sur http://localhost:5555
```

#### **4.3 Alimenter avec des données de test**

```bash
# Exécuter le script de seeding
npm run db:seed

# En cas d'erreur, réessayer avec :
npx tsx prisma/seed.ts
```

**Données de test créées :**
- 👤 **Utilisateurs** : Admin, Agent, Clients
- 🏠 **Propriétés** : Appartements, Maisons, Villas
- 📝 **Articles de blog** : Conseils immobiliers
- 📊 **Données de démonstration**

---

### 💳 **5. Configuration Stripe (Paiements)**

#### **5.1 Créer un compte Stripe**

1. Allez sur [stripe.com](https://stripe.com) et créez un compte
2. Activez le mode Test pour le développement
3. Notez vos clés API dans le Dashboard

#### **5.2 Récupérer les clés API**

Dans le Dashboard Stripe :
- **Clé publique** : `pk_test_...` (commence par `pk_test_`)
- **Clé secrète** : `sk_test_...` (commence par `sk_test_`)

#### **5.3 Configurer les Webhooks**

1. Allez dans **Développeurs** > **Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL : `http://localhost:3000/api/stripe/webhook`
4. Événements à sélectionner :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `checkout.session.completed`
5. Copiez le **Secret de signature** (`whsec_...`)

#### **5.4 Tester les paiements**

Utilisez ces cartes de test Stripe :
- ✅ **Succès** : `4242 4242 4242 4242`
- ❌ **Échec** : `4000 0000 0000 0002`
- 🔐 **3D Secure** : `4000 0027 6000 3184`

---

### 🔑 **6. Configuration OAuth (Optionnel)**

#### **6.1 Google OAuth**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez-en un
3. Activez l'API Google+ 
4. Créez des identifiants OAuth 2.0
5. Ajoutez les URI de redirection :
   - `http://localhost:3000/api/auth/callback/google`
   - `https://votre-domaine.com/api/auth/callback/google`

#### **6.2 Facebook OAuth**

1. Allez sur [Facebook Developers](https://developers.facebook.com)
2. Créez une nouvelle application
3. Ajoutez le produit "Facebook Login"
4. Configurez les URI de redirection :
   - `http://localhost:3000/api/auth/callback/facebook`

---

### 🚀 **7. Lancement de l'Application**

#### **7.1 Démarrage en mode développement**

```bash
# Lancer le serveur de développement
npm run dev

# L'application sera accessible sur :
# 🌐 http://localhost:3000
```

#### **7.2 Vérifications de fonctionnement**

1. **Page d'accueil** : http://localhost:3000
2. **Admin** : http://localhost:3000/admin
3. **API Health** : http://localhost:3000/api/health
4. **Base de données** : http://localhost:5555 (Prisma Studio)

#### **7.3 Comptes de démonstration**

| Rôle | Email | Mot de passe | Accès |
|------|-------|--------------|-------|
| **Admin** | admin@agence-immobiliere.fr | admin123 | Accès complet |
| **Agent** | agent@agence-immobiliere.fr | agent123 | Gestion propriétés |
| **Client** | client@test.fr | client123 | Interface publique |

---

### ✅ **8. Vérification de l'Installation**

#### **8.1 Checklist de vérification**

- [ ] ✅ Page d'accueil charge correctement
- [ ] ✅ Connexion admin fonctionne
- [ ] ✅ Base de données connectée (Prisma Studio accessible)
- [ ] ✅ Propriétés s'affichent dans le catalogue
- [ ] ✅ Formulaires de contact fonctionnent
- [ ] ✅ Recherche et filtres opérationnels
- [ ] ✅ Cartes interactives s'affichent
- [ ] ✅ Design responsive sur mobile

#### **8.2 Tests de fonctionnalités**

```bash
# Tester la base de données
npx prisma studio

# Tester les API routes
curl http://localhost:3000/api/properties
curl http://localhost:3000/api/auth/session

# Tester le build de production
npm run build
npm start
```

---

### 🔧 **9. Dépannage Courant**

#### **Erreurs fréquentes et solutions**

| Erreur | Cause | Solution |
|--------|-------|----------|
| `JWT_SESSION_ERROR` | NEXTAUTH_SECRET manquant | Ajouter une clé secrète dans `.env.local` |
| `PrismaClientInitializationError` | Base de données inaccessible | Vérifier DATABASE_URL et MySQL |
| `Module not found: stripe` | Dépendances manquantes | Exécuter `npm install` |
| `Port 3000 already in use` | Port occupé | Utiliser `npx kill-port 3000` |

#### **Commandes de diagnostic**

```bash
# Vérifier les variables d'environnement
npm run env:check

# Nettoyer les caches
npm run clean
rm -rf .next node_modules
npm install

# Réinitialiser la base de données
npx prisma db push --force-reset
npm run db:seed

# Vérifier les logs
tail -f .next/trace
```

---

### 📊 **10. Monitoring et Logs**

#### **10.1 Logs de développement**

```bash
# Logs du serveur Next.js
npm run dev -- --turbo

# Logs de la base de données
npx prisma studio

# Logs Stripe (webhooks)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

#### **10.2 Outils de debugging**

- **React DevTools** - Extension navigateur
- **Prisma Studio** - Interface base de données
- **Stripe CLI** - Testing webhooks
- **Next.js DevTools** - Performance monitoring

---

## 📁 **Structure Détaillée du Projet**

```
📦 real-estate-app/
├── 📁 prisma/                      # Configuration base de données
│   ├── 📄 schema.prisma           # Schéma de la base de données
│   └── 📄 seed.ts                 # Script de données de test
│
├── 📁 public/                      # Ressources statiques
│   ├── 📄 favicon.ico             # Icône du site
│   ├── 📄 logo.png                # Logo de l'agence
│   └── 📄 robots.txt              # Instructions pour robots
│
├── 📁 src/                         # Code source principal
│   ├── 📁 app/                    # Pages Next.js (App Router)
│   │   ├── 📁 admin/              # 🛠️ Interface d'administration
│   │   │   ├── 📄 layout.tsx      # Layout admin avec sidebar
│   │   │   ├── 📄 page.tsx        # Tableau de bord principal
│   │   │   ├── 📁 properties/     # Gestion des propriétés
│   │   │   │   ├── 📄 page.tsx    # Liste des propriétés
│   │   │   │   ├── 📁 new/        # Ajout de propriété
│   │   │   │   │   └── 📄 page.tsx # Formulaire d'ajout
│   │   │   │   └── 📁 [id]/       # Édition de propriété
│   │   │   │       └── 📁 edit/   
│   │   │   │           └── 📄 page.tsx
│   │   │   ├── 📁 users/          # Gestion des utilisateurs
│   │   │   ├── 📁 payments/       # Suivi des paiements
│   │   │   ├── 📁 messages/       # Centre de messages
│   │   │   ├── 📁 blog/           # Gestion du blog
│   │   │   ├── 📁 analytics/      # Statistiques avancées
│   │   │   └── 📁 settings/       # Paramètres généraux
│   │   │
│   │   ├── 📁 auth/               # 🔐 Authentification
│   │   │   ├── 📄 signin/         # Page de connexion
│   │   │   └── 📄 signup/         # Page d'inscription
│   │   │
│   │   ├── 📁 properties/         # 🏠 Propriétés publiques
│   │   │   ├── 📄 page.tsx        # Catalogue des biens
│   │   │   └── 📁 [id]/           # Fiche détaillée
│   │   │       └── 📄 page.tsx    
│   │   │
│   │   ├── 📁 blog/               # 📱 Blog immobilier
│   │   │   ├── 📄 page.tsx        # Liste des articles
│   │   │   └── 📁 [slug]/         # Article détaillé
│   │   │       └── 📄 page.tsx    
│   │   │
│   │   ├── 📁 api/                # 🔌 Routes API
│   │   │   ├── 📁 auth/           # Authentification NextAuth
│   │   │   ├── 📁 properties/     # API des propriétés
│   │   │   ├── 📁 stripe/         # Intégration Stripe
│   │   │   ├── 📁 users/          # Gestion utilisateurs
│   │   │   └── 📁 upload/         # Upload de fichiers
│   │   │
│   │   ├── 📄 about/page.tsx      # À propos de l'agence
│   │   ├── 📄 contact/page.tsx    # Page de contact
│   │   ├── 📄 services/page.tsx   # Services détaillés
│   │   ├── 📄 estimation/page.tsx # Estimation en ligne
│   │   ├── 📄 search/page.tsx     # Recherche avancée
│   │   ├── 📄 profile/page.tsx    # Profil utilisateur
│   │   ├── 📄 favorites/page.tsx  # Favoris utilisateur
│   │   ├── 📄 privacy/page.tsx    # Politique de confidentialité
│   │   ├── 📄 terms/page.tsx      # Conditions générales
│   │   ├── 📄 layout.tsx          # Layout racine
│   │   ├── 📄 page.tsx            # Page d'accueil
│   │   ├── 📄 globals.css         # Styles globaux
│   │   ├── 📄 sitemap.ts          # Génération sitemap
│   │   └── 📄 robots.ts           # Génération robots.txt
│   │
│   ├── 📁 components/             # 🧩 Composants React
│   │   ├── 📁 ui/                 # Composants UI de base
│   │   │   ├── 📄 Button.tsx      # Boutons stylisés
│   │   │   ├── 📄 Card.tsx        # Cartes de contenu
│   │   │   ├── 📄 Input.tsx       # Champs de saisie
│   │   │   ├── 📄 Badge.tsx       # Badges et étiquettes
│   │   │   └── 📄 Skeleton.tsx    # Composants de chargement
│   │   │
│   │   ├── 📁 layout/             # Composants de mise en page
│   │   │   ├── 📄 Header.tsx      # En-tête du site
│   │   │   ├── 📄 Footer.tsx      # Pied de page
│   │   │   └── 📄 Sidebar.tsx     # Barre latérale admin
│   │   │
│   │   ├── 📁 property/           # Composants propriétés
│   │   │   ├── 📄 PropertyCard.tsx    # Carte de propriété
│   │   │   ├── 📄 PropertyGallery.tsx # Galerie d'images
│   │   │   └── 📄 PropertyFilters.tsx # Filtres de recherche
│   │   │
│   │   ├── 📁 maps/               # Composants de cartes
│   │   │   ├── 📄 PropertyMap.tsx # Carte interactive
│   │   │   └── 📄 MapMarker.tsx   # Marqueurs de propriétés
│   │   │
│   │   ├── 📁 forms/              # Formulaires spécialisés
│   │   │   ├── 📄 ContactForm.tsx # Formulaire de contact
│   │   │   ├── 📄 SearchForm.tsx  # Formulaire de recherche
│   │   │   └── 📄 EstimationForm.tsx # Formulaire d'estimation
│   │   │
│   │   ├── 📁 seo/                # Composants SEO
│   │   │   ├── 📄 JsonLd.tsx      # Données structurées
│   │   │   └── 📄 MetaTags.tsx    # Balises meta
│   │   │
│   │   └── 📁 providers/          # Providers React
│   │       ├── 📄 SessionProvider.tsx # Contexte d'authentification
│   │       └── 📄 ThemeProvider.tsx   # Contexte de thème
│   │
│   ├── 📁 lib/                    # 🛠️ Utilitaires et configurations
│   │   ├── 📄 auth.ts             # Configuration NextAuth
│   │   ├── 📄 prisma.ts           # Client Prisma
│   │   ├── 📄 stripe.ts           # Configuration Stripe
│   │   ├── 📄 seo.ts              # Utilitaires SEO
│   │   ├── 📄 utils.ts            # Fonctions utilitaires
│   │   ├── 📄 validations.ts      # Schémas de validation Zod
│   │   └── 📄 constants.ts        # Constantes de l'application
│   │
│   └── 📁 types/                  # 📝 Types TypeScript
│       ├── 📄 next-auth.d.ts      # Types NextAuth personnalisés
│       ├── 📄 property.ts         # Types des propriétés
│       ├── 📄 user.ts             # Types des utilisateurs
│       └── 📄 global.ts           # Types globaux
│
├── 📄 package.json                # Dépendances et scripts
├── 📄 next.config.js              # Configuration Next.js
├── 📄 tailwind.config.ts          # Configuration Tailwind CSS
├── 📄 postcss.config.js           # Configuration PostCSS
├── 📄 tsconfig.json               # Configuration TypeScript
├── 📄 .env.example                # Exemple de variables d'environnement
├── 📄 .gitignore                  # Fichiers ignorés par Git
├── 📄 README.md                   # Documentation du projet
├── 📄 FEATURES.md                 # Documentation des fonctionnalités
└── 📄 DEPLOYMENT.md               # Guide de déploiement
```

---

## 🎨 **Design System Moderne**

### **Palette de Couleurs**
```css
/* Couleurs principales */
--primary-50: #f0f9ff;
--primary-600: #2563eb;
--primary-800: #1e40af;

/* Couleurs secondaires */
--secondary-100: #fef3c7;
--secondary-600: #d97706;

/* Couleurs système */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--gray-50: #f9fafb;
--gray-900: #111827;
```

### **Typographie**
- **Font Display** : Playfair Display (titres élégants)
- **Font Sans** : Inter (texte courant)
- **Hiérarchie** : 6 niveaux de titres (h1-h6)
- **Responsive** : Tailles adaptatives selon l'écran

### **Composants UI**
- **Boutons** : 4 variants (primary, secondary, outline, ghost)
- **Cards** : Ombres douces, bordures arrondies
- **Inputs** : États focus, error, disabled
- **Badges** : Couleurs contextuelles
- **Animations** : Transitions fluides (200-300ms)

---

## 🔒 **Sécurité & Conformité**

### **Authentification Robuste**
- ✅ **NextAuth.js** - Sessions sécurisées JWT/Database
- ✅ **Hashage bcrypt** - Mots de passe chiffrés (12 rounds)
- ✅ **OAuth 2.0** - Google & Facebook intégrés
- ✅ **CSRF Protection** - Tokens anti-falsification
- ✅ **Rate Limiting** - Protection contre le spam

### **Protection des Données**
- ✅ **RGPD Compliant** - Politique de confidentialité détaillée
- ✅ **Validation Zod** - Sanitisation des entrées utilisateur
- ✅ **Headers sécurisés** - HSTS, CSP, X-Frame-Options
- ✅ **Chiffrement HTTPS** - SSL/TLS en production
- ✅ **Audit de sécurité** - Dépendances régulièrement mises à jour

### **Contrôle d'Accès**
- 🔐 **Rôles granulaires** : Admin, Agent, Client
- 🔐 **Permissions** : CRUD basé sur les rôles
- 🔐 **Middleware** : Protection des routes sensibles
- 🔐 **API Security** : Authentification sur toutes les routes

---

## 📱 **Responsive Design Excellence**

### **Approche Mobile-First**
```css
/* Breakpoints Tailwind */
sm: 640px   /* Smartphones */
md: 768px   /* Tablettes */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### **Optimisations**
- 📱 **Navigation adaptative** - Menu hamburger sur mobile
- 🖼️ **Images responsives** - Next.js Image avec optimisation
- 🗺️ **Cartes tactiles** - Contrôles adaptés au touch
- ⚡ **Performance mobile** - Lazy loading, compression
- 🎯 **Accessibilité** - WCAG 2.1 AA compliant

---

## 🛠️ **Scripts de Développement**

### **Scripts Principaux**
```bash
# 🚀 Développement
npm run dev              # Serveur de développement avec hot-reload
npm run dev:turbo        # Mode turbo pour performances accrues
npm run build            # Build de production optimisé
npm run start            # Serveur de production
npm run lint             # Vérification ESLint + Prettier
npm run lint:fix         # Correction automatique du code
npm run type-check       # Vérification TypeScript
```

### **Scripts Base de Données**
```bash
# 🗄️ Prisma & Base de données
npm run db:generate      # Génération du client Prisma
npm run db:push          # Application du schéma (développement)
npm run db:migrate       # Création de migration (production)
npm run db:seed          # Population avec données de test
npm run db:reset         # Réinitialisation complète
npm run db:studio        # Interface graphique (localhost:5555)
```

### **Scripts Utilitaires**
```bash
# 🧹 Maintenance
npm run clean            # Nettoyage des caches (.next, node_modules)
npm run analyze          # Analyse du bundle de production
npm run test             # Tests unitaires (si configurés)
npm run format           # Formatage du code avec Prettier
```

---

## 🚀 **Guide de Déploiement Production**

### **🌟 Vercel (Recommandé)**

**Avantages :**
- ✅ Déploiement automatique depuis GitHub
- ✅ Edge Functions et CDN global
- ✅ Optimisations Next.js automatiques
- ✅ Domaine HTTPS inclus
- ✅ Analytics et monitoring intégrés

**Étapes :**
1. **Connecter GitHub** à Vercel
2. **Importer le projet** et configurer
3. **Variables d'environnement** dans le dashboard
4. **Déploiement automatique** à chaque push

```bash
# Installation Vercel CLI (optionnel)
npm i -g vercel

# Déploiement depuis le terminal
vercel --prod
```

### **🐳 Docker (Avancé)**

```dockerfile
# Dockerfile exemple
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### **☁️ Autres Plateformes**

| Plateforme | Base de données | Avantages |
|------------|-----------------|-----------|
| **Netlify** | Supabase/PlanetScale | JAMstack, Functions |
| **Railway** | PostgreSQL intégré | Full-stack, simple |
| **DigitalOcean** | MySQL Managed | Contrôle total, prix |
| **AWS Amplify** | RDS MySQL | Écosystème AWS |

---

## 📊 **Bases de Données Production**

### **🌟 PlanetScale (Recommandé)**
- ✅ **MySQL Serverless** - Auto-scaling
- ✅ **Branching** - Git-like pour la DB
- ✅ **Global replicas** - Latence minimale
- ✅ **Prisma compatible** - Migration facile

### **🐘 Supabase**
- ✅ **PostgreSQL** - Open source
- ✅ **Auth intégrée** - Alternative à NextAuth
- ✅ **Real-time** - WebSocket inclus
- ✅ **API REST/GraphQL** - Auto-générée

### **🚂 Railway**
- ✅ **PostgreSQL/MySQL** - Choix flexible
- ✅ **Déploiement simple** - Une commande
- ✅ **Monitoring** - Métriques incluses
- ✅ **Prix transparent** - Pay-as-you-use

---

## 📝 **Guide d'Utilisation Avancé**

### **🏠 Gestion des Propriétés**

#### **Workflow Complet**
1. **Connexion Admin** → Dashboard
2. **Propriétés** → "Ajouter une propriété"
3. **Formulaire 4 étapes** :
   - 📋 Informations générales
   - 📍 Localisation + GPS
   - 🏠 Caractéristiques + équipements
   - 📸 Médias + publication
4. **Validation** → Publication automatique
5. **Gestion** → Modification, désactivation

#### **Fonctionnalités Avancées**
- 🖼️ **Upload multiple** - Glisser-déposer
- 🗺️ **Géolocalisation** - Coordonnées GPS automatiques
- 🎥 **Médias riches** - Photos, vidéos, visite 360°
- 🏷️ **SEO intégré** - URLs optimisées, meta tags
- 📊 **Analytics** - Vues, favoris, contacts

### **💳 Configuration Paiements Stripe**

#### **Mode Test (Développement)**
```bash
# Clés de test Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Cartes de test
4242 4242 4242 4242  # ✅ Succès
4000 0000 0000 0002  # ❌ Échec
4000 0027 6000 3184  # 🔐 3D Secure
```

#### **Webhooks Configuration**
1. **Dashboard Stripe** → Développeurs → Webhooks
2. **URL endpoint** : `https://votredomaine.com/api/stripe/webhook`
3. **Événements** :
   ```
   payment_intent.succeeded
   payment_intent.payment_failed
   checkout.session.completed
   invoice.payment_succeeded
   customer.subscription.updated
   ```

### **🎨 Personnalisation Avancée**

#### **Thème et Couleurs**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          600: '#2563eb',  // Couleur principale
          800: '#1e40af',
        },
        // Personnalisez selon votre marque
      }
    }
  }
}
```

#### **SEO et Métadonnées**
```typescript
// src/lib/seo.ts
export const generateMetadata = (page: string) => ({
  title: `${page} | Agence Immobilière Premium`,
  description: 'Description personnalisée...',
  openGraph: {
    images: ['/logo-og.png'],
  }
})
```

---

## 🔧 **Maintenance et Monitoring**

### **📊 Monitoring Production**
- **Vercel Analytics** - Performance et erreurs
- **Sentry** - Tracking des erreurs détaillé
- **Google Analytics** - Comportement utilisateur
- **Prisma Metrics** - Performance base de données

### **🔄 Mises à jour**
```bash
# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour les dépendances
npm update

# Audit de sécurité
npm audit
npm audit fix
```

### **🚨 Troubleshooting**
| Problème | Diagnostic | Solution |
|----------|------------|----------|
| Build failed | `npm run build` | Vérifier types TypeScript |
| DB connection | `npx prisma studio` | Vérifier DATABASE_URL |
| Auth errors | Logs NextAuth | Vérifier NEXTAUTH_SECRET |
| Stripe webhook | Dashboard Stripe | Vérifier endpoint URL |

---

## 🤝 **Contribution et Développement**

### **Workflow de Contribution**
```bash
# 1. Fork et clone
git clone https://github.com/votre-username/real-estate-app
cd real-estate-app

# 2. Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# 3. Développer avec les bonnes pratiques
npm run dev
npm run lint
npm run type-check

# 4. Commit avec convention
git commit -m "feat: ajouter système de notifications"

# 5. Push et Pull Request
git push origin feature/nouvelle-fonctionnalite
```

### **Standards de Code**
- ✅ **ESLint + Prettier** - Formatage automatique
- ✅ **TypeScript strict** - Typage complet
- ✅ **Conventional Commits** - Messages standardisés
- ✅ **Tests unitaires** - Coverage > 80%
- ✅ **Documentation** - JSDoc pour les fonctions

---

## 📞 **Support et Communauté**

### **🆘 Obtenir de l'Aide**
- 📖 **Documentation** - README et FEATURES.md
- 🐛 **Issues GitHub** - Bugs et demandes de fonctionnalités
- 💬 **Discussions** - Questions générales
- 📧 **Support direct** - contact@agence-immobiliere.fr

---

## 📄 **Licence et Crédits**

**Licence MIT** - Utilisation libre pour projets commerciaux et open-source.

**Technologies utilisées :**
- ⚡ Next.js 14 - Framework React fullstack
- 🎨 Tailwind CSS - Framework CSS utilitaire  
- 🗄️ Prisma - ORM moderne pour bases de données
- 🔐 NextAuth.js - Authentification complète
- 💳 Stripe - Paiements sécurisés
- 🗺️ Leaflet - Cartes interactives open-source

---

<div align="center">

**🏠 Développé avec ❤️ pour révolutionner l'immobilier digital**

[![Next.js](https://img.shields.io/badge/Powered%20by-Next.js-black?logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org)

</div>
