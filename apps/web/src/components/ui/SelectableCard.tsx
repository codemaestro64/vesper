'use client'

import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SelectableCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
  children: ReactNode
  className?: string
}

/**
 * A glass-styled card that acts as a toggle button.
 * Used for template cards, feature toggles, and any other selectable option UI.
 * Renders a glowing primary border when selected.
 */
export default function SelectableCard({
  selected,
  children,
  className,
  ...props
}: SelectableCardProps) {
  return (
    <button
      type="button"
      data-selected={selected}
      className={cn(
        'glass-card rounded-xl text-left transition-all duration-200 cursor-pointer',
        selected
          ? 'border-primary/40 glow-primary'
          : 'hover:border-primary/20 hover:glow-primary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
