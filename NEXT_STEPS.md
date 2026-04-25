# Next Immediate Steps

## Right Now (Before Any Code)

1. **Verify Firebase Config**
   ```bash
   # Test that your Firebase project is accessible
   firebase projects:list
   ```

2. **Download Firebase Admin Key**
   - Go to Firebase Console → avisflow-75544
   - Settings (⚙️) → Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-admin-key.json` in project root
   - Add to `.gitignore` (already done ✓)

3. **Get Google OAuth Credentials**
   - Go to Google Cloud Console → avisflow-75544
   - Create OAuth 2.0 Client ID (if not exists)
   - Add these to `.env.local`:
     ```
     GOOGLE_CLIENT_ID=your-client-id
     GOOGLE_CLIENT_SECRET=your-client-secret
     ```

4. **Get Claude API Key**
   - Go to console.anthropic.com
   - Create API key
   - Add to `.env.local`:
     ```
     CLAUDE_API_KEY=your-key
     ```

---

## Code Work (In Priority Order)

### Week 1: Firebase Auth

**Start with TIER 1, Task 1:**

```bash
# 1. Implement Firebase Email/Password Auth
# Edit: app/auth/signup/page.tsx
# - Import createUserWithEmailAndPassword from firebase/auth
# - Wire the form to Firebase
# - Show errors properly
# - Redirect to onboarding on success

# 2. Edit: app/auth/login/page.tsx
# - Import signInWithEmailAndPassword
# - Wire the form
# - Handle "forgot password" (basic link)
# - Redirect to dashboard on success

# 3. Edit: lib/contexts/AuthContext.tsx
# - Add real Firestore user fetch
# - Replace the placeholder user object
# - Cache user data in state
```

**Key functions to use:**
```typescript
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// Usage in signup
await createUserWithEmailAndPassword(auth, email, password);

// Usage in login
await signInWithEmailAndPassword(auth, email, password);
```

### Then: Google OAuth

```bash
# 1. Edit: app/api/auth/google/callback/route.ts
# - Fix the OAuth callback (it's partially done)
# - Store Google tokens securely (encrypt them)
# - Create user if first time
# - Redirect to dashboard or onboarding

# 2. Test the flow:
# - Click "Sign in with Google" on login
# - Confirm it redirects back correctly
# - Check localStorage for tokens
```

### Then: Onboarding Integration

```bash
# Wire all 4 onboarding pages to actually save data
# 1. page.tsx → createBusinessAction
# 2. location/page.tsx → createLocationAction  
# 3. google/page.tsx → saveGoogleTokenAction (already mostly done)
# 4. voice/page.tsx → createBrandVoiceAction
# Each page should validate and show errors
```

---

## Testing the Work

After each section, test in browser:

```bash
# 1. Start dev server
npm run dev

# 2. Test signup
# - Go to http://localhost:3000/auth/signup
# - Create account with real email
# - Check Firebase Console → Authentication

# 3. Test login
# - Go to http://localhost:3000/auth/login
# - Login with that email
# - Should redirect to /onboarding or /dashboard

# 4. Test onboarding
# - Complete all 4 steps
# - Check Firebase Console → Firestore for created docs
```

---

## Important Notes

1. **Never commit Firebase credentials**
   - Only `.env.example` goes in git
   - `.env.local` is git-ignored ✓

2. **Use Next.js "use server" directive**
   - Your server actions already have it
   - Client components import and call them

3. **Error handling**
   - All API routes should return `{ success: false, error: "msg" }`
   - All pages should show error state to user

4. **TypeScript**
   - The types are already defined in `lib/types/index.ts`
   - Use them in your functions for type safety

---

## How Much Code Is Left?

The skeleton is done. You need to:
- ✅ Architecture (done)
- ✅ API routes (skeleton done)
- ✅ Pages (skeleton done)
- ❌ Wire pages to API routes (3-4 hours)
- ❌ Wire API routes to Cloud Functions (2-3 hours)
- ❌ Build Cloud Functions (4-5 hours)
- ❌ Polish & test (ongoing)

**Total estimated for working MVP: 2-3 weeks full-time**

---

## Questions?

Open this file in VS Code and search for "TODO:" to see all incomplete pieces.

Ready to start Week 1 (Firebase Auth)?

I can implement:
1. Signup with email/password
2. Login with email/password  
3. Onboarding flow integration
4. Protected routes

Just say "start auth" and I'll build it.
