'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { item } from './motion/variants'

const navItems = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How It Works' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#races', label: 'Race Finder' },
  { href: '#guarantee', label: 'Guarantee' },
  { href: '#faq', label: 'FAQ' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--bg-1)]/80 backdrop-blur-md border-b border-[var(--line)]' 
          : 'bg-transparent'
      }`}
      variants={item}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-[1200px] px-6 md:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="text-xl font-bold text-[var(--text-1)]"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Last Legs
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-1)]"
              >
                {item.label}
              </button>
            ))}
            <a
              href="#waitlist"
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault()
                history.replaceState(null, "", window.location.pathname + "?src=nav#waitlist")
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
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-1)] min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-1)] border-t border-[var(--line)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors duration-200 py-3 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-1)] min-h-[44px] flex items-center"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-[var(--line)]">
                <a
                  href="#waitlist"
                  className="btn-primary w-full text-center block py-3 px-5 min-h-[44px] flex items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault()
                    history.replaceState(null, "", window.location.pathname + "?src=nav#waitlist")
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
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
