import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right';
}

export default function Dropdown({
  trigger,
  children,
  className,
  align = 'right',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      {/* Trigger Area */}
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>

      {/* Panel Area */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            onClick={() => setOpen(false)} // Close when an item is clicked
            className={cn(
              'absolute z-30 mt-1.5 min-w-[12rem] rounded-xl border border-border/50 bg-popover shadow-lg overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
