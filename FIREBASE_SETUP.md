# Configuration Firebase - Guide Complet

## ✅ État Actuel
- Firebase Project: `avisflow-75544`
- Authentication: Email/Password + Google ✅
- Firestore Database: ✅
- Firestore Rules: ✅

## 📋 À faire:

### 1. Télécharger la clé de service Firebase Admin

**Étapes:**
1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez le projet `avisflow-75544`
3. Allez dans **Project Settings** (⚙️ en haut)
4. Cliquez sur l'onglet **Service Accounts**
5. Cliquez sur **Generate New Private Key**
6. Un fichier JSON va se télécharger

**Installation:**
1. Renommez le fichier en `firebase-admin-key.json`
2. Placez-le à la racine du projet (même niveau que `package.json`)
3. **⚠️ NE PAS LE COMMITER SUR GIT!** (il est déjà dans .gitignore)

### 2. Configurer Google OAuth

**Pour tester en local (http://localhost:3000):**

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionnez le projet `avisflow-75544`
3. Allez dans **APIs & Services** > **Credentials**
4. Créez une credential **OAuth 2.0 Client ID** (si elle n'existe pas)
   - Type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/google/callback`
     - `https://yourdomain.com/api/auth/google/callback` (pour production)
5. Copiez **Client ID** et **Client Secret**

**Ajoutez les variables dans `.env.local`:**
```
GOOGLE_CLIENT_ID=votre_client_id_ici
GOOGLE_CLIENT_SECRET=votre_client_secret_ici
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 3. Configurer Firebase Authentication

**Pour Email/Password:**
1. Firebase Console > Authentication > Sign-in method
2. Email/Password: ✅ (activé)
3. Google: ✅ (activé)

**Redirigez les utilisateurs après connexion:**
- Login → `/onboarding`
- Signup → `/onboarding`
- Logout → `/auth/login`

### 4. Tester la Configuration

**Test de signup:**
```bash
1. Allez sur http://localhost:3000/auth/signup
2. Entrez email: test@example.com
3. Mot de passe: Test123!
4. Créez le compte
5. Vous devriez être redirigé vers /onboarding
```

**Test de Google OAuth:**
```bash
1. Allez sur http://localhost:3000/auth/login
2. Cliquez "Se connecter avec Google"
3. Acceptez les permissions
4. Vous devriez être redirigé vers /onboarding
```

**Test de Firestore:**
```bash
1. Dans Firebase Console > Firestore
2. Créez une collection `users` manuellement
3. Essayez de créer une entreprise dans l'onboarding
4. Vérifiez que les données s'écrivent dans Firestore
```

### 5. (Optionnel) Ajouter les autres clés

Si vous voulez tester la génération d'IA et Stripe:

**Claude API:**
```
CLAUDE_API_KEY=votre_clé_claude_ici
```
Obtenez-la sur [console.anthropic.com](https://console.anthropic.com)

**Stripe:**
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
Obtenez-les sur [dashboard.stripe.com](https://dashboard.stripe.com)

---

## 🚀 Résumé des étapes rapides:

1. **Téléchargez** firebase-admin-key.json depuis Firebase Console
2. **Placez** le fichier à la racine du projet
3. **Ajoutez** GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans .env.local
4. **Redémarrez** le serveur: `npm run dev`
5. **Testez** signup et Google OAuth

---

## ⚠️ Points importants:

- **Ne jamais commiter** firebase-admin-key.json (fichier .gitignore déjà configuré)
- Les règles Firestore sont **déjà configurées** et sécurisées
- Les utilisateurs ne peuvent lire/modifier que leurs propres données
- Les propriétaires d'entreprise contrôlent les emplacements et avis
- Les quotas mensuels sont appliqués aux générations de réponses

---

## 🔍 Vérification:

Après la configuration, vous devriez voir:
- ✅ Connexion par email/mot de passe fonctionnelle
- ✅ Connexion Google OAuth fonctionnelle
- ✅ Données sauvegardées dans Firestore
- ✅ Navigation fluide: signup → onboarding → dashboard
