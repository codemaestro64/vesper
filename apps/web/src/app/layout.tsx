import type { Metadata } from 'next';
import { spaceGrotesk, jetbrainsMono } from '@/lib/fonts';
import { Providers } from '@/app/providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vesper — Smart Contract Builder',
  description:
    'Build production-ready Solidity smart contracts in seconds. No coding required.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background flex flex-col min-h-screen`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
