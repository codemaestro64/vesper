'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedRevealProps {
  show: boolean
  children: ReactNode
  /** Unique key for AnimatePresence to track this element */
  id: string
  className?: string
}

/**
 * Conditionally renders children with a fade + height animation.
 * Wraps AnimatePresence + motion.div to avoid boilerplate at every call site.
 */
export default function AnimatedReveal({
  show,
  children,
  id,
  className,
}: AnimatedRevealProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn('overflow-hidden', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
