"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import WalletConnectButton from "@/components/WalletConnectButton";

const SECTION_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Templates", href: "#templates" },
  { label: "Compare", href: "#compare" },
  { label: "Features", href: "#features" },
] as const;

const SECTION_IDS = SECTION_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  useEffect(() => setMobileOpen(false), [pathname]);

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;
      e.preventDefault();
      setMobileOpen(false);
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/50 bg-background/90 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative flex items-center justify-between h-14">
            {/* Logo — left */}
            <Link
              href="/"
              className="font-mono font-semibold text-lg gradient-text shrink-0"
            >
              Vesper
            </Link>

            {/* Section anchors — truly centered */}
            {isHome && (
              <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                {SECTION_LINKS.map(({ label, href }) => {
                  const id = href.slice(1);
                  return (
                    <a
                      key={href}
                      href={href}
                      onClick={(e) => handleAnchorClick(e, href)}
                      className={cn(
                        "nav-link px-3 py-1.5 rounded-md",
                        activeSection === id && "nav-link-active",
                      )}
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            )}

            {/* Right — wallet + dashboard + CTA */}
            <div className="hidden md:flex items-center gap-2">
              <WalletConnectButton onConnected={setWalletConnected} />

              {/* Dashboard link — only shown when wallet is connected */}
              <AnimatePresence>
                {walletConnected && (
                  <motion.div
                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                    animate={{ opacity: 1, width: "auto", marginLeft: 0 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <Link
                      href="/dashboard"
                      className={cn(
                        "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold whitespace-nowrap",
                        "border border-border/60 bg-secondary text-muted-foreground",
                        "transition-all duration-200",
                        "hover:border-border hover:text-foreground hover:bg-secondary/80",
                        pathname === "/dashboard" &&
                          "border-primary/30 bg-primary/10 text-primary hover:border-primary/60 hover:text-primary hover:bg-primary/15",
                      )}
                    >
                      <LayoutDashboard size={13} />
                      Dashboard
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link href="/create">
                <Button
                  variant="glow"
                  size="sm"
                  className="h-8 px-4 text-xs font-semibold"
                >
                  Create Contract
                </Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {isHome &&
                SECTION_LINKS.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => handleAnchorClick(e, href)}
                    className="px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                  >
                    {label}
                  </a>
                ))}

              <div className="h-px bg-border/40 my-1" />

              <div className="flex flex-col gap-2 pt-1">
                <WalletConnectButton onConnected={setWalletConnected} />

                {/* Dashboard — mobile, shown when connected */}
                {walletConnected && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-semibold",
                      "border border-border/60 bg-secondary text-muted-foreground",
                      "transition-all duration-200",
                      "hover:border-border hover:text-foreground",
                      pathname === "/dashboard" &&
                        "border-primary/30 bg-primary/10 text-primary",
                    )}
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                )}

                <Link href="/create" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="glow"
                    size="sm"
                    className="w-full h-10 text-sm font-semibold"
                  >
                    Create Contract
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
