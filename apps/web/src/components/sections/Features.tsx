'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ShieldCheck, Puzzle, Code2, FileDown, RefreshCw, Lock } from 'lucide-react'

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'OpenZeppelin Under the Hood',
    description: 'Every contract inherits from audited OpenZeppelin base contracts. You get battle-hardened security without writing a single line of low-level code.',
    size: 'large',
    accent: 'hsl(142 70% 50%)',
  },
  {
    icon: Puzzle,
    title: 'Smart Feature Resolution',
    description: 'Dependency conflicts handled automatically — enabling Votes auto-adds Permit, conflicting features like Enumerable and URI Storage are mutually excluded.',
    size: 'small',
    accent: 'hsl(199 89% 55%)',
  },
  {
    icon: Code2,
    title: 'Syntax-highlighted Preview',
    description: 'See your contract update live as you configure it.',
    size: 'small',
    accent: 'hsl(174 72% 50%)',
  },
  {
    icon: FileDown,
    title: 'One-click Download',
    description: 'Export a clean `.sol` file named after your contract, ready to drop into Hardhat, Foundry, or Remix.',
    size: 'small',
    accent: 'hsl(38 92% 60%)',
  },
  {
    icon: RefreshCw,
    title: 'NatSpec Documentation',
    description: 'Every generated function includes NatSpec comments with @notice, @dev, and @param annotations — your auditors will thank you.',
    size: 'large',
    accent: 'hsl(262 80% 65%)',
  },
  {
    icon: Lock,
    title: 'Access Control Baked In',
    description: 'Choose between Ownable and role-based AccessControl. Ownership and role grants are handled in the constructor automatically.',
    size: 'small',
    accent: 'hsl(340 80% 60%)',
  },
] as const

export default function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-28 px-4 sm:px-6 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-primary text-xs font-mono uppercase tracking-[0.2em] mb-3">Built right</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-lg">
            Not just a code generator —<br />
            <span className="gradient-text">a smart one.</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            const colSpan = feature.size === 'large' ? 'md:col-span-7' : 'md:col-span-5'

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`${colSpan} group`}
              >
                <div className="relative h-full glass-card rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-white/10">
                  {/* Corner accent glow */}
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    style={{ background: `${feature.accent}20` }}
                  />

                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${feature.accent}15`, border: `1px solid ${feature.accent}25` }}
                  >
                    <Icon size={18} style={{ color: feature.accent }} />
                  </div>

                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
