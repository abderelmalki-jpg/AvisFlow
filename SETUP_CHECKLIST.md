# ✅ Setup Checklist - Firebase Configuration

## 🎯 Avant de commencer

- [x] Firebase Project créé: `avisflow-75544`
- [x] Authentication activée (Email/Password + Google)
- [x] Firestore Database créée
- [ ] **Firebase Admin Key téléchargée** ← À FAIRE

---

## 📥 ÉTAPE 1: Télécharger Firebase Admin Key

### Instructions:
1. Ouvrez [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez le projet **avisflow-75544**
3. Cliquez sur ⚙️ **Project Settings** (en haut à gauche)
4. Allez à l'onglet **Service Accounts**
5. Cliquez sur **Generate New Private Key** (bouton bleu)
6. Le fichier JSON se télécharge automatiquement

### Installation:
```bash
# Renommez le fichier téléchargé
mv ~/Downloads/avisflow-75544-*.json ./firebase-admin-key.json
```

**✅ Vérification:** Le fichier doit être à la racine du projet
```bash
ls firebase-admin-key.json  # Devrait afficher: firebase-admin-key.json
```

### ⚠️ Sécurité:
- Le fichier est dans `.gitignore` (ne sera pas commité)
- Ne jamais partager ce fichier
- C'est la clé maître du projet!

---

## 🔑 ÉTAPE 2: Configurer Google OAuth

### Option A: Pour tester en local (http://localhost:3000)

1. Ouvrez [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionnez le projet **avisflow-75544**
3. Menu > **APIs & Services** > **Credentials**
4. Cliquez **+ Create Credentials** > **OAuth client ID**
5. Type: **Web application**
6. URI autorisés:
   - `http://localhost:3000`
   - `http://localhost:3000/api/auth/google/callback`
7. Copier **Client ID** et **Client Secret**

### Option B: Pour production (domaine réel)

1. Ajoutez votre domaine dans les URIs:
   - `https://yourdomain.com`
   - `https://yourdomain.com/api/auth/google/callback`

### Ajouter dans `.env.local`:
```bash
GOOGLE_CLIENT_ID=copié_de_google_console
GOOGLE_CLIENT_SECRET=copié_de_google_console
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

**✅ Vérification:**
```bash
grep GOOGLE_CLIENT_ID .env.local  # Devrait afficher la valeur
```

---

## 🧪 ÉTAPE 3: Tester la Configuration

### Test 1: Email/Password
```bash
1. Ouvrez http://localhost:3000/auth/signup
2. Entrez:
   - Email: test@example.com
   - Mot de passe: Test123!
3. Cliquez "Créer un compte"
4. Vérifiez la redirection vers /onboarding
```

**Vérification Firestore:**
1. Firebase Console > Firestore
2. Cherchez la collection `users`
3. Vous devriez voir le document avec votre UID

### Test 2: Google OAuth
```bash
1. Ouvrez http://localhost:3000/auth/login
2. Cliquez "Se connecter avec Google"
3. Acceptez les permissions
4. Vérifiez la redirection vers /onboarding
```

### Test 3: Firestore Writes
```bash
1. Complétez l'onboarding (créez une entreprise)
2. Firebase Console > Firestore > Collections
3. Vous devriez voir:
   - users/{uid}
   - businesses/{businessId}
   - businesses/{businessId}/locations/{locationId}
   - businesses/{businessId}/brandVoices/{voiceId}
```

---

## 📋 Checklist Finale

### Configuration des fichiers:
- [ ] `.env.local` avec toutes les clés Firebase
- [ ] `firebase-admin-key.json` à la racine
- [ ] `.gitignore` contient `firebase-admin-key.json`

### Firebase Console:
- [ ] Authentification Email/Password activée
- [ ] Authentification Google OAuth activée
- [ ] Firestore Database créée (test ou production)
- [ ] Firestore Rules déployées

### Serveur Next.js:
- [ ] Serveur redémarré après les changements .env
- [ ] http://localhost:3000 accessible

### Tests:
- [ ] Signup par email fonctionne
- [ ] Login par Google fonctionne
- [ ] Données apparaissent dans Firestore
- [ ] Onboarding flow complet fonctionne
- [ ] Dashboard affiche les données Firestore

---

## 🚀 Commandes Utiles

### Redémarrer le serveur:
```bash
npm run dev
```

### Tester la configuration Firebase:
```bash
npx ts-node scripts/test-firebase.ts
```

### Voir les logs en temps réel:
```bash
npm run dev  # Les logs apparaissent dans le terminal
```

### Accéder à Firebase Console:
```
https://console.firebase.google.com/project/avisflow-75544
```

---

## ❓ Dépannage

### Erreur: "firebase-admin-key.json not found"
**Solution:** Assurez-vous que le fichier est à la racine (même niveau que `package.json`)

### Erreur: "GOOGLE_CLIENT_ID is required"
**Solution:** Vérifiez que `.env.local` contient les variables Google

### Connexion Google ne fonctionne pas
**Solution:** 
1. Vérifiez l'URI de redirection dans Google Cloud Console
2. Vérifiez que les credentials sont correctes dans `.env.local`
3. Assurez-vous que `http://localhost:3000` est autorisé

### Firestore ne sauvegarde pas les données
**Solution:**
1. Vérifiez que firebase-admin-key.json est présent
2. Vérifiez les logs Firestore dans Firebase Console
3. Vérifiez les Firestore Rules (elles devraient être configurées)

---

## 📞 Besoin d'aide?

Consultez:
- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Guide détaillé
- [Firebase Console](https://console.firebase.google.com) - Pour configurer les credentials
- [Google Cloud Console](https://console.cloud.google.com) - Pour OAuth2
