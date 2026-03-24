'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileCode,
  Package,
  Hammer,
  Download,
  CheckCircle2,
  Loader2,
  FolderOpen,
  File,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/button';
import { contractApi } from '@/lib/api/contract';
import { useToast } from '@/components/ui/toast';
import { TreeNode, FormatOption } from './types';
import { foundryTree, hardhatTree } from './lib';
import DownloadFormatCard from './FormatCard';

function FileTree({ nodes, depth = 0 }: { nodes: TreeNode[]; depth?: number }) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node, i) => (
        <li key={i}>
          <div
            className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground"
            style={{ paddingLeft: `${depth * 12}px` }}
          >
            {node.type === 'folder' ? (
              <FolderOpen size={11} className="text-primary/60 shrink-0" />
            ) : (
              <File size={11} className="text-muted-foreground/50 shrink-0" />
            )}
            <span
              className={
                node.type === 'folder' ? 'text-foreground/70 font-medium' : ''
              }
            >
              {node.name}
            </span>
          </div>
          {node.children && (
            <FileTree nodes={node.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  contractName: string;
  filename: string;
}

export function DownloadModal({
  open,
  onClose,
  code,
  contractName,
  filename,
}: DownloadModalProps) {
  const [selected, setSelected] = useState<FormatOption['id']>('sol');
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const { successToast, errorToast } = useToast();

  const name = contractName || filename.replace(/\.sol$/, '') || 'Contract';

  const FORMAT_OPTIONS: FormatOption[] = [
    {
      id: 'sol',
      label: 'Solidity file',
      hint: 'Just the .sol — import into Remix, Hardhat, or Foundry yourself',
      icon: <FileCode size={15} />,
      server: false,
      files: [{ type: 'file', name: filename }],
    },
    {
      id: 'hardhat',
      label: 'Hardhat project',
      hint: 'Full project with Ignition deploy module, config & scripts',
      icon: <Hammer size={15} />,
      server: true,
      files: hardhatTree(name),
    },
    {
      id: 'foundry',
      label: 'Foundry project',
      hint: 'Full project with deploy script, tests, Makefile & toml',
      icon: <Package size={15} />,
      server: true,
      files: foundryTree(name),
    },
  ];

  const activeOption = FORMAT_OPTIONS.find((o) => o.id === selected)!;

  async function handleDownload() {
    setDownloading(true);
    setDone(false);
    try {
      if (selected === 'sol') {
        contractApi.downloadSol(code, filename);
      } else if (selected === 'hardhat') {
        await contractApi.downloadHardhat(name, code);
      } else {
        await contractApi.downloadFoundry(name, code);
      }
      setDone(true);
      successToast(
        'Download started',
        `${name} ${activeOption.label} is downloading`,
      );
      // Auto-close after brief success moment
      setTimeout(() => {
        setDone(false);
        onClose();
      }, 1200);
    } catch (err) {
      errorToast(
        'Download failed',
        err instanceof Error ? err.message : 'Please try again',
      );
    } finally {
      setDownloading(false);
    }
  }

  function onDownloadClick() {
    void handleDownload();
  }

  // Reset state when modal closes
  function handleClose() {
    setDone(false);
    setDownloading(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 6 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="glass-card-elevated w-full max-w-lg overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Download size={15} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold leading-tight">
                    Download contract
                  </h2>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    {filename}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="p-5 space-y-4">
              {/* ── Format picker ── */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Choose format
                </p>
                <div className="space-y-2">
                  {FORMAT_OPTIONS.map((opt) => (
                    <DownloadFormatCard
                      key={opt.id}
                      option={opt}
                      selected={selected === opt.id}
                      onSelect={() => {
                        setSelected(opt.id);
                        setDone(false);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* ── File tree preview ── */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  What's included
                </p>
                <div className="rounded-lg bg-muted/20 border border-border/30 px-3 py-2.5 max-h-40 overflow-y-auto scrollbar-hide">
                  <FileTree nodes={activeOption.files} />
                </div>
              </div>

              {/* ── Server note for scaffold formats ── */}
              {activeOption.server && (
                <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                  Project scaffold is generated server-side and delivered as a{' '}
                  <span className="font-mono">.zip</span>. Unzip, run{' '}
                  <span className="font-mono">pnpm install</span>, copy{' '}
                  <span className="font-mono">.env.example → .env</span>, and
                  you're ready to deploy.
                </p>
              )}

              {/* ── Download button ── */}
              <button
                onClick={onDownloadClick}
                disabled={downloading || done}
                className={cn(
                  'w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold transition-all duration-200',
                  done
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
                    : 'btn-primary',
                  (downloading || done) && 'cursor-not-allowed',
                )}
              >
                {done ? (
                  <>
                    <CheckCircle2 size={15} />
                    Downloaded
                  </>
                ) : downloading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Downloading…
                  </>
                ) : (
                  <>
                    <Download size={15} />
                    Download {activeOption.label}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
