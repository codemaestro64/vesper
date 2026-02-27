'use client'

import type { ReactNode } from 'react'
import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  activeClassName?: string
}

export function NavLink({
  href,
  children,
  className,
  activeClassName,
  ...props
}: NavLinkProps) {
  const pathname = usePathname()
  const isActive =
    typeof href === 'string' ? pathname === href : pathname === href.pathname

  return (
    <Link href={href} className={cn(className, isActive && activeClassName)} {...props}>
      {children}
    </Link>
  )
}
