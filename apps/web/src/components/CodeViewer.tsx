'use client'

import { useMemo, useCallback, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy, Check, Download, ChevronDown,
  FileCode, Package, Hammer,
} from 'lucide-react'
import IconToolbarButton from '@/components/ui/IconToolbarButton'
import WalletActionBar from '@/components/WalletActionBar'
import Dropdown from '@/components/ui/Dropdown'
import Button from '@/components/ui/button'

function downloadBlob(content: string, filename: string, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

interface DownloadOption {
  id:      string
  label:   string
  hint:    string
  icon:    React.ReactNode
  ext:     string
}

interface DownloadDropdownProps {
  code:         string
  contractName: string
  filename:     string
  disabled: boolean
}

function DownloadDropdown({ code, contractName, filename, disabled }: DownloadDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const options: DownloadOption[] = [
    {
      id:    'sol',
      label: 'Solidity file',
      hint:  '.sol — raw contract',
      icon:  <FileCode size={13} />,
      ext:   '.sol',
    },
    {
      id:    'hardhat',
      label: 'Hardhat project',
      hint:  'contracts + ignition + config',
      icon:  <Hammer size={13} />,
      ext:   '.txt',
    },
    {
      id:    'foundry',
      label: 'Foundry project',
      hint:  'src + script + test + toml',
      icon:  <Package size={13} />,
      ext:   '.txt',
    },
  ]

  function handleSelect(opt: DownloadOption) {
    setOpen(false)
    const name = contractName || 'Contract'
    if (opt.id === 'sol') {
      downloadBlob(code, filename)
    } else if (opt.id === 'hardhat') {
     
    } else {
      
    }
  }

  return (
    <Dropdown
      trigger={
        <Button 
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="flex items-center gap-0.5 p-1.5 rounded-md text-muted-foreground hover:bg-muted/50">
          <Download className="w-3.5 h-3.5" />
          <ChevronDown className="w-2.5 h-2.5" />
        </Button>
      }
    >
      <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Download as
      </p>
      
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => handleSelect(opt)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/40 group"
        >
          <span className="w-6 h-6 rounded-md bg-primary/10 border border-primary/15 flex items-center justify-center text-primary group-hover:bg-primary/15">
            {opt.icon}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight">{opt.label}</p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{opt.hint}</p>
          </div>
        </button>
      ))}
      <div className="h-2" />
    </Dropdown>
  )
}

interface CodeViewerProps {
  code:          string
  filename?:     string
  contractName?: string
  showWalletBar?: boolean
  isReady: boolean
}

export default function CodeViewer({
  code,
  filename      = 'contract.sol',
  contractName  = '',
  showWalletBar = false,
  isReady = false,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const highlighted = useMemo(() => highlightSolidity(code), [code])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const cleanName = contractName || filename.replace(/\.sol$/, '') || 'Contract'
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl overflow-hidden flex flex-col"
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 gap-3 min-w-0">
        {/* Left: traffic lights + filename */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{filename}</span>
        </div>

        {/* Right: wallet bar (slides in when ready) + copy + download — all in one row */}
        <div className="flex items-center gap-1.5 min-w-0">

          {/* Wallet connect / save — slides in beside the file actions */}
          <AnimatePresence>
            {showWalletBar && (
              <motion.div
                key="wallet-inline"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{    opacity: 0, width: 0     }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {/* Thin vertical separator */}
                <div className="flex items-center gap-1.5 pl-1 pr-2 border-r border-border/40 mr-1">
                  <WalletActionBar contractName={contractName} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <IconToolbarButton label="Copy to clipboard" onClick={handleCopy}>
            {copied
              ? <Check className="w-3.5 h-3.5 text-primary" />
              : <Copy className="w-3.5 h-3.5" />
            }
          </IconToolbarButton>

          <DownloadDropdown
            code={code}
            disabled={!isReady}
            contractName={cleanName}
            filename={filename}
          />
        </div>
      </div>

      {/* ── Code body ── */}
      <div className="overflow-auto p-4 scrollbar-hide flex-1">
        <pre className="text-sm font-mono leading-relaxed">
          {highlighted}
        </pre>
      </div>
    </motion.div>
  )
}

const KEYWORD_PATTERN = /\b(pragma|solidity|contract|import|function|public|private|external|internal|view|pure|returns|mapping|address|uint256|uint|bool|string|bytes|memory|storage|calldata|event|emit|modifier|require|if|else|for|while|return|is|constructor|struct|error|revert|override|virtual|abstract|interface|library|using|type|bytes32|uint8|uint128|indexed)\b/g
const STRING_PATTERN  = /"[^"]*"/g
const COMMENT_PATTERN = /\/\/.*/

function highlightLine(line: string): React.ReactNode {
  const commentMatch = line.match(COMMENT_PATTERN)
  if (commentMatch && commentMatch.index !== undefined) {
    const before  = line.slice(0, commentMatch.index)
    const comment = line.slice(commentMatch.index)
    return (
      <>
        {highlightTokens(before)}
        <span className="text-muted-foreground italic">{comment}</span>
      </>
    )
  }
  return highlightTokens(line)
}

function highlightTokens(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const combined = new RegExp(`(${KEYWORD_PATTERN.source})|(${STRING_PATTERN.source})`, 'g')
  let lastIndex = 0
  let match: RegExpExecArray | null

  combined.lastIndex = 0
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    if (match[1]) {
      parts.push(<span key={match.index} className="text-primary font-medium">{match[0]}</span>)
    } else {
      parts.push(<span key={match.index} className="text-accent">{match[0]}</span>)
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length > 0 ? <>{parts}</> : text
}

function highlightSolidity(code: string): React.ReactNode {
  const lines = code.split('\n')
  return lines.map((line, i) => (
    <div key={i} className="flex">
      <span className="select-none text-muted-foreground/40 text-right w-8 mr-4 shrink-0 text-xs leading-relaxed pt-[1px]">
        {i + 1}
      </span>
      <span className="flex-1">{highlightLine(line)}</span>
    </div>
  ))
}
