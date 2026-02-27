'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { contractTemplates } from '@/lib/contract-generator'
import TokenIcon, { type IconName } from '@/components/TokenIcon'

const CARD_ACCENTS: Record<string, string> = {
  erc20:      'hsl(174 72% 50%)',
  erc721:     'hsl(38 92% 60%)',
  erc1155:    'hsl(262 80% 65%)',
  staking:    'hsl(199 89% 55%)',
  governance: 'hsl(142 70% 50%)',
  multisig:   'hsl(340 80% 60%)',
}

const CARD_TAGS: Record<string, string[]> = {
  erc20:      ['fungible', 'transferable', 'mintable'],
  erc721:     ['unique', 'collectible', 'nft'],
  erc1155:    ['multi-token', 'batch', 'efficient'],
  staking:    ['yield', 'lock', 'rewards'],
  governance: ['voting', 'dao', 'timelock'],
  multisig:   ['m-of-n', 'safe', 'multisig'],
}

export default function TemplatesShowcase() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hoveredType, setHoveredType] = useState<string | null>(null)

  return (
    <section id="templates" ref={ref} className="relative py-28 px-4 sm:px-6 overflow-hidden">
      {/* background radial */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-primary text-xs font-mono uppercase tracking-[0.2em] mb-3">Templates</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Every contract type,<br />
              <span className="gradient-text">ready to configure.</span>
            </h2>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:gap-3 transition-all shrink-0"
          >
            Browse all templates <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractTemplates.map((template, i) => {
            const accent = CARD_ACCENTS[template.type] ?? 'hsl(174 72% 50%)'
            const tags = CARD_TAGS[template.type] ?? []
            const isHovered = hoveredType === template.type
            const featureCount = template.availableFeatures.length

            return (
              <motion.div
                key={template.type}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onHoverStart={() => setHoveredType(template.type)}
                onHoverEnd={() => setHoveredType(null)}
              >
                <Link href="/create" className="block h-full group">
                  <div
                    className="relative h-full glass-card p-5 rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      borderColor: isHovered ? `${accent}40` : undefined,
                      boxShadow: isHovered ? `0 0 30px ${accent}15, 0 8px 32px rgba(0,0,0,0.4)` : undefined,
                    }}
                  >
                    {/* Accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                      style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: isHovered ? 1 : 0.3 }}
                    />

                    {/* Icon + feature count */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
                      >
                        <TokenIcon
                          name={template.icon as IconName}
                          size={20}
                          style={{ color: accent }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground/50 bg-muted/40 rounded-full px-2.5 py-1">
                        {featureCount} features
                      </span>
                    </div>

                    {/* Title + description */}
                    <h3 className="font-semibold text-base mb-2 group-hover:text-foreground transition-colors">
                      {template.label}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                      {template.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: `${accent}12`, color: accent }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Arrow reveal on hover */}
                    <div
                      className="absolute bottom-4 right-4 transition-all duration-300"
                      style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateX(0)' : 'translateX(-6px)' }}
                    >
                      <ArrowRight size={16} style={{ color: accent }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
