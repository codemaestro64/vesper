'use client';

import { motion } from 'framer-motion';

export interface ConfigSectionTitleProps {
  title: string;
  step: number;
}

export default function ConfigSectionTitle({
  title,
  step,
}: ConfigSectionTitleProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="text-xs font-semibold mb-3 flex items-center gap-2 uppercase tracking-widest text-muted-foreground"
    >
      <span
        className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold shrink-0"
        aria-hidden="true"
      >
        {step}
      </span>
      {title}
    </motion.h2>
  );
}
