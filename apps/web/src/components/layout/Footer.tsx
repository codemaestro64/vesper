import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Templates', href: '/#templates' },
  { label: 'Features', href: '/#features' },
  { label: 'Create Contract', href: '/create' },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand */}
          <div className="space-y-2">
            <Link
              href="/"
              className="font-mono font-semibold text-base gradient-text"
            >
              Vesper
            </Link>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              No-code Solidity smart contract builder. Powered by OpenZeppelin
              v5.
            </p>
          </div>

          {/* Links */}
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground/50 font-mono">
            © {new Date().getFullYear()} Vesper. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/40 font-mono">
            Generated contracts are provided as-is. Always audit before
            deploying to mainnet.
          </p>
        </div>
      </div>
    </footer>
  );
}
