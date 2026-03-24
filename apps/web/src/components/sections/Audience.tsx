'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Lightbulb, Terminal, ShieldCheck } from 'lucide-react';

const AUDIENCES = [
  {
    id: 'founders',
    icon: Lightbulb,
    label: 'Founders & Builders',
    tagline: "You have an idea. You don't have three months.",
    accent: 'hsl(38 92% 60%)',
    description:
      "You're launching a token, a DAO, or an NFT collection. You don't need to become a Solidity expert — you need a contract that works and won't get your project rekt. Vesper gets you from whitepaper to deployable code in an afternoon, not a sprint.",
    callouts: [
      'Ship a token before your competitor does',
      'No Solidity expertise required',
      'Ready for Hardhat or Foundry instantly',
    ],
    bg: 'hsl(38 92% 60% / 0.04)',
  },
  {
    id: 'developers',
    icon: Terminal,
    label: 'Smart Contract Devs',
    tagline: 'Boilerplate is beneath you. We agree.',
    accent: 'hsl(174 72% 50%)',
    description:
      'You know your ERC-165 from your ERC-2981. You also know that typing out the same OpenZeppelin constructor args for the fifteenth time is a waste of your brain. Use Vesper to scaffold, then go build the interesting parts — the custom logic that actually matters.',
    callouts: [
      'Correct override signatures, every time',
      'NatSpec pre-written — skip the ceremony',
      'Feature dependency graph resolved for you',
    ],
    bg: 'hsl(174 72% 50% / 0.04)',
  },
  {
    id: 'auditors',
    icon: ShieldCheck,
    label: 'Security Auditors',
    tagline: 'Fewer surprises. More signal.',
    accent: 'hsl(262 80% 65%)',
    description:
      "Generated contracts follow predictable, documented patterns. OpenZeppelin bases are battle-tested. NatSpec is always present. Access control is consistently applied. You still need to audit — but you're auditing business logic, not chasing missing events or wrong visibility modifiers.",
    callouts: [
      'Predictable structure, no cowboy patterns',
      'Custom errors instead of revert strings',
      'Consistent access control throughout',
    ],
    bg: 'hsl(262 80% 65% / 0.04)',
  },
] as const;

type AudienceId = (typeof AUDIENCES)[number]['id'];

export default function AudienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState<AudienceId>('founders');

  const activeAudience = AUDIENCES.find((a) => a.id === active)!;

  return (
    <section
      id="audience"
      ref={ref}
      className="relative py-28 px-4 sm:px-6 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-primary text-xs font-mono uppercase tracking-[0.2em] mb-3">
            Who it's for
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Built for the entire
            <br />
            <span className="gradient-text">Web3 stack.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Persona tabs */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex lg:flex-col gap-2"
          >
            {AUDIENCES.map((audience) => {
              const Icon = audience.icon;
              const isActive = active === audience.id;
              return (
                <button
                  key={audience.id}
                  onClick={() => setActive(audience.id)}
                  className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 flex-1 lg:flex-initial group"
                  style={{
                    background: isActive ? audience.bg : 'transparent',
                    border: `1px solid ${isActive ? `${audience.accent}30` : 'transparent'}`,
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="audience-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full"
                      style={{ background: audience.accent }}
                    />
                  )}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: `${audience.accent}15`,
                      border: `1px solid ${audience.accent}20`,
                    }}
                  >
                    <Icon size={16} style={{ color: audience.accent }} />
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-200 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {audience.label}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Content pane */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="glass-card rounded-2xl p-8 h-full relative overflow-hidden"
                style={{ borderColor: `${activeAudience.accent}20` }}
              >
                {/* BG glow */}
                <div
                  className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[80px] pointer-events-none"
                  style={{ background: `${activeAudience.accent}08` }}
                />

                <p
                  className="text-xl md:text-2xl font-semibold mb-5 leading-snug"
                  style={{ color: activeAudience.accent }}
                >
                  "{activeAudience.tagline}"
                </p>

                <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
                  {activeAudience.description}
                </p>

                <ul className="space-y-3">
                  {activeAudience.callouts.map((callout, i) => (
                    <motion.li
                      key={callout}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: activeAudience.accent }}
                      />
                      <span className="text-foreground/80">{callout}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
