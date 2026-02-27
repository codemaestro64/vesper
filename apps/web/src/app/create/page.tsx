'use client'

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ConfigSectionTitle from "@/components/ConfigSectionTitle"
import { ContractTemplate } from "@vesper/types"
import TemplateSelector from "@/components/TemplateSelector"
import FeaturesSelector from "@/components/FeatureSelector"
import { Input } from "@/components/ui/input"
import CodeViewer from "@/components/CodeViewer"
import { generateContractCode } from "@/lib/contract-generator"

const CreatePage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [contractName, setContractName] = useState("")
  const [contractSymbol, setContractSymbol] = useState("")
  const [contractDecimals, setContractDecimals] = useState<number>(18)
  const [contractInitialSupply, setContractInitialSupply] = useState<number>(0)

  const config = useMemo(() => {
    if (!selectedTemplate || !contractName) {
      return null
    }
    
    return {
      type: selectedTemplate.type,
      name: contractName,
      symbol: contractSymbol,
      description: selectedTemplate.description,
      features: selectedFeatures
    }
  }, [selectedTemplate, selectedFeatures, contractName, contractSymbol])

  const code = useMemo(() => {
    if (!config) return '// Select a template and configure your contract';
    return generateContractCode(config)
  }, [config])

  const handleToggleSelectedFeature = (featureID: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureID) 
        ? prev.filter(f => f !== featureID)
        : [...prev, featureID]
    )
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4">
          {/* LEFT: Configuration Column */}
          <div className="space-y-6 glass-card p-4 overflow-auto">
            {/* Choose template section */}
            <div>
              <ConfigSectionTitle 
                title="Choose template"
                preTitle="1"
              />
             
              <div className="glass-cards rounded-xl p-4 space-y-3">
                <TemplateSelector 
                  selected={selectedTemplate} 
                  onSelect={(type) => setSelectedTemplate(type)}
                />
              </div>
            </div>

            {/* Contract Info Section */}
            <AnimatePresence mode="wait">
              {selectedTemplate && (
                <motion.div 
                  key="contract-info"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <ConfigSectionTitle
                      title="Contract Info"
                      preTitle="2"
                    />
                    <div className="glass-card rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {selectedTemplate.type === 'erc20' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input 
                            label="Initial Supply" 
                            placeholder="1000000" 
                            value={contractInitialSupply}
                            onChange={(e) => setContractInitialSupply(Number(e.target.value))}
                          />
                          <Input 
                            label="Decimals" 
                            placeholder="18" 
                            value={contractDecimals}
                            onChange={(e) => setContractDecimals(Number(e.target.value))}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contract Features Section */}
                  {selectedTemplate.availableFeatures && (
                    <div>
                      <ConfigSectionTitle 
                        title="Contract Features"
                        preTitle="3"
                      />
                      <FeaturesSelector 
                        selectedFeatures={selectedFeatures}
                        availableFeatures={selectedTemplate.availableFeatures}
                        onToggleFeature={handleToggleSelectedFeature}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              
            </div>
          </div>

          {/* RIGHT: Code Preview */}
          <div className="">
            {/* Toolbar */}
            <div className="mb-4"></div>
            {/* Code Viewer */}
            <div>
              <CodeViewer code={code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage