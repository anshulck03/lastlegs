'use client'

import { motion } from 'framer-motion'
import { item } from './motion/variants'
import Container from './ui/Container'
import Section from './ui/Section'
import WaitlistForm from './WaitlistForm'

export default function Waitlist() {
  return (
    <Section id="waitlist" className="py-20 lg:py-32">
      <Container>
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <div className="card p-8 lg:p-12">
            <h2 className="mb-4">Secure your spot in the first wave.</h2>
            <p className="text-lg text-[var(--text-2)] mb-8">
              Race updates + early access. No spam.
            </p>
            <WaitlistForm />
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
