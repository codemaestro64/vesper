'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink } from './NavLink'
import Button from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SECTION_LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Templates',    href: '#templates' },
  { label: 'Compare',      href: '#compare' },
  { label: 'Features',     href: '#features' },
] as const

const SECTION_IDS = SECTION_LINKS.map(l => l.href.slice(1))

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll depth for border visibility
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (!isHome) return

    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [isHome])

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname])

  const handleAnchorClick = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    setMobileOpen(false)
    const el = document.getElementById(href.slice(1))
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-border/50 bg-background/90 backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="font-mono font-semibold text-lg gradient-text shrink-0">
              Vesper
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {/* Section anchors — only on homepage */}
              {isHome && SECTION_LINKS.map(({ label, href }) => {
                const id = href.slice(1)
                const isActive = activeSection === id
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={e => handleAnchorClick(e, href)}
                    className={cn(
                      'nav-link px-3 py-1.5 rounded-md text-sm transition-colors duration-200',
                      isActive && 'nav-link-active text-primary'
                    )}
                  >
                    {label}
                  </a>
                )
              })}

              {/* Divider */}
              {isHome && (
                <div className="w-px h-4 bg-border/60 mx-2" />
              )}

              {/* Create CTA */}
              <Link href="/create">
                <Button variant="glow" size="sm" className="h-8 px-4 text-xs font-semibold">
                  Create Contract
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {isHome && SECTION_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={e => handleAnchorClick(e, href)}
                  className="px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  {label}
                </a>
              ))}

              <div className="h-px bg-border/40 my-1" />

              <Link href="/create" onClick={() => setMobileOpen(false)}>
                <Button variant="glow" size="sm" className="w-full h-10 text-sm font-semibold">
                  Create Contract
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
