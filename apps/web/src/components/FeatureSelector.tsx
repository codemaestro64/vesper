'use client'

import type { FeatureOption } from '@vesper/types'
import SelectableCard from '@/components/ui/SelectableCard'
import { cn } from '@/lib/utils'

interface FeatureSelectorProps {
  selectedFeatures: string[]
  availableFeatures: FeatureOption[]
  onToggleFeature: (featureId: string) => void
}

export default function FeatureSelector({
  selectedFeatures,
  availableFeatures,
  onToggleFeature,
}: FeatureSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {availableFeatures.map((feature) => {
        const isSelected = selectedFeatures.includes(feature.id)
        return (
          <SelectableCard
            key={feature.id}
            selected={isSelected}
            role="checkbox"
            aria-checked={isSelected}
            aria-label={feature.label}
            title={feature.description}
            onClick={() => onToggleFeature(feature.id)}
            className="p-3 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-3 h-3 rounded-sm border shrink-0 transition-colors',
                  isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                )}
                aria-hidden="true"
              />
              <span className="text-sm font-medium leading-tight">{feature.label}</span>
            </div>
          </SelectableCard>
        )
      })}
    </div>
  )
}
