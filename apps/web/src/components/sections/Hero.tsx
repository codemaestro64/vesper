'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, Shield, Download } from 'lucide-react'
import Button from '@/components/ui/button'

const FEATURES = [
  { icon: Zap, label: 'Instant generation' },
  { icon: Shield, label: 'OpenZeppelin based' },
  { icon: Download, label: 'Download & deploy' },
] as const

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] sm:min-h-screen flex items-center justify-center">
      {/* Background decorations */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs text-muted-foreground font-medium">
              No-code smart contract builder
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Build Smart Contracts
            <br />
            <span className="gradient-text">In Seconds</span>
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Select a template, configure features, and download production-ready
            Solidity contracts. No coding required.
          </p>

          {/* Feature pills */}
          <ul className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground list-none p-0">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-8">
            <Link href="/create">
              <Button variant="glow" size="lg" className="h-14 px-10 text-base">
                Create Smart Contract
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
