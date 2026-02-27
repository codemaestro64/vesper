'use client'

import { useMemo, useState, useCallback } from 'react'
import type { ContractTemplate } from '@vesper/types'
import ConfigSection from '@/components/ConfigSection'
import AnimatedReveal from '@/components/AnimatedReveal'
import TemplateSelector from '@/components/TemplateSelector'
import FeatureSelector from '@/components/FeatureSelector'
import { Input } from '@/components/ui/input'
import CodeViewer from '@/components/CodeViewer'
import { generateContractCode } from '@/lib/contract-generator'

const PLACEHOLDER_CODE = '// Select a template and configure your contract'

export default function CreatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [contractName, setContractName] = useState('')
  const [contractSymbol, setContractSymbol] = useState('')
  const [contractDecimals, setContractDecimals] = useState(18)
  const [contractInitialSupply, setContractInitialSupply] = useState(0)

  const handleSelectTemplate = useCallback((template: ContractTemplate) => {
    setSelectedTemplate(template)
    setSelectedFeatures(template.defaultFeatures ?? [])
  }, [])

  const handleToggleFeature = useCallback((featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((f) => f !== featureId)
        : [...prev, featureId]
    )
  }, [])

  const config = useMemo(() => {
    if (!selectedTemplate || !contractName.trim()) return null
    return {
      type: selectedTemplate.type,
      name: contractName.trim(),
      symbol: contractSymbol.trim() || undefined,
      description: selectedTemplate.description,
      features: selectedFeatures,
    }
  }, [selectedTemplate, selectedFeatures, contractName, contractSymbol])

  const code = useMemo(
    () => (config ? generateContractCode(config) : PLACEHOLDER_CODE),
    [config]
  )

  const downloadFilename = contractName.trim()
    ? `${contractName.trim().replace(/\s+/g, '')}.sol`
    : 'contract.sol'

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 items-start">

          {/* Left: Configuration panel */}
          <div className="glass-card p-5 space-y-6 overflow-auto max-h-[calc(100vh-100px)] scrollbar-hide sticky top-20">

            <ConfigSection title="Choose Template" step={1}>
              <TemplateSelector
                selected={selectedTemplate}
                onSelect={handleSelectTemplate}
              />
            </ConfigSection>

            <AnimatedReveal show={!!selectedTemplate} id="contract-config" className="space-y-6">

              <ConfigSection title="Contract Info" step={2}>
                <div className="glass-card p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contract Name"
                      placeholder="MyToken"
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                    />
                    <Input
                      label="Symbol"
                      placeholder="MTK"
                      value={contractSymbol}
                      onChange={(e) => setContractSymbol(e.target.value)}
                    />
                  </div>

                  {selectedTemplate?.type === 'erc20' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Initial Supply"
                        type="number"
                        placeholder="1000000"
                        min={0}
                        value={contractInitialSupply}
                        onChange={(e) => setContractInitialSupply(Number(e.target.value))}
                      />
                      <Input
                        label="Decimals"
                        type="number"
                        placeholder="18"
                        min={0}
                        max={18}
                        value={contractDecimals}
                        onChange={(e) => setContractDecimals(Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </ConfigSection>

              {selectedTemplate && selectedTemplate.availableFeatures.length > 0 && (
                <ConfigSection title="Contract Features" step={3}>
                  <FeatureSelector
                    selectedFeatures={selectedFeatures}
                    availableFeatures={selectedTemplate.availableFeatures}
                    onToggleFeature={handleToggleFeature}
                  />
                </ConfigSection>
              )}

            </AnimatedReveal>
          </div>

          {/* ── Right: Code preview ── */}
          <div className="sticky top-20">
            <CodeViewer code={code} filename={downloadFilename} />
          </div>

        </div>
      </div>
    </div>
  )
}
