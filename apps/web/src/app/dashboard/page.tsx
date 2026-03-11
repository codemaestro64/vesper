import { ChevronRight, FileCode, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* ── Page header ── */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 font-mono"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="opacity-40" />
            <span className="text-foreground/70">Create Contract</span>
          </nav>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2.5">
                <FileCode size={20} className="text-primary" />
                Contract Builder
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Configure your contract below — the generated Solidity updates
                live on the right.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
