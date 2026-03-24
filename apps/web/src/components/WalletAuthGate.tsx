'use client';

import { useWalletAuth } from '@/hooks/useWalletAuth';

export function WalletAuthGate({ children }: { children: React.ReactNode }) {
  useWalletAuth();
  return <>{children}</>;
}
