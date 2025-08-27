## Last Legs — AI Ironman Coach

Modern web experience for Last Legs, an AI-powered Ironman training coach.
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Prisma + PostgreSQL.

Live: https://lastlegs.app (after DNS propagation)

## What's in v0 - AI Coach (Hybrid)

**Landing Page:**
- Hero + CTA: "Join the first wave" waitlist (Formspree via server proxy)
- Race Finder (Phase 1): 6–8 curated Full + 70.3 races, pill status badges (Open / Closed / Waitlist), auto-glide carousel, deep links to official race pages
- Dashboard Preview: Tabs (Home / Plan / Progress) with simple state + animated metrics
- Sticky header + mini-nav with smooth scroll
- Performance & A11y: lazy loading, strong contrast, keyboard nav, focus-visible rings

**AI Coach v0 Features:**
- **Deterministic Plan Generation**: Rules-based triathlon training plans for HALF (70.3) and FULL (140.6) distances
- **AI Coaching Insights**: OpenRouter-powered analytical coaching text for plan overviews, weekly explanations, and constraint adaptations
- **Onboarding Wizard**: Complete profile setup including strength priority and training preferences
- **Smart Training Dashboard**: This Week and Full Plan views with AI-generated coaching insights
- **Phase-Based Training**: BASE → BUILD → PEAK → TAPER progression with compression for short runways
- **Strength Integration**: Configurable strength priority with interference management
- **Facility Adaptation**: Automatic workout adjustments based on available facilities (pool, gym, trainer, treadmill)
- **Age Adjustments**: Volume scaling for 35-44 (-5%) and 45+ (-10%) age groups
- **Short Runway Support**: Compressed training for races with <16 weeks preparation

Coming Soon (what to expect)
Phase 1.5 — Polish

Success/thank-you route after join

Inline email validation + friendlier error states

Carousel accessibility & mobile tweaks

Copy pass across Hero/FAQ/Guarantee

Phase 2 — Waitlist “Waves”

Tokenized wave invites (limited cohorts)

Auto-confirm email + “Manage preferences” link

Segmented emails (race picks, experience level)

Lightweight admin CSV export

Phase 3 — App Foundations (MVP)

Auth (passwordless email)

Profile: goal race, target finish, training availability

Basic plan preview + weekly blocks

Progress logging (RPE, distance, time)

Phase 4 — Adaptive Coaching

Dynamic plan adjustments from compliance

Device sync (Strava/Garmin) and alerts

Race-week taper and checklist

Billing (Stripe) for Pro tiers

## Tech Stack

**Framework:** Next.js 14+ (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS  
**Animation:** Framer Motion  
**Database:** Prisma + PostgreSQL  
**AI:** OpenRouter (deepseek-chat-v3)  
**Icons:** Lucide React  
**Forms:** Formspree (proxied through Next API route)  
**Deploy:** Vercel

## Local Development

### Prerequisites

- Node.js 18+
- npm (or pnpm/bun)
- PostgreSQL database (local or hosted)

### Setup

```bash
git clone https://github.com/anshulck03/lastlegs.git
cd lastlegs
npm install
```

### Environment Configuration

Create `.env.local` in the project root:

```bash
# Development Mode
NO_AUTH_DEV_MODE=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/lastlegs?sslmode=disable
DIRECT_URL=postgresql://postgres:postgres@127.0.0.1:5433/lastlegs?sslmode=disable

# Waitlist (existing)
NEXT_PUBLIC_WAITLIST_PATH=/api/waitlist
FORMSPREE_FORM_ENDPOINT=https://formspree.io/f/mkgzaoqj

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek-chat-v3
OPENROUTER_HTTP_REFERER=http://localhost:3000
OPENROUTER_TITLE="Last Legs AI Coach"
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with triathlon races
npm run db:seed
```

### Run Development Server

```bash
npm run dev      # http://localhost:3000
npm run build    # build for production
npm start        # serve production build locally
npm run db:studio # view database with Prisma Studio
```

Deploy (Vercel)

Connect the GitHub repo to Vercel (Project → Deploy)

Add the same .env vars in Project → Settings → Environment Variables

Set Build Command: npm run build

Each push to main auto-deploys

## Project Structure

```
app/                    # App Router pages & API routes
  api/
    coach/              # AI coaching insights API
    plan/               # Training plan generation API
    profile/            # User profile management
    race-selection/     # Race selection API
    races/              # Race data API
    waitlist/           # Waitlist submission
    onboarding/         # Onboarding completion
  app/                  # Main dashboard page
  onboarding/           # Onboarding wizard
components/
  app/                  # Dashboard components
  onboarding/           # Onboarding flow components
  ui/                   # Reusable UI components
lib/
  ai/                   # OpenRouter client & caching
  plan/                 # Plan generation & types
  auth.ts               # Dev authentication
  prisma.ts             # Database client
  telemetry.ts          # Event logging
prisma/
  schema.prisma         # Database schema
  seed.ts               # Race data seeding
types/                  # TypeScript definitions
```

License & Contributing

Proprietary — © Last Legs. All rights reserved.
Private repo; contact the team for contribution access.

Built for athletes who love red-line days. 🏁
