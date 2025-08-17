## 📝 Description

<!-- Décrivez vos changements en détail -->

## 🔗 Issue Liée

<!-- Liez cette PR à une issue existante -->
Fixes #(issue_number)

## 🎯 Type de Changement

<!-- Cochez la case appropriée -->
- [ ] 🐛 Bug fix (changement non-breaking qui corrige un problème)
- [ ] ✨ Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] 💥 Breaking change (correction ou fonctionnalité qui causerait un dysfonctionnement des fonctionnalités existantes)
- [ ] 📚 Documentation uniquement
- [ ] 🔧 Maintenance/Refactoring
- [ ] ⚡ Amélioration de performance
- [ ] 🎨 Amélioration UI/UX
- [ ] 🔒 Correctif de sécurité

## 🧪 Tests

<!-- Décrivez les tests que vous avez effectués -->

### Tests Effectués
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests manuels
- [ ] Tests sur mobile
- [ ] Tests de régression

### Environnements Testés
- [ ] 💻 Desktop (Chrome, Firefox, Safari)
- [ ] 📱 Mobile (iOS Safari, Android Chrome)
- [ ] 🖥️ Développement local
- [ ] 🌐 Environnement de staging

## 📋 Checklist

### Code Quality
- [ ] Mon code suit les conventions de style du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai commenté mon code, particulièrement dans les zones difficiles à comprendre
- [ ] J'ai fait les changements correspondants dans la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction est efficace ou que ma fonctionnalité fonctionne
- [ ] Les tests unitaires nouveaux et existants passent localement avec mes changements

### Sécurité
- [ ] J'ai vérifié qu'aucune information sensible n'est exposée
- [ ] J'ai validé toutes les entrées utilisateur
- [ ] J'ai suivi les bonnes pratiques de sécurité
- [ ] J'ai testé les autorisations et l'authentification si applicable

### Performance
- [ ] J'ai vérifié l'impact sur les performances
- [ ] J'ai optimisé les requêtes base de données si nécessaire
- [ ] J'ai vérifié que les images sont optimisées
- [ ] J'ai testé sur des connexions lentes

## 🖼️ Captures d'Écran

<!-- Ajoutez des captures d'écran si vos changements incluent des modifications UI -->

### Avant
<!-- Capture d'écran avant les changements -->

### Après  
<!-- Capture d'écran après les changements -->

## 📱 Mobile

<!-- Si applicable, ajoutez des captures d'écran mobile -->

| iOS | Android |
|-----|---------|
| <!-- Screenshot --> | <!-- Screenshot --> |

## 🔄 Changements de Base de Données

<!-- Si vos changements incluent des modifications de base de données -->
- [ ] Aucun changement de base de données
- [ ] Migration ajoutée
- [ ] Script de seed mis à jour
- [ ] Schéma Prisma modifié

### Commandes de Migration
```bash
# Si applicable, listez les commandes nécessaires
npx prisma db push
npm run db:seed
```

## 📊 Impact sur les Performances

<!-- Décrivez l'impact sur les performances -->
- [ ] Aucun impact
- [ ] Amélioration des performances
- [ ] Impact négligeable
- [ ] Impact significatif (détaillez ci-dessous)

### Métriques
<!-- Si applicable -->
- Bundle size: +/- X KB
- Lighthouse score: XX/100
- Load time: X.X seconds

## 🌐 Compatibilité Navigateurs

<!-- Cochez les navigateurs testés -->
- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Safari (dernière version)
- [ ] Edge (dernière version)
- [ ] Mobile Safari
- [ ] Mobile Chrome

## 📚 Documentation

<!-- Cochez si applicable -->
- [ ] README.md mis à jour
- [ ] Documentation API mise à jour
- [ ] Commentaires de code ajoutés
- [ ] CHANGELOG.md mis à jour
- [ ] Storybook mis à jour (si applicable)

## 🔗 Liens Utiles

<!-- Ajoutez des liens vers la documentation, designs, etc. -->
- Design: [Lien Figma/Sketch]
- Documentation: [Lien vers la doc]
- Issue liée: #XXX

## ⚠️ Notes Importantes

<!-- Informations importantes pour les reviewers -->

### Breaking Changes
<!-- Si applicable, détaillez les breaking changes -->

### Configuration Requise
<!-- Si des changements de configuration sont nécessaires -->

### Déploiement
<!-- Instructions spéciales pour le déploiement -->

## 👥 Reviewers Suggérés

<!-- Mentionnez les personnes qui devraient review cette PR -->
@username1 @username2

## 🎉 Remerciements

<!-- Remerciez les personnes qui ont contribué -->

---

**Merci pour votre contribution ! 🙏**

<!-- 
Instructions pour les reviewers :
1. Vérifiez que tous les éléments de la checklist sont cochés
2. Testez les changements localement
3. Vérifiez la qualité du code
4. Validez les tests
5. Approuvez ou demandez des changements
-->
