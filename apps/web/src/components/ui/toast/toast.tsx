import * as React from 'react';
import { cva } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Toast, ToastVariant } from './types';

const toastVariants = cva(
  'relative flex items-start gap-3 w-80 rounded-xl border px-4 py-3.5 text-sm shadow-lg backdrop-blur-xl pointer-events-auto',
  {
    variants: {
      variant: {
        success:
          'bg-card/90 border-primary/30 shadow-[0_0_20px_hsl(38_95%_58%/0.08)]',
        warning:
          'bg-card/90 border-accent/30 shadow-[0_0_20px_hsl(22_90%_52%/0.08)]',
        error:
          'bg-card/90 border-destructive/30 shadow-[0_0_20px_hsl(0_72%_51%/0.08)]',
      },
    },
    defaultVariants: { variant: 'success' },
  },
);

const iconVariants = cva('mt-0.5 shrink-0 w-4 h-4', {
  variants: {
    variant: {
      success: 'text-primary',
      warning: 'text-accent',
      error: 'text-destructive',
    },
  },
  defaultVariants: { variant: 'success' },
});

const progressVariants = cva('absolute bottom-0 left-0 h-[2px] rounded-b-xl', {
  variants: {
    variant: {
      success: 'bg-primary',
      warning: 'bg-accent',
      error: 'bg-destructive',
    },
  },
  defaultVariants: { variant: 'success' },
});

const ICONS: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const duration = toast.duration ?? 4000;
  const Icon = ICONS[toast.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(toastVariants({ variant: toast.variant }))}
    >
      <Icon className={cn(iconVariants({ variant: toast.variant }))} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground leading-snug">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <motion.div
        className={cn(progressVariants({ variant: toast.variant }))}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        onAnimationComplete={() => onDismiss(toast.id)}
      />
    </motion.div>
  );
}
