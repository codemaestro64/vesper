'use client'

import { FeatureOption } from "@vesper/types"
import Button from "@/components/ui/button"

interface FeaturesSelectorProps {
  selectedFeatures: string[]
  availableFeatures: FeatureOption[]
  onToggleFeature: (featureID: string) => void
}

const FeaturesSelector = ({ selectedFeatures, availableFeatures, onToggleFeature }: FeaturesSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {availableFeatures.map(feature => (
        <Button
          size="default"
          variant="glass"
          key={feature.id}
          onClick={() => onToggleFeature(feature.id)}
          className={`glass-card cursor-pointer rounded-lg p-3 text-left transition-all duration-200 ${
            selectedFeatures.includes(feature.id)
              ? 'border-primary/40 glow-primary'
              : 'hover:border-primary/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-sm border transition-colors ${
              selectedFeatures.includes(feature.id)
              ? 'bg-primary border-primary'
              : 'border-muted-foreground/30'
            }`} />
            <span className="text-sm font-medium">{feature.label}</span>
          </div>
        </Button>
      ))}
    </div>
  )
}

export default FeaturesSelector