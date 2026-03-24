'use client';

import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { WalletAuthGate } from '@/components/WalletAuthGate';

import '@rainbow-me/rainbowkit/styles.css';
import { ToastProvider } from '@/components/ui/toast';

const config = getDefaultConfig({
  appName: 'Vesper',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [mainnet, polygon],
});

const vesperTheme = darkTheme({
  accentColor: 'hsl(38 95% 58%)',
  accentColorForeground: 'hsl(20 12% 6%)',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'large',
});

const theme = {
  ...vesperTheme,
  colors: {
    ...vesperTheme.colors,
    modalBackground: 'hsl(20 12% 8%)',
    modalBorder: 'hsl(20 10% 16%)',
    modalText: 'hsl(38 25% 94%)',
    modalTextSecondary: 'hsl(30 12% 52%)',
    menuItemBackground: 'hsl(20 10% 13%)',
    profileForeground: 'hsl(20 12% 8%)',
    profileAction: 'hsl(20 10% 13%)',
    profileActionHover: 'hsl(20 10% 16%)',
    connectButtonBackground: 'hsl(20 10% 13%)',
    connectButtonBackgroundError: 'hsl(0 72% 51%)',
    connectButtonInnerBackground: 'hsl(20 10% 16%)',
    connectButtonText: 'hsl(38 25% 94%)',
    connectButtonTextError: 'hsl(38 25% 94%)',
    actionButtonBorder: 'hsl(20 10% 16%)',
    actionButtonBorderMobile: 'hsl(20 10% 16%)',
    actionButtonSecondaryBackground: 'hsl(20 10% 13%)',
    generalBorder: 'hsl(20 10% 16%)',
    generalBorderDim: 'hsl(20 10% 13%)',
    selectedOptionBorder: 'hsl(38 95% 58%)',
  },
  fonts: {
    body: '"Space Grotesk", ui-sans-serif, system-ui',
  },
  radii: {
    ...vesperTheme.radii,
    connectButton: '0.5rem',
    modal: '0.75rem',
    menuButton: '0.5rem',
    modalMobile: '0.75rem',
    actionButton: '0.5rem',
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={theme}>
          <ToastProvider>
            <WalletAuthGate>{children}</WalletAuthGate>
          </ToastProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
