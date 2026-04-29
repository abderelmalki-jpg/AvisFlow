# 🔑 Comment obtenir firebase-admin-key.json en 5 minutes

## 🚀 Étapes SIMPLES:

### 1️⃣ Ouvrez Firebase Console
```
Allez à: https://console.firebase.google.com
```

### 2️⃣ Sélectionnez le projet
```
Cliquez sur "avisflow-75544" dans la liste
```

### 3️⃣ Allez à Project Settings
```
En haut à GAUCHE, cliquez sur l'icône ⚙️ (engrenage)
Puis cliquez sur "Project Settings"
```

### 4️⃣ Allez à Service Accounts
```
Dans le menu, cliquez sur l'onglet "Service Accounts"
```

### 5️⃣ Générez une nouvelle clé
```
Vous voyez un bouton bleu "Generate New Private Key"
Cliquez dessus!
```

### 6️⃣ Téléchargez le fichier
```
Un fichier JSON se télécharge (par exemple: avisflow-75544-xxxxx.json)
```

### 7️⃣ Renommez et placez le fichier
```bash
# Ouvrez votre terminal dans le dossier du projet
# Puis:
mv ~/Downloads/avisflow-75544-*.json ./firebase-admin-key.json

# Vérifiez que ça a marché:
ls firebase-admin-key.json
```

### 8️⃣ Redémarrez le serveur
```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez:
npm run dev
```

---

## ✅ C'est tout!

Après ces étapes:
- ✅ L'authentification par email fonctionnera
- ✅ Google OAuth fonctionnera
- ✅ Firestore sauvegarda les données
- ✅ Vous verrez les données dans Firebase Console

---

## 🎯 Vérification finale

Après avoir placé le fichier, testez:

1. **Allez sur:** http://localhost:3000/auth/signup
2. **Créez un compte:**
   - Email: test@example.com
   - Mot de passe: Test123!
3. **Complétez l'onboarding**
4. **Vérifiez dans Firebase Console:**
   - Firestore > Collections
   - Vous devriez voir votre `users`, `businesses`, etc.

---

## ⚠️ IMPORTANT

- **Ne jamais partager** ce fichier (c'est la clé maître!)
- **Ne jamais le commiter** (il est dans .gitignore)
- **À garder secret** comme un mot de passe

---

## 🆘 Si ça ne marche pas

1. Vérifiez que le fichier est bien nommé `firebase-admin-key.json`
2. Vérifiez que le fichier est à la racine du projet (même niveau que `package.json`)
3. Redémarrez le serveur
4. Regardez les logs du serveur pour les messages d'erreur

---

## 📸 Où cliquer (images)

```
Firebase Console
    ↓
⚙️ Project Settings (en haut à gauche)
    ↓
Service Accounts (dans le menu)
    ↓
[Generate New Private Key] (bouton bleu)
    ↓
Fichier JSON téléchargé
    ↓
Renommez-le en: firebase-admin-key.json
    ↓
Placez-le à la racine du projet
    ↓
npm run dev
    ↓
C'est fait! ✅
```

---

## 💡 Alternative: Tester rapidement sans la clé

Pour tester l'interface avant d'obtenir la clé:
1. L'authentification par email ne fonctionnera pas
2. Google OAuth ne fonctionnera pas
3. Mais vous pouvez voir l'interface entière

Dès que vous avez la clé:
- L'authentification fonctionnera complètement
- Les données seront sauvegardées dans Firestore
