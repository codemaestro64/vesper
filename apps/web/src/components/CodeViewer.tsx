import { motion } from "framer-motion"

interface CodeViewerProps {
  code: string
}

const CodeViewer = ({ code }: CodeViewerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/50">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        <span className="text-xs text-muted-foreground ml-2 font-mono">contract.sol</span>
      </div>
      <div className="overflow-auto max-h-[600px] p-4">
        <pre className="text-sm  font-monos leading-relaxed">
          {highlightSolidity(code)}
        </pre>
      </div>
    </motion.div>
  )
}

function highlightSolidity(line: string): React.ReactNode {
  const keywords = /\b(pragma|solidity|contract|import|function|public|private|external|internal|view|pure|returns|mapping|address|uint256|uint|bool|string|bytes|memory|storage|calldata|event|emit|modifier|require|if|else|for|while|return|is|constructor|struct)\b/g;
  const comments = /(\/\/.*$)/;
  const strings = /(".*?")/g;

  if (comments.test(line)) {
    const [before, comment] = line.split('//');
    return (
      <>
        {highlightSolidity(before)}
        <span className="text-muted-foreground">{'//' + comment}</span>
      </>
    );
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const combined = new RegExp(`(${keywords.source})|(${strings.source})`, 'g');
  let match;

  const text = line;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(<span key={match.index} className="text-primary">{match[0]}</span>);
    } else if (match[3]) {
      parts.push(<span key={match.index} className="text-accent">{match[0]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : line;
}

export default CodeViewer