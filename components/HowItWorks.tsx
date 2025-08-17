'use client'

import { motion } from 'framer-motion'
import { item } from './motion/variants'
import Container from './ui/Container'
import Section from './ui/Section'

const steps = [
  {
    number: "01",
    title: "Baseline & Goals",
    description: "We assess your current fitness level and set realistic race goals."
  },
  {
    number: "02", 
    title: "Adaptive Weekly Plan",
    description: "Receive a personalized training plan that adapts to your schedule."
  },
  {
    number: "03",
    title: "Real-World Adjustments", 
    description: "Life happens. Your plan adjusts automatically based on missed sessions and performance."
  },
  {
    number: "04",
    title: "Race-Week Protocol",
    description: "Comprehensive taper, nutrition, and checklist for race day success."
  }
]

export default function HowItWorks() {
  return (
    <Section id="how" className="py-20 lg:py-32">
      <Container>
        <motion.div
          className="text-center mb-16"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <h2 className="mb-6">How It Works</h2>
          <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto">
            Four simple steps from your first workout to crossing the finish line.
          </p>
        </motion.div>

        <motion.div
          className="relative"
          variants={item}
          initial="hidden"
          animate="show"
        >
          {/* Timeline Connector */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-[var(--line)] transform -translate-y-1/2" />

          {/* Steps Grid */}
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={item}
                initial="hidden"
                animate="show"
              >
                {/* Timeline Circle */}
                <div className="hidden lg:block absolute top-1/2 left-1/2 w-4 h-4 bg-[var(--bg-2)] border-2 border-[var(--line)] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 transition-colors duration-200 hover:border-[var(--crimson)] hover:bg-[var(--crimson)]/10" />
                
                {/* Step Card */}
                <div className="card p-6 lg:p-8 text-center lg:text-left">
                  <div className="space-y-4">
                    {/* Step Number */}
                    <div className="text-2xl font-bold text-[var(--crimson)]">
                      {step.number}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-[var(--text-1)]">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-[var(--text-2)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
