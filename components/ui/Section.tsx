import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { container } from '../motion/variants'

interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
}

export default function Section({ children, id, className = '' }: SectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {children}
    </motion.section>
  )
}
