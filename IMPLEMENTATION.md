# PHASE 4: Implementation Plan

## Priority Order (MVP Completion)

### TIER 1: Critical Auth & Core Flow (Weeks 1-2)
These must work for any user to use the product.

1. **Firebase Email/Password Auth**
   - Implement sign up in `/app/auth/signup/page.tsx`
   - Implement login in `/app/auth/login/page.tsx`
   - Update `AuthContext` to fetch real Firestore user data
   - Add protected routes middleware

2. **Google OAuth Completion**
   - Fix callback handler to store tokens securely (encrypt in Firestore)
   - Handle token refresh
   - Create business during OAuth if new user
   - Route to onboarding or dashboard based on user state

3. **Onboarding Flow Integration**
   - Wire all 4 onboarding pages to real mutations
   - Validate inputs (business name length, address, etc.)
   - Create default brand voice on completion
   - Error handling and retry logic

4. **Dashboard Auth Wall**
   - Add redirect to login if not authenticated
   - Create protected route wrapper component
   - Show loading state while checking auth

### TIER 2: Review Import & Display (Weeks 2-3)

5. **Cloud Function: syncReviews**
   - Call Google Business API with stored token
   - Parse reviews, extract sentiment (Claude or heuristic)
   - Store in Firestore with proper indexing
   - Handle pagination and rate limiting
   - Implement error tracking and retries

6. **API Endpoint: /api/reviews/sync**
   - Trigger Cloud Function
   - Return job ID for polling status
   - Handle quota checks before calling function

7. **Reviews List Page**
   - Fetch reviews from Firestore
   - Filter by status (pending, replied, archived)
   - Sort by date, rating
   - Real sentiment colors/badges
   - Implement pagination or infinite scroll

8. **Review Detail Page**
   - Fetch single review with details
   - Show author info, rating, full text
   - Display sentiment analysis
   - Handle loading/error states

### TIER 3: AI Reply Generation (Weeks 3-4)

9. **Cloud Function: generateReply**
   - Get brand voice from Firestore
   - Build Claude prompt with examples
   - Call Claude API (Opus 4.1)
   - Store reply with token usage
   - Handle API errors and timeouts

10. **API Endpoint: /api/replies/generate**
    - Verify business membership
    - Check monthly quota
    - Increment usage counter
    - Trigger Cloud Function
    - Return reply with status polling endpoint

11. **Reply Editor Component**
    - Real-time text editing with character count
    - Save drafts to Firestore
    - Show suggestion quality/confidence
    - Preview sentiment analysis

12. **Reply Generation Flow**
    - Click "Generate Reply" on review
    - Show loading skeleton
    - Poll /api/replies/{id} for status
    - Display reply when ready
    - Allow edit before publish

### TIER 4: Publishing & History (Weeks 4-5)

13. **Cloud Function: publishReply**
    - Get Google access token (handle refresh if needed)
    - Call Google Business API to post reply
    - Handle 409 conflicts (already replied)
    - Track response in ResponseHistory
    - Update Review.status = 'replied'

14. **API Endpoint: /api/replies/publish**
    - Verify user can edit reply
    - Check reply status (draft/approved only)
    - Call Cloud Function
    - Return status

15. **Publish Flow & UX**
    - "Approve & Publish" button
    - Confirmation modal
    - Error handling (token expired, API limits)
    - Success message
    - Auto-refresh review list

16. **Response History Page**
    - Fetch published replies
    - Show original review + reply side-by-side
    - Filter by date range
    - Search by customer name
    - Export CSV option (future)

### TIER 5: Settings & Configuration (Weeks 5-6)

17. **Brand Voice Management**
    - `/dashboard/settings/voice`
    - Create custom voices
    - Edit existing voices
    - Set as default
    - Delete (with warning)
    - Template gallery

18. **Location Management**
    - `/dashboard/settings/locations`
    - List all locations
    - Add new location
    - Edit location settings
    - Configure auto-approve thresholds
    - Sync reviews per location

19. **Team Management**
    - `/dashboard/settings/team`
    - Invite users by email
    - Assign roles (owner, admin, agent)
    - Revoke access
    - Email invites with signup link

20. **Billing & Usage**
    - `/dashboard/settings/billing`
    - Display current plan
    - Show monthly usage vs quota
    - Upgrade/downgrade plan via Stripe
    - Usage history graph

### TIER 6: Polish & Deploy (Weeks 6-7)

21. **Error Boundaries & Fallbacks**
    - Global error boundary
    - API error handling standardized
    - User-friendly error messages
    - Retry mechanisms where safe

22. **Loading States**
    - Skeleton screens for lists
    - Placeholder content
    - Toast notifications for actions
    - Progress indicators for long operations

