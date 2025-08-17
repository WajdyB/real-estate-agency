# 🏠 Agence Immobilière Premium

Une application web moderne pour agences immobilières, développée avec Next.js 14, MySQL, et les dernières technologies web. Interface professionnelle et sécurisée.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?logo=mysql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-teal?logo=tailwindcss)

## 🌟 Aperçu

Application fullstack moderne offrant une expérience utilisateur exceptionnelle pour clients et agents immobiliers, avec interface d'administration complète et design moderne.

## ✨ Fonctionnalités Implémentées

### 🏡 **Front-office (Interface Publique)**

#### **Pages Principales**
- 🏠 **Page d'accueil** - Présentation élégante avec recherche rapide et propriétés vedettes
- 🏘️ **Catalogue complet** - Liste des biens avec filtres avancés (type, prix, superficie, localisation, pièces)
- 🔍 **Recherche avancée** - Interface avec carte interactive Leaflet/OpenStreetMap et géolocalisation
- 📋 **Fiche détaillée** - Galerie photos HD, caractéristiques complètes
- 📱 **Blog immobilier** - Articles, actualités, conseils avec système de catégories
- 📞 **Contact multi-canal** - Formulaire de contact
- ℹ️ **À propos** - Présentation de l'équipe, histoire, valeurs
- 🛠️ **Services détaillés** - Achat, vente, investissement, gestion locative
- 📊 **Estimation en ligne** - Outil d'évaluation gratuite

#### **Espace Utilisateur Personnel**
- 🔐 **Authentification complète** - Email/password avec NextAuth.js
- 👤 **Profil personnalisé** - Gestion des informations et préférences
- ❤️ **Favoris avancés** - Sauvegarde et organisation des propriétés préférées

### 🛠️ **Back-office (Administration)**

#### **Tableau de Bord Analytique**
- 📊 **Statistiques temps réel** - Propriétés en ligne, visites, utilisateurs actifs
- 💹 **Métriques financières** - Vue d'ensemble des transactions
- 📈 **Graphiques interactifs** - Évolution des ventes et performance

#### **Gestion Complète des Propriétés**
- ➕ **Ajout guidé** - Formulaire complet avec validation
- 🖼️ **Upload média** - Images HD et gestion des médias
- ✏️ **Édition avancée** - Modification complète, gestion du statut
- 🗺️ **Géolocalisation** - Positionnement GPS précis sur carte
- 🏷️ **Gestion des tags** - Équipements, caractéristiques, mise en vedette

#### **Administration Utilisateurs**
- 👥 **Gestion des rôles** - Admin, Agent, Client avec permissions
- 📝 **Profils détaillés** - Informations complètes et historique d'activité

#### **Suivi Commercial**
- 📅 **Rendez-vous** - Planning et gestion des rendez-vous
- 💬 **Messages clients** - Centre de communication unifié
- 📊 **Rapports détaillés** - Performance et statistiques

#### **Gestion de Contenu**
- ✍️ **Blog management** - Création, édition, publication d'articles
- ⚙️ **Paramètres SEO** - Meta tags et URLs optimisées
- 🏢 **Informations agence** - Coordonnées et services

#### **Gestion du Profil Admin**
- 👤 **Profil personnel** - Gestion des informations personnelles et professionnelles
- 🔐 **Sécurité** - Changement de mot de passe et authentification à deux facteurs
- ⚙️ **Paramètres** - Configuration de l'application

### 🔧 **Fonctionnalités Techniques Implémentées**

#### **Architecture Moderne**
- ⚡ **Next.js 14** - App Router, Server Components, optimisations automatiques
- 🗄️ **Base de données MySQL** - Prisma ORM, migrations, relations complexes
- 🔐 **NextAuth.js** - Authentification sécurisée, sessions, JWT
- 🗺️ **Cartes interactives** - Leaflet, OpenStreetMap, clustering
- 🎨 **Tailwind CSS** - Design system cohérent, responsive
- 📱 **TypeScript** - Sécurité du code, auto-complétion

#### **SEO & Performance**
- 🔍 **SEO optimisé** - Meta tags dynamiques, Schema.org, sitemap.xml
- ⚡ **Performance** - Images optimisées, lazy loading
- 📱 **Responsive** - Design adaptatif mobile-first

## 🚀 Guide d'Installation

### 📋 **Prérequis Système**

Avant de commencer, assurez-vous d'avoir installé :

| Logiciel | Version Minimale | Recommandée |
|----------|------------------|-------------|
| **Node.js** | 18.0+ | 20.0+ LTS |
| **npm** | 9.0+ | 10.0+ |
| **MySQL** | 8.0+ | 8.0+ |
| **Git** | 2.30+ | Latest |

---

### 📁 **1. Cloner et Préparer le Projet**

