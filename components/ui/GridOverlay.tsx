import { motion } from 'framer-motion'
import { gridOverlay } from '../motion/variants'

export default function GridOverlay() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none grid-overlay"
      variants={gridOverlay}
      animate="animate"
    />
  )
}