23. **Database Indexing**
    - Add Firestore composite indexes
    - Optimize query performance
    - Set up TTL for old data (if needed)

24. **Security**
    - Firestore rules deployed
    - Sensitive data encryption (Google tokens)
    - CSRF protection on forms
    - Input validation and sanitization
    - Rate limiting on API endpoints

25. **Deployment**
    - Firebase App Hosting config
    - Environment variables set
    - Cloud Functions deployed
    - Firestore rules published
    - Storage rules published
    - Domain configured (if custom)

---

## Key Files by Priority

### Immediate (This Week)
```
lib/firebase/client.ts          - DONE
lib/firebase/admin.ts           - DONE
lib/types/index.ts              - DONE
lib/db/queries.ts               - DONE
lib/db/mutations.ts             - DONE
lib/contexts/AuthContext.tsx    - DONE (needs real user fetch)
app/auth/login/page.tsx         - TODO: Connect to Firebase
app/auth/signup/page.tsx        - TODO: Connect to Firebase
app/onboarding/**               - TODO: Full integration
```

### Next Week
```
functions/src/index.ts          - TODO: Implement syncReviews()
app/api/reviews/sync/route.ts   - TODO: Complete
app/dashboard/reviews/page.tsx  - TODO: Wire to Firestore
app/dashboard/reviews/[id]/page.tsx - TODO: Load real review
```

### Following Week
```
functions/src/index.ts          - TODO: Implement generateReply()
app/api/replies/generate/route.ts - TODO: Complete
components/dashboard/ReplyEditor.tsx - TODO: Create
```

---

## Environment Setup Checklist

Before TIER 1 work:

- [ ] Firebase Admin Key downloaded and stored as `firebase-admin-key.json`
- [ ] Google OAuth credentials obtained (Client ID, Secret)
- [ ] Claude API key obtained
- [ ] Stripe account created (test mode keys)
- [ ] `.env.local` fully populated
- [ ] `npm install` in `/functions` directory
- [ ] Local Firebase emulator tested (optional but recommended)

---

## Testing Strategy

### Unit Tests (Low Priority for MVP)
- Utility functions (validation, formatting)
- Type safety (TypeScript catch most issues)

### Integration Tests (Medium Priority)
- Auth flow end-to-end
- Business creation flow
- Review import → display

### Manual Testing (High Priority for MVP)
- All user flows in dev environment
- Error cases (no token, quota exceeded, API failures)
- Mobile responsiveness
- Cross-browser compatibility

### Performance Metrics
- Initial page load: < 3s
- Dashboard load: < 2s
- Reply generation: < 30s
- Review import: handles 100+ reviews

---

## Known TODOs in Code

Search codebase for `TODO:` comments:

```bash
grep -r "TODO:" --include="*.ts" --include="*.tsx"
```

Current TODOs:
- [ ] Encrypt Google tokens before storing
- [ ] Call actual Google Business API
- [ ] Implement Cloud Functions fully
- [ ] Add real Firestore queries to hooks
- [ ] Create protected route middleware
- [ ] Handle token refresh
- [ ] Add input validation with Zod

---

## Deployment Checklist

### Pre-Launch
- [ ] All TIER 1-4 complete
- [ ] Manual testing of critical flows
- [ ] Firestore security rules deployed
- [ ] Cloud Functions deployed and tested
- [ ] Environment variables set in Firebase
- [ ] Custom domain configured (optional)

### Launch Day
- [ ] Monitor Cloud Functions logs
- [ ] Test on production Firebase
- [ ] Monitor error rates
- [ ] Have rollback plan ready

### Post-Launch
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Plan TIER 5 based on usage patterns
- [ ] Document known limitations

---

## Git Workflow

Each TIER should be a separate branch and PR:

```bash
git checkout -b feat/tier-1-auth
# Work and commit
git push origin feat/tier-1-auth
# Create PR, review, merge

git checkout -b feat/tier-2-reviews
# Continue...
```

Main branch always deployable.

---

## Questions Before Starting

1. **Do you want local Firebase emulator setup?**
   - Faster development cycle
   - Can test without real Firebase project
   - Recommended for team

2. **Should we start with Tier 1 immediately?**
   - Email/password auth
   - Or skip to Google OAuth only?

3. **Claude model preference for reviews?**
   - Opus 4.1 (best, higher cost)
   - Sonnet 4 (fast, cheaper)
   - Haiku (very cheap, lower quality)

4. **Database reset before launch?**
   - Delete all test data
   - Keep some sample reviews for demo?

---

**Ready to start TIER 1? I can begin with Firebase Auth setup.**