```bash
# Cloner le repository
git clone <repository-url>
cd real-estate-agency

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
# 🌐 CONFIGURATION APPLICATION
# ===========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### **3.3 Générer une clé NEXTAUTH_SECRET sécurisée**

```bash
# Méthode 1 : OpenSSL (recommandée)
openssl rand -base64 32

# Méthode 2 : Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
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

### 🚀 **5. Lancement de l'Application**

#### **5.1 Démarrage en mode développement**

```bash
# Lancer le serveur de développement
npm run dev

# L'application sera accessible sur :
# 🌐 http://localhost:3000
```

#### **5.2 Vérifications de fonctionnement**

1. **Page d'accueil** : http://localhost:3000
2. **Admin** : http://localhost:3000/admin
3. **Base de données** : http://localhost:5555 (Prisma Studio)

#### **5.3 Comptes de démonstration**

| Rôle | Email | Mot de passe | Accès |
|------|-------|--------------|-------|
| **Admin** | admin@agence-immobiliere.fr | admin123 | Accès complet |
| **Agent** | agent@agence-immobiliere.fr | agent123 | Gestion propriétés |
| **Client** | client@test.fr | client123 | Interface publique |

---

### ✅ **6. Vérification de l'Installation**

#### **6.1 Checklist de vérification**

- [ ] ✅ Page d'accueil charge correctement
- [ ] ✅ Connexion admin fonctionne
- [ ] ✅ Base de données connectée (Prisma Studio accessible)
- [ ] ✅ Propriétés s'affichent dans le catalogue
- [ ] ✅ Formulaires de contact fonctionnent
- [ ] ✅ Recherche et filtres opérationnels
- [ ] ✅ Cartes interactives s'affichent
- [ ] ✅ Design responsive sur mobile

#### **6.2 Tests de fonctionnalités**

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

### 🔧 **7. Dépannage Courant**

#### **Erreurs fréquentes et solutions**

| Erreur | Cause | Solution |
|--------|-------|----------|
| `JWT_SESSION_ERROR` | NEXTAUTH_SECRET manquant | Ajouter une clé secrète dans `.env.local` |
| `PrismaClientInitializationError` | Base de données inaccessible | Vérifier DATABASE_URL et MySQL |
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

## 📁 **Structure du Projet**

```
📦 real-estate-agency/
├── 📁 prisma/                      # Configuration base de données
│   ├── 📄 schema.prisma           # Schéma de la base de données
│   └── 📄 seed.ts                 # Script de données de test
│
├── 📁 public/                      # Ressources statiques
│   ├── 📄 favicon.ico             # Icône du site
│   └── 📄 robots.txt              # Instructions pour robots
│
├── 📁 src/                         # Code source principal
│   ├── 📁 app/                    # Pages Next.js (App Router)
│   │   ├── 📁 admin/              # 🛠️ Interface d'administration
│   │   │   ├── 📄 layout.tsx      # Layout admin avec sidebar
│   │   │   ├── 📄 page.tsx        # Tableau de bord principal
│   │   │   ├── 📁 properties/     # Gestion des propriétés
│   │   │   │   ├── 📄 page.tsx    # Liste des propriétés
│   │   │   │   └── 📁 new/        # Ajout de propriété
│   │   │   │       └── 📄 page.tsx # Formulaire d'ajout
│   │   │   ├── 📁 users/          # Gestion des utilisateurs
│   │   │   ├── 📁 payments/       # Suivi des paiements
│   │   │   ├── 📁 messages/       # Centre de messages
│   │   │   ├── 📁 appointments/   # Gestion des rendez-vous
│   │   │   ├── 📁 blog/           # Gestion du blog
│   │   │   ├── 📁 analytics/      # Statistiques avancées
│   │   │   ├── 📁 profile/        # Gestion du profil admin
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
│   │   │   └── 📁 register/       # Inscription utilisateurs
│   │   │
│   │   ├── 📄 about/page.tsx      # À propos de l'agence
│   │   ├── 📄 contact/page.tsx    # Page de contact
│   │   ├── 📄 services/page.tsx   # Services détaillés
│   │   ├── 📄 estimation/page.tsx # Estimation en ligne
│   │   ├── 📄 search/page.tsx     # Recherche avancée
│   │   ├── 📄 profile/page.tsx    # Profil utilisateur
│   │   ├── 📄 favorites/page.tsx  # Favoris utilisateur
│   │   ├── 📄 privacy/page.tsx    # Politique de confidentialité
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
│   │   │
│   │   ├── 📁 property/           # Composants propriétés
│   │   │   └── 📄 PropertyCard.tsx    # Carte de propriété
│   │   │
│   │   ├── 📁 maps/               # Composants de cartes
│   │   │   └── 📄 PropertyMap.tsx # Carte interactive
│   │   │
│   │   ├── 📁 seo/                # Composants SEO
│   │   │   └── 📄 JsonLd.tsx      # Données structurées
│   │   │
│   │   └── 📁 providers/          # Providers React
│   │       └── 📄 SessionProvider.tsx # Contexte d'authentification
│   │
│   ├── 📁 lib/                    # 🛠️ Utilitaires et configurations
│   │   ├── 📄 auth.ts             # Configuration NextAuth
│   │   ├── 📄 prisma.ts           # Client Prisma
│   │   ├── 📄 stripe.ts           # Configuration Stripe
│   │   ├── 📄 seo.ts              # Utilitaires SEO
│   │   └── 📄 utils.ts            # Fonctions utilitaires
│   │
│   └── 📁 types/                  # 📝 Types TypeScript
│       └── 📄 next-auth.d.ts      # Types NextAuth personnalisés
│
├── 📄 package.json                # Dépendances et scripts
├── 📄 next.config.js              # Configuration Next.js
├── 📄 tailwind.config.ts          # Configuration Tailwind CSS
├── 📄 postcss.config.js           # Configuration PostCSS
├── 📄 tsconfig.json               # Configuration TypeScript
├── 📄 .env.example                # Exemple de variables d'environnement
├── 📄 .gitignore                  # Fichiers ignorés par Git
└── 📄 README.md                   # Documentation du projet
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
- ✅ **Hashage bcrypt** - Mots de passe chiffrés
- ✅ **CSRF Protection** - Tokens anti-falsification

### **Protection des Données**
- ✅ **RGPD Compliant** - Politique de confidentialité détaillée
- ✅ **Validation** - Sanitisation des entrées utilisateur
- ✅ **Headers sécurisés** - HSTS, CSP, X-Frame-Options

### **Contrôle d'Accès**
- 🔐 **Rôles granulaires** : Admin, Agent, Client
- 🔐 **Permissions** : CRUD basé sur les rôles
- 🔐 **Middleware** : Protection des routes sensibles

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
npm run build            # Build de production optimisé
npm run start            # Serveur de production
npm run lint             # Vérification ESLint + Prettier
npm run type-check       # Vérification TypeScript
```

