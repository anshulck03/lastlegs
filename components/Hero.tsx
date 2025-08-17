'use client'

import { motion } from 'framer-motion'
import { item, scaleIn } from './motion/variants'
import Container from './ui/Container'
import PixelEmitter from './ui/PixelEmitter'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Pixel Emitter */}
      <PixelEmitter count={10} color="crimson" />

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8"
            variants={item}
            initial="hidden"
            animate="show"
          >
            {/* Overline */}
            <motion.div
              className="overline"
              variants={item}
              initial="hidden"
              animate="show"
            >
              IRONMAN TRAINING — AI COACH
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="display"
              variants={item}
              initial="hidden"
              animate="show"
            >
              From First Step to Finish Line.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg text-[var(--text-2)] max-w-[640px]"
              variants={item}
              initial="hidden"
              animate="show"
            >
              Your AI-powered Ironman coach. Adaptive plans, accountability, and race-day readiness.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 relative"
              variants={item}
              initial="hidden"
              animate="show"
            >
              <PixelEmitter count={6} color="crimson" className="absolute inset-0" />
              <a 
                href="#waitlist" 
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault()
                  history.replaceState(null, "", window.location.pathname + "?src=hero#waitlist")
                  const element = document.querySelector('#waitlist')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                    setTimeout(() => {
                      const emailInput = document.querySelector('#email') as HTMLInputElement
                      if (emailInput) {
                        emailInput.focus()
                      }
                    }, 1000)
                  }
                }}
              >
                Join the First Wave
              </a>
              <a href="#features" className="btn-secondary">
                Explore Features
              </a>
            </motion.div>
          </motion.div>

          {/* Device Mockup */}
          <motion.div
            className="relative"
            variants={scaleIn}
            initial="hidden"
            animate="show"
          >
            <PixelEmitter count={8} color="crimson" className="absolute inset-0" />
            {/* Progress Arc Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-80 h-80 transform -rotate-90 opacity-20">
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="var(--line)"
                  strokeWidth="2"
                  fill="none"
                />
                <motion.circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="var(--crimson)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="879.6"
                  strokeDashoffset="879.6"
                  initial={{ strokeDashoffset: 879.6 }}
                  animate={{ strokeDashoffset: 175.9 }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </svg>
            </div>
            <div className="card p-6 lg:p-8 max-w-sm mx-auto relative z-10">
              {/* Device Frame */}
              <div className="bg-[var(--bg-2)] rounded-xl p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-xs text-[var(--text-3)]">Last Legs</div>
                </div>

                {/* Weekly Mileage */}
                <div className="space-y-2">
                  <div className="text-xs text-[var(--text-3)]">This Week</div>
                  <div className="text-2xl font-bold text-[var(--text-1)]">47.2 mi</div>
                  <div className="w-full bg-[var(--line)] rounded-full h-2">
                    <div className="bg-[var(--crimson)] h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                {/* Swim/Bike/Run Split */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--text-1)]">1.2</div>
                    <div className="text-xs text-[var(--text-3)]">Swim</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--text-1)]">32.1</div>
                    <div className="text-xs text-[var(--text-3)]">Bike</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[var(--text-1)]">13.9</div>
                    <div className="text-xs text-[var(--text-3)]">Run</div>
                  </div>
                </div>

                {/* Compliance & Streak */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[var(--text-3)]">Compliance</div>
                    <div className="text-lg font-bold text-[var(--text-1)]">85%</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[var(--crimson)] rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-[var(--bg-0)]">7</span>
                    </div>
                    <div className="text-xs text-[var(--text-3)]">day streak</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
