'use client';

import { motion } from 'framer-motion';
import type { ContractTemplate } from '@vesper/types';
import { contractTemplates } from '@/lib/contract-generator';
import TokenIcon, { type IconName } from './TokenIcon';
import SelectableCard from '@/components/ui/SelectableCard';

interface TemplateSelectorProps {
  selected: ContractTemplate | null;
  onSelect: (template: ContractTemplate) => void;
}

export default function TemplateSelector({
  selected,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-3"
      role="radiogroup"
      aria-label="Contract template"
    >
      {contractTemplates.map((template, i) => {
        const isSelected = selected?.type === template.type;
        return (
          <motion.div
            key={template.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            <SelectableCard
              selected={isSelected}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(template)}
              className="w-full py-3 px-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TokenIcon
                  name={template.icon as IconName}
                  size={20}
                  className="text-primary"
                />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {template.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {template.label}
              </p>
            </SelectableCard>

            {isSelected && (
              <motion.div
                layoutId="selected-template"
                className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
