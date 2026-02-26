'use client'

import { forwardRef, ReactNode } from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLinkProps extends Omit<LinkProps, 'className'> {
  children: ReactNode
  className?: string
  activeClassName?: string
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, className, activeClassName, ...props }, ref) => {
    const pathname = usePathname()

    const isActive =
      typeof href === 'string'
        ? pathname === href
        : pathname === href.pathname

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      > 
        {children}
      </Link>
    )
  }
)

NavLink.displayName = 'NavLink'

export { NavLink }