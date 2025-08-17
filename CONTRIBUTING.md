# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **Agence Immobilière Premium** ! Ce guide vous aidera à participer efficacement au développement du projet.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Processus de Développement](#processus-de-développement)
- [Standards de Code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)
- [Signalement de Bugs](#signalement-de-bugs)
- [Demandes de Fonctionnalités](#demandes-de-fonctionnalités)

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](CODE_OF_CONDUCT.md). Nous nous engageons à maintenir un environnement accueillant et inclusif pour tous.

## 🚀 Comment Contribuer

### Types de Contributions Bienvenues

- 🐛 **Correction de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📚 **Amélioration de la documentation**
- 🎨 **Améliorations UI/UX**
- ⚡ **Optimisations de performance**
- 🔒 **Améliorations de sécurité**
- 🧪 **Ajout de tests**

### Avant de Commencer

1. **Vérifiez les issues existantes** pour éviter les doublons
2. **Créez une issue** pour discuter des changements majeurs
3. **Forkez le repository** sur votre compte GitHub
4. **Configurez votre environnement** de développement

## 🔄 Processus de Développement

### 1. Fork et Clone

```bash
# Fork le projet sur GitHub, puis clonez votre fork
git clone https://github.com/votre-username/real-estate-app.git
cd real-estate-app

# Ajoutez le repository original comme remote
git remote add upstream https://github.com/original-owner/real-estate-app.git
```

### 2. Configuration de l'Environnement

```bash
# Installez les dépendances
npm install

# Copiez et configurez les variables d'environnement
cp env.example .env.local

# Configurez la base de données
npx prisma generate
npx prisma db push
npm run db:seed

# Lancez le serveur de développement
npm run dev
```

### 3. Créer une Branche

```bash
# Créez une branche descriptive pour votre fonctionnalité
git checkout -b feature/nom-de-la-fonctionnalite

# Ou pour un bug fix
git checkout -b fix/description-du-bug

# Ou pour la documentation
git checkout -b docs/amelioration-documentation
```

### 4. Développement

- Écrivez du code propre et bien documenté
- Suivez les [standards de code](#standards-de-code)
- Ajoutez des tests si nécessaire
- Testez votre code localement

### 5. Commits

Utilisez des messages de commit conventionnels :

```bash
# Format : type(scope): description

# Types possibles :
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage, points-virgules manquants, etc.
refactor: refactoring du code
test: ajout de tests
chore: maintenance

# Exemples :
git commit -m "feat(auth): ajouter authentification OAuth Google"
git commit -m "fix(properties): corriger l'affichage des images"
git commit -m "docs(readme): mettre à jour le guide d'installation"
```

### 6. Push et Pull Request

```bash
# Poussez votre branche
git push origin feature/nom-de-la-fonctionnalite

# Créez une Pull Request sur GitHub
```

## 📝 Standards de Code

### TypeScript

- **Types stricts** : Utilisez TypeScript de manière stricte
- **Interfaces** : Définissez des interfaces pour les objets complexes
- **Enums** : Utilisez des enums pour les constantes

```typescript
// ✅ Bon
interface Property {
  id: string;
  title: string;
  price: number;
  type: PropertyType;
}

enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA'
}

// ❌ Évitez
const property: any = { ... };
```

### React Components

- **Composants fonctionnels** avec hooks
- **Props typées** avec interfaces
- **Nommage PascalCase** pour les composants

```tsx
// ✅ Bon
interface PropertyCardProps {
  property: Property;
  onFavorite: (id: string) => void;
}

export default function PropertyCard({ property, onFavorite }: PropertyCardProps) {
  // ...
}
```

### Styling

- **Tailwind CSS** pour le styling
- **Classes utilitaires** plutôt que CSS personnalisé
- **Design system** cohérent

```tsx
// ✅ Bon
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
  Cliquez ici
</button>

// ❌ Évitez les styles inline
<button style={{ backgroundColor: '#2563eb' }}>
  Cliquez ici
</button>
```

### Formatage

Le projet utilise **Prettier** et **ESLint** :

```bash
# Vérifier le code
npm run lint

# Corriger automatiquement
npm run lint:fix

# Formater le code
npm run format
```

## 🧪 Tests

### Tests Unitaires

```bash
# Lancer les tests
npm run test

# Tests en mode watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Tests d'Intégration

- Testez les API routes
- Testez les interactions utilisateur
- Testez les intégrations tierces (Stripe, etc.)

### Exemple de Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from '@/components/property/PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Test Property',
    price: 100000,
    type: 'APARTMENT'
  };

  it('should render property information', () => {
    render(<PropertyCard property={mockProperty} onFavorite={jest.fn()} />);
    
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('100 000 €')).toBeInTheDocument();
  });
});
```

## 📚 Documentation

### Code

- **JSDoc** pour les fonctions complexes
- **README** à jour
- **Commentaires** pour la logique complexe

```typescript
/**
 * Calcule le prix au mètre carré d'une propriété
 * @param price - Prix total de la propriété
 * @param surface - Surface en mètres carrés
 * @returns Prix au mètre carré arrondi à 2 décimales
 */
function calculatePricePerSquareMeter(price: number, surface: number): number {
  return Math.round((price / surface) * 100) / 100;
}
```

### API

- Documentez les nouvelles routes API
- Incluez des exemples de requêtes/réponses
- Spécifiez les codes d'erreur

## 🐛 Signalement de Bugs

### Avant de Signaler

1. **Vérifiez** que le bug n'est pas déjà signalé
2. **Reproduisez** le bug de manière consistante
3. **Testez** sur la dernière version

### Template de Bug Report

```markdown
## 🐛 Description du Bug
Description claire et concise du problème.

## 🔄 Étapes pour Reproduire
1. Allez sur '...'
2. Cliquez sur '....'
3. Faites défiler jusqu'à '....'
4. Voir l'erreur

## ✅ Comportement Attendu
Description de ce qui devrait se passer.

## 📱 Environnement
- OS: [ex. macOS 12.0]
- Navigateur: [ex. Chrome 96.0]
- Version Node.js: [ex. 18.0.0]
- Version de l'app: [ex. 1.2.0]

## 📸 Captures d'Écran
Si applicable, ajoutez des captures d'écran.

## ℹ️ Informations Supplémentaires
Tout autre contexte pertinent.
```

## ✨ Demandes de Fonctionnalités

### Template de Feature Request

```markdown
## 🚀 Résumé de la Fonctionnalité
Description concise de la fonctionnalité souhaitée.

## 🎯 Problème à Résoudre
Quel problème cette fonctionnalité résoudrait-elle ?

## 💡 Solution Proposée
Description détaillée de votre solution.

## 🔄 Alternatives Considérées
Autres solutions que vous avez envisagées.

## 📋 Critères d'Acceptation
- [ ] Critère 1
- [ ] Critère 2
- [ ] Critère 3

## 🎨 Maquettes/Wireframes
Si applicable, ajoutez des visuels.
```

## 📞 Questions et Support

- 💬 **Discussions GitHub** pour les questions générales
- 🐛 **Issues** pour les bugs et fonctionnalités
- 📧 **Email** : dev@agence-immobiliere.fr pour le support direct

## 🏆 Reconnaissance

Les contributeurs sont listés dans le [CONTRIBUTORS.md](CONTRIBUTORS.md) et leurs contributions sont valorisées dans les release notes.

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient licenciées sous la [Licence MIT](LICENSE).

---

**Merci de contribuer à rendre l'immobilier digital plus accessible ! 🏠✨**
