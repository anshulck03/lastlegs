'use client'

import { motion } from 'framer-motion'
import { item } from './motion/variants'
import Container from './ui/Container'

const footerLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How It Works' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#races', label: 'Race Finder' },
  { href: '#guarantee', label: 'Guarantee' },
  { href: '#faq', label: 'FAQ' }
]

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-1)]">
      <Container>
        <div className="py-12 lg:py-16">
          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center"
            variants={item}
            initial="hidden"
            animate="show"
          >
            {/* Left Column */}
            <div className="space-y-4">
              <div className="text-xl font-bold text-[var(--text-1)]">
                Last Legs
              </div>
              <p className="text-[var(--text-2)] max-w-md">
                Your AI-powered Ironman coach. Adaptive plans, accountability, and race-day readiness.
              </p>
            </div>

            {/* Right Column */}
            <div className="flex flex-wrap gap-6 justify-start md:justify-end">
              {footerLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-1)]"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Bottom Border */}
          <motion.div
            className="mt-8 pt-8 border-t border-[var(--line)]"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-[var(--text-3)]">
                © 2025 Last Legs. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-[var(--text-3)] hover:text-[var(--crimson)] transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-[var(--text-3)] hover:text-[var(--crimson)] transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </footer>
  )
}
