'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { item } from './motion/variants'
import Container from './ui/Container'
import Section from './ui/Section'

const faqItems = [
  {
    question: "How is the plan actually adapted each week?",
    answer: "Our AI analyzes your completed workouts, recovery metrics, and life schedule to automatically adjust your upcoming week's training load, intensity, and session timing. If you miss a session or feel fatigued, the plan intelligently redistributes the workload."
  },
  {
    question: "Can I keep lifting while training?",
    answer: "Absolutely. We integrate strength training into your plan with appropriate volume and intensity adjustments. The AI ensures your lifting doesn't interfere with key endurance sessions and helps maintain the strength you need for the bike and run."
  },
  {
    question: "What happens if I miss a week?",
    answer: "The plan automatically recalculates your training progression. We don't try to 'catch up' by cramming missed sessions—instead, we adjust your remaining weeks to ensure you still reach race day prepared and healthy."
  },
  {
    question: "How do you track compliance?",
    answer: "We integrate with your fitness devices and apps (Garmin, Strava, Apple Health, etc.) to automatically track completed sessions. You can also manually log workouts, and our system learns from your patterns to improve future recommendations."
  },
  {
    question: "What devices/apps do you integrate with?",
    answer: "We connect with Garmin, Strava, Apple Health, Google Fit, Fitbit, and most major fitness platforms. The more data sources we can access, the better we can adapt your training plan to your actual performance and recovery patterns."
  },
  {
    question: "What if my race changes date?",
    answer: "Simply update your race date in the app, and we'll automatically recalculate your entire training plan. The AI will adjust your progression to ensure you peak at the right time, whether your race is moved up or pushed back."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)')
    setIsMobile(mobileQuery.matches)
    
    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mobileQuery.addEventListener('change', handleMobileChange)
    
    return () => mobileQuery.removeEventListener('change', handleMobileChange)
  }, [])

  const toggleFAQ = (index: number) => {
    if (isMobile) {
      // On mobile, only allow one panel open at a time
      setOpenIndex(openIndex === index ? null : index)
    } else {
      // On desktop, allow multiple panels open
      setOpenIndex(openIndex === index ? null : index)
    }
  }

  return (
    <Section id="faq" className="py-20 lg:py-32">
      <Container>
        <motion.div
          className="text-center mb-16"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <h2 className="mb-6">Frequently Asked Questions</h2>
          <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto">
            Everything you need to know about training with Last Legs.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto space-y-4"
          variants={item}
          initial="hidden"
          animate="show"
        >
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              className="card"
              variants={item}
              initial="hidden"
              animate="show"
            >
                              <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-2)] min-h-[44px] flex items-center"
                  aria-expanded={openIndex === index}
                >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--text-1)] pr-4">
                    {faq.question}
                  </h3>
                  <motion.svg
                    className="w-5 h-5 text-[var(--text-3)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: openIndex === index ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-[var(--text-2)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  )
}