### **Scripts Base de Données**
```bash
# 🗄️ Prisma & Base de données
npm run db:generate      # Génération du client Prisma
npm run db:push          # Application du schéma (développement)
npm run db:seed          # Population avec données de test
npm run db:studio        # Interface graphique (localhost:5555)
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

---

## 📝 **Guide d'Utilisation**

### **🏠 Gestion des Propriétés**

#### **Workflow Complet**
1. **Connexion Admin** → Dashboard
2. **Propriétés** → "Ajouter une propriété"
3. **Formulaire complet** avec validation
4. **Validation** → Publication automatique
5. **Gestion** → Modification, désactivation

#### **Fonctionnalités Disponibles**
- 🖼️ **Upload multiple** - Glisser-déposer
- 🗺️ **Géolocalisation** - Coordonnées GPS automatiques
- 🎥 **Médias riches** - Photos et vidéos
- 🏷️ **SEO intégré** - URLs optimisées, meta tags
- 📊 **Analytics** - Vues et statistiques

### **👤 Gestion du Profil Admin**

#### **Fonctionnalités**
- 📝 **Informations personnelles** - Nom, email, téléphone, adresse
- 💼 **Informations professionnelles** - Poste, département, spécialités
- 🔐 **Sécurité** - Changement de mot de passe, 2FA
- 📸 **Avatar** - Gestion de la photo de profil

---

## 🔧 **Maintenance et Monitoring**

### **📊 Monitoring Production**
- **Vercel Analytics** - Performance et erreurs
- **Prisma Studio** - Interface base de données

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

---

## 🤝 **Contribution et Développement**

### **Workflow de Contribution**
```bash
# 1. Fork et clone
git clone https://github.com/votre-username/real-estate-agency
cd real-estate-agency

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

---

## 📞 **Support et Communauté**

### **🆘 Obtenir de l'Aide**
- 📖 **Documentation** - README et code source
- 🐛 **Issues GitHub** - Bugs et demandes de fonctionnalités
- 💬 **Discussions** - Questions générales

---

## 📄 **Licence et Crédits**

**Licence MIT** - Utilisation libre pour projets commerciaux et open-source.

**Technologies utilisées :**
- ⚡ Next.js 14 - Framework React fullstack
- 🎨 Tailwind CSS - Framework CSS utilitaire  
- 🗄️ Prisma - ORM moderne pour bases de données
- 🔐 NextAuth.js - Authentification complète
- 🗺️ Leaflet - Cartes interactives open-source

---

<div align="center">

**🏠 Développé avec ❤️ pour révolutionner l'immobilier digital**

[![Next.js](https://img.shields.io/badge/Powered%20by-Next.js-black?logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org)

</div>
