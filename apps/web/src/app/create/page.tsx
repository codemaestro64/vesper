'use client'

import { useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, FileCode, CheckCircle2, Zap } from 'lucide-react'
import type { ContractTemplate } from '@vesper/types'
import ConfigSection from '@/components/ConfigSection'
import AnimatedReveal from '@/components/AnimatedReveal'
import TemplateSelector from '@/components/TemplateSelector'
import FeatureSelector from '@/components/FeatureSelector'
import { Input } from '@/components/ui/input'
import CodeViewer from '@/components/CodeViewer'
import { generateContractCode } from '@/lib/contract-generator'
import { EditorContractProvider } from '@/context/EditorContractContext'
import { useCreateContract } from '@/hooks/useContracts'
import { ContractConfig } from '@vesper/types'

const PLACEHOLDER_CODE = '// Select a template and configure your contract'

export default function CreatePage() {
  const [selectedTemplate, setSelectedTemplate]   = useState<ContractTemplate | null>(null)
  const [selectedFeatures, setSelectedFeatures]   = useState<string[]>([])
  const [contractName, setContractName]           = useState('')
  const [contractSymbol, setContractSymbol]       = useState('')
  const [contractDecimals, setContractDecimals]   = useState(18)
  const [contractInitialSupply, setContractInitialSupply] = useState(0)
  const [saved,  setSaved]       = useState(false)
  const { isCreateError, isCreating, createContract } = useCreateContract()

  const handleSelectTemplate = useCallback((template: ContractTemplate) => {
    setSelectedTemplate(template)
    setSelectedFeatures(template.defaultFeatures ?? [])
  }, [])

  const handleToggleFeature = useCallback((featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((f) => f !== featureId)
        : [...prev, featureId],
    )
  }, [])

  const config = useMemo((): ContractConfig | null => {
    if (!selectedTemplate || !contractName.trim()) return null
    return {
      type:        selectedTemplate.type,
      name:        contractName.trim(),
      symbol:      contractSymbol.trim(),
      description: selectedTemplate.description,
      features:    selectedFeatures,
    }
  }, [selectedTemplate, selectedFeatures, contractName, contractSymbol])

  const code = useMemo(
    () => (config ? generateContractCode(config) : PLACEHOLDER_CODE),
    [config],
  )

  const isReady         = !!config
  const featureCount    = selectedFeatures.length
  const downloadFilename = contractName.trim()
    ? `${contractName.trim().replace(/\s+/g, '')}.sol`
    : 'contract.sol'

  const onDeploy = () => {}
  const onSave = async () => {
    if (!config) return;

    const { type, ...rest } = config

    try {
      await createContract({
        ...rest,
        contractType: config.type,
        initialSupply: contractInitialSupply,
        decimals: contractDecimals,
      })

      setSaved(true)
    } catch {}
  }

  return (
    <EditorContractProvider value={{
      ...config,
      code: code,
      onDeploy: onDeploy,
      onSave: onSave,
      isSaving: isCreating,
      isDeploying: false,
      saved
    }}>
      <div className="min-h-screen pt-16 flex flex-col">

        {/* ── Page header ── */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 font-mono" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={12} className="opacity-40" />
              <span className="text-foreground/70">Create Contract</span>
            </nav>

            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div>
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2.5">
                  <FileCode size={20} className="text-primary" />
                  Contract Builder
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure your contract below — the generated Solidity updates live on the right.
                </p>
              </div>

              {/* Status pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <AnimatePresence>
                  {selectedTemplate && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full glass-card border-primary/20 text-foreground/70"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {selectedTemplate.label}
                    </motion.span>
                  )}
                  {featureCount > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full glass-card border-border/40 text-muted-foreground"
                    >
                      <Zap size={10} className="text-primary/60" />
                      {featureCount} feature{featureCount !== 1 ? 's' : ''}
                    </motion.span>
                  )}
                  {isReady && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary"
                    >
                      <CheckCircle2 size={11} />
                      Ready to download
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Builder ── */}
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 items-start">

            {/* Left: config panel */}
            <div className="glass-card p-5 space-y-6 overflow-auto max-h-[calc(100vh-220px)] scrollbar-hide sticky top-20">

              <ConfigSection title="Choose Template" step={1}>
                <TemplateSelector selected={selectedTemplate} onSelect={handleSelectTemplate} />
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

            {/* Right: code viewer — wallet bar is part of the card */}
            <div className="sticky top-20">
              <CodeViewer
                code={code}
                isReady={isReady}
                filename={downloadFilename}
                contractName={contractName.trim()}
                showWalletBar={isReady}
              />
            </div>

          </div>
        </div>
      </div>
    </EditorContractProvider>
  )
}
