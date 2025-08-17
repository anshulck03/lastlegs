'use client'

import { motion } from 'framer-motion'
import { item } from './motion/variants'
import HoverCard from './ui/HoverCard'
import Container from './ui/Container'
import Section from './ui/Section'

const valueCards = [
  {
    title: "Adaptive Plan Engine",
    description: "Your training plan adjusts weekly based on life constraints, recovery needs, and performance data.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Accountability & Streaks",
    description: "Track compliance with visual progress indicators and maintain motivation through streak tracking.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Race-Week Protocol",
    description: "Comprehensive taper, nutrition guidance, and pre-race checklist to ensure peak performance.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
]

export default function ValueCards() {
  return (
    <Section id="features" className="py-20 lg:py-32">
      <Container>
        <motion.div
          className="text-center mb-16"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <h2 className="mb-6">Why Last Legs Works</h2>
          <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto">
            Three core systems that adapt to your life and keep you on track to the finish line.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={item}
          initial="hidden"
          animate="show"
        >
          {valueCards.map((card, index) => (
            <HoverCard key={index} className="card p-8">
              <motion.div
                className="space-y-6"
                variants={item}
                initial="hidden"
                animate="show"
              >
                {/* Icon */}
                <div className="text-[var(--crimson)]">
                  {card.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[var(--text-1)]">
                    {card.title}
                  </h3>
                  <p className="text-[var(--text-2)] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Learn More Link */}
                <a href="#how" className="link-underline inline-block text-[var(--crimson)] text-sm font-medium">
                  Learn more →
                </a>
              </motion.div>
            </HoverCard>
          ))}
        </motion.div>

        {/* Mockups */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mt-16"
          variants={item}
          initial="hidden"
          animate="show"
        >
          {/* Mockup 1: Adaptive Training Dashboard */}
          <motion.div
            className="card p-6 max-w-sm mx-auto"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[var(--text-3)] uppercase tracking-wide">Adaptive Training Dashboard</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-[var(--text-3)] mb-1">
                    <span>Weekly Mileage</span>
                    <span>47.2 mi</span>
                  </div>
                  <div className="w-full bg-[var(--line)] rounded-full h-2">
                    <motion.div
                      className="bg-[var(--crimson)] h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-[var(--text-3)]">Compliance</div>
                    <div className="text-lg font-bold text-[var(--text-1)]">85%</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[var(--crimson)] rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-[var(--bg-0)]">7</span>
                    </div>
                    <div className="text-xs text-[var(--text-3)]">day streak</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mockup 2: Race Finder Preview */}
          <motion.div
            className="card p-6 max-w-sm mx-auto"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[var(--text-3)] uppercase tracking-wide">Race Finder Preview</h4>
              <div className="space-y-3">
                <div className="bg-[var(--bg-2)] rounded-lg p-3">
                  <div className="text-sm font-medium text-[var(--text-1)]">Ironman 70.3 La Quinta</div>
                  <div className="text-xs text-[var(--text-3)]">La Quinta, CA • Dec 7, 2025</div>
                </div>
                <div className="bg-[var(--bg-2)] rounded-lg p-3">
                  <div className="text-sm font-medium text-[var(--text-1)]">Ironman Arizona</div>
                  <div className="text-xs text-[var(--text-3)]">Tempe, AZ • Nov 23, 2025</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  )
}
