import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface IconToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
}

/**
 * A small icon-only button for use in toolbars and compact action areas.
 * Provides consistent sizing, hover styling, and accessible labeling.
 */
export default function IconToolbarButton({
  label,
  children,
  className,
  ...props
}: IconToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={cn(
        'p-1.5 rounded-md transition-colors',
        'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
