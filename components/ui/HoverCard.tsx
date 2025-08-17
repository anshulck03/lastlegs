import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { hoverCard } from '../motion/variants'

interface HoverCardProps {
  children: ReactNode
  className?: string
}

export default function HoverCard({ children, className = '' }: HoverCardProps) {
  return (
    <motion.div
      className={className}
      variants={hoverCard}
      whileHover="hover"
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
