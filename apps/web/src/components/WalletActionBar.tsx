'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Rocket,
  Save,
  CheckCircle2,
  LayoutDashboard,
  Lock,
} from 'lucide-react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { cn } from '@/lib/utils';
import { useEditorContract } from '@/context/EditorContractContext';

export interface WalletActionBarProps {
  contractName: string;
  onDeploy?: () => void;
  className?: string;
}

export default function WalletActionBar({ className }: WalletActionBarProps) {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { name, isSaving, saved, onDeploy, onSave } = useEditorContract();

  function fmtAddr(a: string) {
    return `${a.slice(0, 6)}…${a.slice(-4)}`;
  }

  return (
    <AnimatePresence mode="wait">
      {isConnected && address ? (
        <motion.div
          key="connected"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn('flex items-center gap-1.5', className)}
        >
          {saved ? (
            /* Post-save: tick + dashboard link */
            <>
              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
              <Link href="/dashboard">
                <button className="flex items-center gap-1 h-6 px-2 rounded text-[11px] font-semibold border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 transition-all whitespace-nowrap">
                  <LayoutDashboard size={10} />
                  Dashboard
                </button>
              </Link>
            </>
          ) : (
            /* Pre-save: address pill + Save + Deploy */
            <>
              <span className="flex items-center gap-1 h-6 px-2 rounded bg-secondary/60 border border-border/40 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                <Wallet size={10} className="text-primary/70 shrink-0" />
                {fmtAddr(address)}
              </span>
              <button
                onClick={onSave}
                disabled={isSaving}
                title={`Save "${name || 'contract'}" to dashboard`}
                className={cn(
                  'flex items-center gap-1 h-6 px-2 rounded text-[11px] font-semibold border transition-all whitespace-nowrap',
                  'border-border/50 bg-secondary/50 text-muted-foreground hover:border-border hover:text-foreground',
                  isSaving && 'opacity-50 cursor-not-allowed',
                )}
              >
                <Save size={10} />
                {isSaving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={onDeploy}
                className="flex items-center gap-1 h-6 px-2 rounded text-[11px] font-semibold btn-primary whitespace-nowrap"
              >
                <Rocket size={10} />
                Deploy
              </button>
            </>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="disconnected"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn('flex items-center', className)}
        >
          <button
            onClick={openConnectModal}
            title={`Connect wallet to save "${name || 'contract'}" and deploy`}
            className={cn(
              'flex items-center gap-1.5 h-6 px-2.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap',
              'border border-primary/30 bg-primary/8 text-primary',
              'hover:bg-primary/15 hover:border-primary/50',
            )}
          >
            <Lock size={10} />
            Connect to save
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
