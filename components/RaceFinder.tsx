'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'
import { item } from './motion/variants'
import Container from './ui/Container'
import Section from './ui/Section'

type RaceStatus = "Open" | "Closed" | "Waitlist" | "Sold Out" | "Registration Soon" | "Unknown";

type Race = {
  name: string;
  dateISO: string;
  dateText: string;
  location: string;
  distance: "Full" | "70.3";
  url: string;
  status: RaceStatus;
};

type ApiResponse = {
  fallback: boolean;
  count: number;
  items: Race[];
};

export default function RaceFinder() {
  const [races, setRaces] = useState<Race[]>([])
  const [isFallback, setIsFallback] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<number>()
  const isPausedRef = useRef(false)

  // Check for reduced motion and mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 768px)')
    
    setPrefersReducedMotion(mediaQuery.matches)
    setIsMobile(mobileQuery.matches)
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    
    mediaQuery.addEventListener('change', handleMotionChange)
    mobileQuery.addEventListener('change', handleMobileChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
      mobileQuery.removeEventListener('change', handleMobileChange)
    }
  }, [])

  // Fetch races on mount
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch('/api/races')
        const data: ApiResponse = await response.json()
        
        setRaces(data.items)
        setIsFallback(data.fallback)
      } catch (error) {
        console.error('Error fetching races:', error)
        setIsFallback(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRaces()
  }, [])

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (!scrollContainerRef.current || isPausedRef.current) return

    const scroll = () => {
      if (!scrollContainerRef.current || isPausedRef.current) return
      
      const container = scrollContainerRef.current
      const maxScroll = container.scrollWidth - container.clientWidth
      
      // If we've reached the end, reset to beginning
      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0
      } else {
        container.scrollLeft += 0.5 // ~0.5px per frame (0.4-0.6px range)
      }
      
      autoScrollRef.current = requestAnimationFrame(scroll)
    }
    
    autoScrollRef.current = requestAnimationFrame(scroll)
  }, [])

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current)
      autoScrollRef.current = undefined
    }
  }, [])

  const pauseAutoScroll = useCallback(() => {
    isPausedRef.current = true
    stopAutoScroll()
  }, [stopAutoScroll])

  const resumeAutoScroll = useCallback(() => {
    isPausedRef.current = false
    setTimeout(() => {
      if (!isPausedRef.current) {
        startAutoScroll()
      }
    }, 3000) // Resume after 3s idle
  }, [startAutoScroll])

  // Auto-scroll lifecycle
  useEffect(() => {
    if (races.length === 0) return

    const container = scrollContainerRef.current
    if (!container) return

    // Check for reduced motion preference
    if (prefersReducedMotion) return

    // Start auto-scroll
    startAutoScroll()

    // Pause on hover/focus
    const handleMouseEnter = () => pauseAutoScroll()
    const handleMouseLeave = () => resumeAutoScroll()
    const handleFocusIn = () => pauseAutoScroll()
    const handleFocusOut = () => resumeAutoScroll()

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('focusin', handleFocusIn)
    container.addEventListener('focusout', handleFocusOut)

    // Pause on manual scroll/drag
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      pauseAutoScroll()
      
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      
      // Resume auto-scroll after user stops scrolling
      scrollTimeout = setTimeout(() => {
        resumeAutoScroll()
      }, 3000) // Resume 3s after user stops scrolling
    }
    container.addEventListener('scroll', handleScroll)

    // Pause on pointer down (drag)
    const handlePointerDown = () => pauseAutoScroll()
    container.addEventListener('pointerdown', handlePointerDown)

    // Pause when page is not visible
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        pauseAutoScroll()
      } else {
        resumeAutoScroll()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopAutoScroll()
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('focusin', handleFocusIn)
      container.removeEventListener('focusout', handleFocusOut)
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [races, startAutoScroll, stopAutoScroll, pauseAutoScroll, resumeAutoScroll, prefersReducedMotion])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = 280 + 24 // card width + gap

    if (e.key === 'ArrowLeft') {
      container.scrollLeft -= cardWidth
    } else if (e.key === 'ArrowRight') {
      container.scrollLeft += cardWidth
    }
  }, [])

  // Status color mapping
  const getStatusColor = (status: RaceStatus) => {
    switch (status) {
      case 'Open': return '#16a34a'
      case 'Waitlist': return '#f59e0b'
      case 'Closed':
      case 'Sold Out': return '#ef4444'
      case 'Registration Soon': return '#a855f7'
      case 'Unknown': return '#9ca3af'
      default: return '#9ca3af'
    }
  }

  return (
    <Section id="races" className="py-20 lg:py-32">
      <Container>
        <motion.div
          className="text-center mb-16"
          variants={item}
          initial="hidden"
          animate="show"
        >
          <h2 className="mb-6">Find Your Race</h2>
          <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto">
            Browse upcoming Ironman events and start your training journey.
          </p>
          {isFallback && (
            <p className="text-sm text-[var(--text-3)] mt-2">
              Race data updating…
            </p>
          )}
        </motion.div>

        <motion.div
          className="relative"
          variants={item}
          initial="hidden"
          animate="show"
        >
          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-8 md:gap-6 pb-4 scrollbar-hide px-4 md:px-0"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Race carousel"
          >
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="card p-6 min-w-[280px] snap-start animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 bg-[var(--bg-2)] rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-[var(--bg-2)] rounded"></div>
                      <div className="h-4 bg-[var(--bg-2)] rounded"></div>
                    </div>
                    <div className="h-10 bg-[var(--bg-2)] rounded-xl"></div>
                  </div>
                </div>
              ))
            ) : (
              races.map((race, index) => (
                  <motion.div
                    key={index}
                    className="card p-6 min-w-[260px] md:min-w-[280px] snap-start relative overflow-hidden"
                    variants={item}
                    initial="hidden"
                    animate="show"
                    whileHover={{
                      rotateX: !isMobile && !prefersReducedMotion ? 2 : 0,
                      rotateY: !isMobile && !prefersReducedMotion ? -2 : 0,
                      scale: 1.02,
                      transition: { duration: prefersReducedMotion ? 0.1 : 0.2 }
                    }}
                    aria-label={`IRONMAN ${race.distance} — ${race.name}, ${race.location}, ${race.dateText}, status ${race.status}`}
                  >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-2)] to-[var(--bg-1)] opacity-50" />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--crimson)]/20 to-transparent rounded-bl-full" />
                    
                    {/* Status Pill */}
                    <div 
                      className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm hover:shadow-md transition-shadow duration-200"
                      style={{ 
                        backgroundColor: race.status === 'Registration Soon' ? 'transparent' : getStatusColor(race.status),
                        color: race.status === 'Registration Soon' ? getStatusColor(race.status) : 'white',
                        border: race.status === 'Registration Soon' ? `1px solid ${getStatusColor(race.status)}` : 'none',
                        borderRadius: '9999px'
                      }}
                      aria-live="off"
                    >
                      {race.status}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="space-y-4">
                        {/* Race Name */}
                        <h3 className="text-xl font-semibold text-[var(--text-1)] pr-16">
                          {race.name}
                        </h3>
                        
                        {/* Distance Badge */}
                        <div className="inline-block px-2 py-1 bg-[var(--crimson)]/10 border border-[var(--crimson)]/20 rounded text-xs font-medium text-[var(--crimson)]">
                          {race.distance}
                        </div>
                        
                        {/* Location & Date */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-[var(--text-2)]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm">{race.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-[var(--text-2)]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">{race.dateText}</span>
                          </div>
                        </div>
                        
                        {/* Select Button */}
                        <a 
                          href={race.url}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full px-4 py-2 border border-[var(--line)] rounded-xl text-[var(--text-1)] hover:bg-[var(--crimson)] hover:text-[var(--bg-0)] hover:border-[var(--crimson)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crimson)] text-center"
                        >
                          Select Race
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
            )}
          </div>

          {/* Edge Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-[var(--bg-0)] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[var(--bg-0)] to-transparent pointer-events-none" />
        </motion.div>
      </Container>
    </Section>
  )
}
