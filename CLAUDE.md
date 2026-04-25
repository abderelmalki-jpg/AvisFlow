# CLAUDE.md

## Project
ReplyLocal is an AI SaaS for local businesses that automates Google review responses.
It centralizes reviews, generates personalized AI replies matching brand tone, allows human validation, and maintains response history.

## Product principles
- Focus on local business owners and small chains.
- Sell time savings and reputation consistency.
- Keep MVP simple and fast to deploy.
- Human-in-the-loop for sensitive reviews.
- Multi-location support from day one.
- Async processing for AI generation.

## Target users
- Restaurant owners
- Salon and spa owners
- Auto repair shops
- Local retail stores
- Small service businesses
- Agencies managing local clients

## Core value proposition
ReplyLocal helps local businesses respond to every Google review quickly and professionally without spending hours writing responses.

## Tech stack
- Next.js App Router + TypeScript
- Firebase App Hosting
- Firebase Auth
- Firestore
- Firebase Storage
- Cloud Functions for async AI generation
- Stripe
- Tailwind CSS

## Core entities
- User
- Business
- Location
- Review
- GeneratedReply
- ResponseHistory
- BrandVoice
- Subscription
- UsageRecord

## MVP features
- Authentication
- Business setup
- Location management
- Google Business Profile integration
- Review import
- AI reply generation
- Brand tone customization
- Review/edit/approve workflow
- Response history
- Usage dashboard
- Stripe billing

## Architecture rules
- Multi-tenant by business account
- Firestore for metadata and history
- Storage for review images if needed
- Async AI generation for replies
- Quota system by review volume
- Secure API keys for Google integrations

## Coding rules
- Strict TypeScript
- Modular domain logic
- Server actions for mutations
- Optimistic UI where safe
- Enterprise-ready UI

## Firebase rules
- Business-scoped access
- Secure review data
- Usage tracking per business

## UX rules
- Dashboard-first design
- Clear pending review list
- One-click approve or edit
- Simple brand voice setup
