# Last Legs — AI Ironman Coach Landing Page

A production-grade landing page for "Last Legs", an AI-powered Ironman training coach. Built with Next.js 14+, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Design Philosophy

- **Photon-inspired**: Premium, dark, minimal aesthetic with soft motion
- **Elite athletic club**: Black/gray/white base with subtle violet/blue accents
- **Authentic**: No testimonials, partner logos, or vanity counters
- **Performance-first**: Optimized for speed, accessibility, and responsive behavior

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Inline SVGs (monochrome line style)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lastlegs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles and theme tokens
├── components/
│   ├── ui/                 # Reusable UI primitives
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   ├── HoverCard.tsx
│   │   └── GridOverlay.tsx
│   ├── motion/             # Framer Motion variants
│   │   └── variants.ts
│   ├── Header.tsx          # Navigation header
│   ├── Hero.tsx            # Hero section with CTA
│   ├── ValueCards.tsx      # Feature cards
│   ├── HowItWorks.tsx      # 4-step timeline
│   ├── DashboardPreview.tsx # Interactive dashboard mockup
│   ├── RaceFinder.tsx      # Horizontal race carousel
│   ├── Guarantee.tsx       # Finish-line guarantee
│   ├── FAQ.tsx             # Accordion FAQ
│   └── Footer.tsx          # Site footer
├── public/
│   └── favicon.svg         # Brand favicon
└── Configuration files...
```

## 🎨 Design System

### Color Palette

```css
--bg-0: #000000    /* Page background */
--bg-1: #0B0B0B    /* Section panels */
--bg-2: #121212    /* Cards/surfaces */
--line: #1E1E1E    /* Hairline borders/grid */
--text-1: #FFFFFF  /* Headings */
--text-2: #D1D1D1  /* Body text */
--text-3: #A0A0A0  /* Meta text */
--acc-violet: #7A3FFF  /* Primary CTA */
--acc-blue: #00E5FF    /* Micro highlights/focus */
```

### Typography

- **Display/H1**: `clamp(48px, 7vw, 72px)` - Font weight 800
- **H2**: `clamp(28px, 4vw, 42px)` - Font weight 700
- **Body**: 16-18px (never below 16px)
- **Meta/overline**: 12-13px uppercase with letter-spacing

### Motion

- **Easing**: `[0.22, 0.61, 0.36, 1]` (cubic-bezier)
- **Stagger**: 0.10-0.12s between items
- **Duration**: 0.6-0.7s for main animations
- **Reduced motion**: Respects `prefers-reduced-motion`

## ♿ Accessibility

- Minimum contrast ratio: 4.5:1
- Body text: ≥16px
- Focus-visible rings using `--acc-blue`
- Keyboard navigation support
- Screen reader friendly
- ARIA labels and roles

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Flexible grid systems
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎯 Key Features

### Hero Section
- Staggered animations
- Device mockup with interactive elements
- Background grid overlay with subtle motion

### Value Cards
- Three core feature cards
- Hover effects with lift and glow
- Inline SVG icons

### How It Works
- 4-step horizontal timeline
- Interactive circle markers
- Responsive stacking on mobile

### Dashboard Preview
- Tabbed interface (Home, Plan, Progress)
- Animated progress indicators
- Compliance tracking visualization

### Race Finder
- Horizontal scrollable carousel
- Edge gradient masks
- Snap scrolling behavior

### Finish-Line Guarantee
- Exact copy as specified
- Feature bullet points
- Legal disclaimer

### FAQ
- Accordion functionality
- Keyboard accessible
- Smooth expand/collapse animations

## 🔧 Customization

### Theme Colors
Modify CSS variables in `app/globals.css`:

```css
:root {
  --acc-violet: #7A3FFF;  /* Primary brand color */
  --acc-blue: #00E5FF;    /* Secondary accent */
  /* ... other colors */
}
```

### Content
Update content in respective component files:
- Hero copy: `components/Hero.tsx`
- Feature descriptions: `components/ValueCards.tsx`
- FAQ items: `components/FAQ.tsx`
- Race data: `components/RaceFinder.tsx`

### Animations
Modify motion variants in `components/motion/variants.ts`

## 📊 Performance

- Lighthouse optimized
- Lazy loading for heavy assets
- Optimized bundle size
- Efficient animations
- Minimal layout shifts

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Deploy automatically on push to main branch

### Other Platforms
```bash
npm run build
# Deploy the .next folder to your hosting platform
```

## 📄 License

This project is proprietary to Last Legs. All rights reserved.

## 🤝 Contributing

This is a private project. Please contact the development team for contribution guidelines.

---

Built with ❤️ for Ironman athletes everywhere.
