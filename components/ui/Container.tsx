import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-[1200px] px-6 md:px-8 mx-auto ${className}`}>
      {children}
    </div>
  )
}
