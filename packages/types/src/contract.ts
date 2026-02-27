// ─────────────────────────────────────────────────────────────────────────────
// Core Types — Vesper Contract Generation Engine
// ─────────────────────────────────────────────────────────────────────────────

export type ContractType =
  | 'erc20'
  | 'erc721'
  | 'erc1155'
  | 'staking'
  | 'governance'
  | 'multisig'

export type AccessControl = 'ownable' | 'roles' | 'none'
export type UpgradePattern = 'none' | 'transparent' | 'uups'

// ─────────────────────────────────────────────────────────────────────────────
// Feature registry — each feature id maps to a FeatureMixin
// ─────────────────────────────────────────────────────────────────────────────

export interface FeatureOption {
  id: string
  label: string
  description: string
  /** Features this one requires to also be enabled */
  requires?: string[]
  /** Features this one conflicts with */
  conflicts?: string[]
}

export interface ContractTemplate {
  type: ContractType
  label: string
  description: string
  icon: string
  availableFeatures: FeatureOption[]
  /** Features enabled by default */
  defaultFeatures?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// User-facing config (what the UI collects)
// ─────────────────────────────────────────────────────────────────────────────

export interface ContractConfig {
  type: ContractType
  name: string
  symbol?: string
  description?: string
  features: string[]
  access?: AccessControl
  upgradeable?: UpgradePattern
  license?: string
  solidityVersion?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal rendering context — built from ContractConfig before rendering
// ─────────────────────────────────────────────────────────────────────────────

export interface RenderContext {
  config: ContractConfig
  /** Resolved feature ids after dependency/conflict resolution */
  features: Set<string>
  hasFeature: (id: string) => boolean
  access: AccessControl
}

// ─────────────────────────────────────────────────────────────────────────────
// Template building blocks — each section of a Solidity contract
// ─────────────────────────────────────────────────────────────────────────────

export interface SolidityImport {
  /** e.g. "@openzeppelin/contracts/token/ERC20/ERC20.sol" */
  path: string
  /** Optional — if the import uses a named symbol we track it for deduplication */
  symbol?: string
}

export interface StateVariable {
  visibility: 'public' | 'private' | 'internal'
  mutability?: 'constant' | 'immutable' | ''
  type: string
  name: string
  initialValue?: string
  comment?: string
}

export interface ConstructorArg {
  type: string
  name: string
  comment?: string
}

export interface ConstructorBody {
  /** Lines of Solidity executed in the constructor body */
  lines: string[]
}

export interface FunctionDef {
  /** Full Solidity function source — rendered verbatim */
  source: string
}

export interface EventDef {
  source: string
}

export interface ErrorDef {
  source: string
}

export interface ModifierDef {
  source: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Assembled contract parts — the engine collects these from the template
// and all active mixins, then passes to the renderer
// ─────────────────────────────────────────────────────────────────────────────

export interface ContractParts {
  license: string
  solidityVersion: string
  imports: SolidityImport[]
  /** Additional base contracts e.g. "ERC20Burnable" */
  inheritances: string[]
  natspecTitle: string
  natspecNotice: string
  natspecDev?: string
  stateVariables: StateVariable[]
  events: EventDef[]
  errors: ErrorDef[]
  modifiers: ModifierDef[]
  constructorArgs: ConstructorArg[]
  constructorNatspec?: string[]
  constructorBody: string[]
  /** Initializer call order in constructor e.g. ERC20("Name","SYM") */
  constructorInitializers: string[]
  functions: FunctionDef[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature Mixin — a composable unit that injects into ContractParts
// ─────────────────────────────────────────────────────────────────────────────

export interface FeatureMixin {
  id: string
  /**
   * Apply this mixin to the parts object.
   * Mutates parts in place — push imports, functions, etc.
   */
  apply(parts: ContractParts, ctx: RenderContext): void
}

// ─────────────────────────────────────────────────────────────────────────────
// Contract Generator interface — implemented per ContractType
// ─────────────────────────────────────────────────────────────────────────────

export interface ContractGenerator {
  type: ContractType
  /** Return the base parts before any feature mixins are applied */
  baseParts(ctx: RenderContext): ContractParts
  /** Ordered list of feature mixins this generator supports */
  mixins: FeatureMixin[]
}
