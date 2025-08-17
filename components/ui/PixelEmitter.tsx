'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PixelEmitterProps {
  count?: number
  color?: 'crimson'
  className?: string
}

export default function PixelEmitter({ count = 8, color = 'crimson', className = '' }: PixelEmitterProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const pixels = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 1.4 + Math.random() * 0.8,
    xOffset: -8 + Math.random() * 16,
    yOffset: -40 - Math.random() * 20,
  }))

  const glowColor = 'var(--crimson-glow)'
  const pixelColor = 'var(--crimson)'

  if (reducedMotion) {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        {pixels.map((pixel) => (
          <div
            key={pixel.id}
            className="absolute w-1 h-1 opacity-20"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              backgroundColor: pixelColor,
              boxShadow: `0 0 4px ${glowColor}`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {pixels.map((pixel) => (
        <motion.div
          key={pixel.id}
          className="absolute w-1 h-1"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            backgroundColor: pixelColor,
            boxShadow: `0 0 4px ${glowColor}`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            x: [0, pixel.xOffset],
            y: [0, pixel.yOffset],
          }}
          transition={{
            duration: pixel.duration,
            delay: pixel.delay,
            repeat: Infinity,
            repeatDelay: 1 + Math.random() * 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
