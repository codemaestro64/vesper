'use client'

import { useMemo, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Download } from 'lucide-react'
import IconToolbarButton from '@/components/ui/IconToolbarButton'

interface CodeViewerProps {
  code: string
  filename?: string
}

export default function CodeViewer({ code, filename = 'contract.sol' }: CodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const highlighted = useMemo(() => highlightSolidity(code), [code])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [code, filename])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl overflow-hidden flex flex-col"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 ">
        <div className="flex items-center gap-3">
          {/* macOS traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{filename}</span>
        </div>

        <div className="flex items-center gap-1">
          <IconToolbarButton label="Copy to clipboard" onClick={handleCopy}>
            {copied
              ? <Check className="w-3.5 h-3.5 text-primary" />
              : <Copy className="w-3.5 h-3.5" />
            }
          </IconToolbarButton>
          <IconToolbarButton label="Download file" onClick={handleDownload}>
            <Download className="w-3.5 h-3.5" />
          </IconToolbarButton>
        </div>
      </div>

      {/* Code body */}
      <div className="overflow-auto p-4 scrollbar-hide">
        <pre className="text-sm font-mono leading-relaxed">
          {highlighted}
        </pre>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Syntax highlighter — processes code line by line to handle comments correctly
// ─────────────────────────────────────────────────────────────────────────────

const KEYWORD_PATTERN = /\b(pragma|solidity|contract|import|function|public|private|external|internal|view|pure|returns|mapping|address|uint256|uint|bool|string|bytes|memory|storage|calldata|event|emit|modifier|require|if|else|for|while|return|is|constructor|struct|error|revert|override|virtual|abstract|interface|library|using|type|bytes32|uint8|uint128|indexed)\b/g
const STRING_PATTERN = /"[^"]*"/g
const COMMENT_PATTERN = /\/\/.*/

function highlightLine(line: string): React.ReactNode {
  const commentMatch = line.match(COMMENT_PATTERN)
  if (commentMatch && commentMatch.index !== undefined) {
    const before = line.slice(0, commentMatch.index)
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
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[1]) {
      parts.push(<span key={match.index} className="text-primary font-medium">{match[0]}</span>)
    } else {
      parts.push(<span key={match.index} className="text-accent">{match[0]}</span>)
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
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
