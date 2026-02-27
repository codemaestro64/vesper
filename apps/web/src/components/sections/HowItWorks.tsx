'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { MousePointerClick, SlidersHorizontal, Rocket } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: MousePointerClick,
    title: 'Pick a Template',
    description: 'Choose from ERC-20 tokens, NFTs, multi-sigs, staking contracts, DAOs, and more. Each template is battle-tested.',
    color: 'hsl(174 72% 50%)',
  },
  {
    number: '02',
    icon: SlidersHorizontal,
    title: 'Configure Features',
    description: 'Toggle features like mintable, pausable, burnable, permit, and votes. Conflicts and dependencies are resolved automatically.',
    color: 'hsl(199 89% 55%)',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Download & Deploy',
    description: 'Get clean, documented Solidity code with OpenZeppelin imports. Audit-ready and production-grade from day one.',
    color: 'hsl(262 80% 65%)',
  },
] as const

const CODE_LINES = [
  { text: '// SPDX-License-Identifier: MIT', type: 'comment' },
  { text: 'pragma solidity ^0.8.24;', type: 'keyword' },
  { text: '', type: 'empty' },
  { text: 'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";', type: 'import' },
  { text: 'import "@openzeppelin/contracts/access/Ownable.sol";', type: 'import' },
  { text: '', type: 'empty' },
  { text: 'contract MyToken is ERC20, Ownable {', type: 'declaration' },
  { text: '    constructor() ERC20("MyToken", "MTK")', type: 'constructor' },
  { text: '        Ownable(msg.sender) {', type: 'constructor' },
  { text: '        _mint(msg.sender, 1_000_000 * 10 ** 18);', type: 'body' },
  { text: '    }', type: 'body' },
  { text: '}', type: 'declaration' },
]

function TypewriterCode() {
  const [visibleLines, setVisibleLines] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleLines(i)
      if (i >= CODE_LINES.length) clearInterval(interval)
    }, 120)
    return () => clearInterval(interval)
  }, [inView])

  return (
    <div ref={ref} className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        <span className="text-xs text-muted-foreground font-mono ml-2">MyToken.sol</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed min-h-[280px]">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="flex">
            <span className="select-none text-muted-foreground/30 w-6 mr-4 shrink-0 text-right text-xs leading-[1.6]">
              {i + 1}
            </span>
            <span className={
              line.type === 'comment' ? 'text-muted-foreground/60 italic' :
              line.type === 'keyword' || line.type === 'declaration' ? 'text-primary' :
              line.type === 'import' ? 'text-accent' :
              'text-foreground/80'
            }>
              {line.text || '\u00A0'}
            </span>
            {i === visibleLines - 1 && (
              <span className="inline-block w-[2px] h-[14px] bg-primary ml-0.5 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-28 px-4 sm:px-6 overflow-hidden">
      {/* Subtle divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <p className="text-primary text-xs font-mono uppercase tracking-[0.2em] mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            From idea to Solidity<br />
            <span className="gradient-text">in three steps.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Steps */}
          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex gap-6 group"
                >
                  {/* Number + connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}
                    >
                      <Icon size={20} style={{ color: step.color }} />
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px flex-1 my-2 bg-gradient-to-b from-border/60 to-transparent min-h-[40px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-10">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-xs font-mono text-muted-foreground/40">{step.number}</span>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Live code preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TypewriterCode />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
