'use client';

import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { cn } from '@/lib/utils';

export default function WalletConnectButton({
  onConnected,
}: {
  onConnected?: (connected: boolean) => void;
}) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        // Notify parent about connection state
        useEffect(() => {
          onConnected?.(!!connected);
        }, [connected]);

        if (!mounted)
          return (
            <div className="h-8 w-32 rounded-lg bg-secondary animate-pulse" />
          );

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className={cn(
                'relative h-8 px-4 text-xs font-semibold rounded-lg',
                'border border-border/60 bg-secondary text-foreground',
                'transition-all duration-200',
                'hover:border-primary/40 hover:text-primary hover:bg-secondary/80',
              )}
            >
              Connect Wallet
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              onClick={openChainModal}
              className="h-8 px-4 text-xs font-semibold rounded-lg border border-destructive/60 bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
            >
              Wrong network
            </button>
          );
        }

        return (
          <div className="flex items-center gap-2">
            {/* Chain indicator */}

            {/* Account button */}
            <button
              onClick={openAccountModal}
              className={cn(
                'flex items-center gap-2 h-8 px-3 rounded-lg text-xs font-semibold',
                'border border-primary/30 bg-primary/10 text-primary',
                'transition-all duration-200',
                'hover:border-primary/60 hover:bg-primary/15 hover:shadow-[0_0_12px_hsl(38_95%_58%/0.15)]',
              )}
            >
              {account.displayName}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
