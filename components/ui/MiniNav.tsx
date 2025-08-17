'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const navItems = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How It Works' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'races', label: 'Race Finder' },
  { id: 'guarantee', label: 'Guarantee' },
  { id: 'faq', label: 'FAQ' }
]

export default function MiniNav() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    navItems.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(id)
    }
  }

  return (
    <motion.nav
      className="fixed top-8 right-8 z-50 hidden lg:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="bg-[var(--bg-1)]/80 backdrop-blur-md border border-[var(--line)] rounded-xl p-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`relative flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-1)] ${
                  activeSection === item.id
                    ? 'text-[var(--text-1)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
                }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    className="absolute left-0 top-1/2 w-1 h-6 bg-[var(--crimson)] rounded-r-full"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  activeSection === item.id ? 'bg-[var(--crimson)]' : 'bg-[var(--text-3)]'
                }`} />
                <span className="relative">
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--crimson)]"
                      layoutId="underline"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </motion.nav>
  )
}
