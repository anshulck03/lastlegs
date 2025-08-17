export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1],
    },
  },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const hoverCard = {
  hover: {
    y: -4,
    rotateX: 1.5,
    rotateY: -1.5,
    boxShadow: "0 0 30px rgba(220,20,60,0.35)",
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 20,
    },
  },
}

export const gridOverlay = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 24,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
}

// Reduced motion variants
export const reducedMotionContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export const reducedMotionItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}
