import type { ContractParts, ContractTemplate, FeatureOption, SolidityImport, StateVariable } from "@vesper/types"
import { contractTemplates } from "./registry"

/** Ensure contract name is a valid Solidity identifier */
export const sanitizeName = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&')
    .trim() || 'MyContract'
}

export const renderConstructor = (parts: ContractParts): string => {
  const lines: string[] = []

  if (parts.constructorNatspec && parts.constructorNatspec.length > 0) {
    lines.push('/**')
    parts.constructorNatspec.forEach((l) => lines.push(` * ${l}`))
    lines.push(' */')
  }

  const args = parts.constructorArgs
    .map((a) => `${a.type} ${a.name}`)
    .join(', ')

  const inits =
    parts.constructorInitializers.length > 0
      ? '\n        ' + parts.constructorInitializers.join('\n        ')
      : ''

  if (parts.constructorBody.length === 0 && parts.constructorInitializers.length === 0) {
    lines.push(`constructor(${args}) {}`)
  } else {
    lines.push(`constructor(${args})${inits}`)
    lines.push('{')
    parts.constructorBody.forEach((l) => lines.push(`    ${l}`))
    lines.push('}')
  }

  return lines.join('\n')
}

export const renderStateVar = (v: StateVariable): string => {
  const parts: string[] = [v.type]
  if (v.mutability) parts.push(v.mutability)
  parts.push(v.visibility)
  parts.push(v.name)
  const decl = parts.filter(Boolean).join(' ')
  const line = v.initialValue ? `${decl} = ${v.initialValue};` : `${decl};`
  return v.comment ? `/// @notice ${v.comment}\n${line}` : line
}

export const dedupeImports = (imports: SolidityImport[]): SolidityImport[] => {
  const seen = new Set<string>()
  return imports.filter((i) => {
    if (seen.has(i.path)) return false
    seen.add(i.path)
    return true
  })
}

export const indent = (code: string, spaces = 4): string => {
  return code
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : ' '.repeat(spaces) + line))
    .join('\n')
}

export const getContractTemplate = (contractType: string): ContractTemplate | undefined => {
  return contractTemplates.find(ct => ct.type === contractType)
} 
