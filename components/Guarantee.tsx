'use client'

import { motion } from 'framer-motion'
import { item } from './motion/variants'
import Container from './ui/Container'
import Section from './ui/Section'

const guaranteeFeatures = [
  "Adaptive plan compliance tracker",
  "Coach-grade adjustments when life happens", 
  "Race-week protocol + checklist"
]

export default function Guarantee() {
  return (
    <Section id="guarantee" className="py-20 lg:py-32">
      <Container>
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <div className="card p-8 lg:p-12">
            <div className="space-y-8">
              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-1)]">
                Finish-Line Guarantee
              </h2>

              {/* Main Copy */}
              <p className="text-lg lg:text-xl text-[var(--text-2)] leading-relaxed max-w-3xl mx-auto">
                If you follow your adaptive plan and complete 85%+ of prescribed sessions, we guarantee you&apos;ll reach the start line prepared and finish your race safely and confidently — or we&apos;ll extend full access until your next attempt, free.
              </p>

              {/* Feature Bullets */}
              <div className="space-y-3">
                {guaranteeFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-center space-x-3"
                    variants={item}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="w-5 h-5 bg-[var(--crimson)] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[var(--bg-0)]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[var(--text-2)]">{feature}</span>
                  </motion.div>
                ))}
              </div>




            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
