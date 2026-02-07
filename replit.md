# Nabs.ai

## Overview
AI-guided human-to-human connection app. Users sign in with Google via Supabase Auth, set their profile (language, gender), and are matched for video conversations based on intent.

## Recent Changes
- 2026-02-07: Initial Replit setup - configured Next.js dev server on port 5000

## Project Architecture
- **Framework**: Next.js 14.2.5 (App Router)
- **Styling**: Tailwind CSS with custom dark theme (nabs-* color palette)
- **Auth/Backend**: Supabase (Google OAuth, database)
- **Language**: TypeScript

### Directory Structure
```
app/                  # Next.js App Router pages
  auth/callback/      # OAuth callback handler
  components/         # Shared components (Menu)
  login/              # Login page (Google OAuth)
  profile/            # Profile setup (language, gender)
  page.tsx            # Main page (chat/video interface)
  layout.tsx          # Root layout
  globals.css         # Global styles + Tailwind
lib/
  supabaseClient.ts   # Supabase client initialization
```

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key

### Development
- Dev server: `npm run dev` (port 5000, host 0.0.0.0)
- Build: `npm run build`
- Start: `npm start`
