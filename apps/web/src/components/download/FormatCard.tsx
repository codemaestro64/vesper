import { cn } from '@/lib/utils';
import { FormatOption } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function DownloadFormatCard({
  option,
  selected,
  onSelect,
}: {
  option: FormatOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left p-3 rounded-xl border transition-all duration-150',
        selected
          ? 'border-primary/40 bg-primary/[0.06] glow-primary'
          : 'border-border/40 bg-secondary/30 hover:border-border/70 hover:bg-secondary/50',
      )}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
            selected
              ? 'bg-primary/15 border border-primary/25'
              : 'bg-muted/50 border border-border/30',
          )}
        >
          <span className={selected ? 'text-primary' : 'text-muted-foreground'}>
            {option.icon}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{option.label}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
            {option.hint}
          </p>
        </div>
        {selected && (
          <CheckCircle2 size={14} className="text-primary shrink-0" />
        )}
      </div>
    </button>
  );
}
