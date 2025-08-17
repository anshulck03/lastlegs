## Last Legs — AI Ironman Coach

Modern web experience for Last Legs, an AI-powered Ironman training coach.
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion. Deployed on Vercel.

Live: https://lastlegs.app (after DNS propagation)

What’s in v0 (now)

Hero + CTA: “Join the first wave” waitlist (Formspree via server proxy)

Race Finder (Phase 1): 6–8 curated Full + 70.3 races, pill status badges (Open / Closed / Waitlist), auto-glide carousel, deep links to official race pages

Dashboard Preview: Tabs (Home / Plan / Progress) with simple state + animated metrics

Sticky header + mini-nav with smooth scroll

Performance & A11y: lazy loading, strong contrast, keyboard nav, focus-visible rings

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

Tech Stack

Framework: Next.js 14+ (App Router)

Lang: TypeScript

Style: Tailwind CSS

Animation: Framer Motion

Forms: Formspree (proxied through Next API route)

Deploy: Vercel

Local Development
Prereqs

Node.js 18+

npm (or pnpm/bun)

Setup
git clone https://github.com/anshulck03/lastlegs.git
cd lastlegs
npm install


Create .env.local in the project root:

# Client submits here; server proxies to Formspree
NEXT_PUBLIC_WAITLIST_PATH=/api/waitlist

# Upstream Formspree endpoint
FORMSPREE_FORM_ENDPOINT=https://formspree.io/f/mkgzaoqj


Run:

npm run dev      # http://localhost:3000
npm run build
npm start        # serve production build locally

Deploy (Vercel)

Connect the GitHub repo to Vercel (Project → Deploy)

Add the same .env vars in Project → Settings → Environment Variables

Set Build Command: npm run build

Each push to main auto-deploys

Project Structure
app/                # App Router pages & API routes
  api/waitlist/     # POST proxy to Formspree
components/         # UI, sections, motion variants
public/             # static assets
tailwind.config.ts  # design tokens & theme

License & Contributing

Proprietary — © Last Legs. All rights reserved.
Private repo; contact the team for contribution access.

Built for athletes who love red-line days. 🏁
