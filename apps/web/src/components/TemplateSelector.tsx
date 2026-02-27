'use client'

import { motion } from "framer-motion";
import { ContractTemplate } from "@vesper/types";
import { contractTemplates } from "@/lib/contract-generator";
import TokenIcon, { IconName } from "./TokenIcon";

interface TemplateSelectorProps {
  selected: ContractTemplate | null
  onSelect: (type: ContractTemplate) => void
}

const TemplateSelector = ({ selected, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {contractTemplates.map((template, i) => (
        <motion.button
          key={template.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onSelect(template)}
          className={`border group relative py-2 px-4 rounded-xl text-left transition-all duration-300 ${
            selected?.type === template.type
              ? 'glass-card glow-primary border-primary/40'
              : 'glass-card hover:border-primary/20 hover:glow-primary'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TokenIcon 
              name={template.icon as IconName} 
              className="text-yellow-700" 
              size={23} 
            />
            <span className="text-sm font-semibold uppercase">{template.type}</span>
          </div>
          <p className="text-xs text-gray-400">{template.label}</p>
          {selected?.type === template.type && (
            <motion.div
              layoutId="selected-template"
              className="absolute inset-0 rounded-xl border-2 border-primary/50 pointer-events-none"
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}

export default TemplateSelector