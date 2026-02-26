'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Shield, Download } from 'lucide-react';
import Btn from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section 
      className="
        relative overflow-hidden 
        min-h-[90vh] sm:min-h-screen
        flex items-center justify-center
        overflow-hidden
      "
    >
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs text-muted-foreground font-medium">No-code smart contract builder</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Build Smart Contracts
            <br />
            <span className="gradient-text">In Seconds</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Select a template, configure features, and download production-ready Solidity contracts. No coding required.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Instant generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>OpenZeppelin based</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              <span>Download & deploy</span>
            </div>
          </div>

          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-8"
          >
            <Link href="/create">
              <Btn 
                variant="glow" 
                size="xl"
                className="cursor-pointer"
              >
                Create Smart Contract
              </Btn>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection