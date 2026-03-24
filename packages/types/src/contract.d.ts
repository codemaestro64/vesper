import type { Abi } from 'abitype';
export declare const ContractTypes: {
    readonly ERC20: "erc20";
    readonly ERC721: "erc721";
    readonly ERC1155: "erc1155";
    readonly STAKING: "staking";
    readonly GOVERNANCE: "governance";
    readonly MULTISIG: "multisig";
};
export type ContractType = (typeof ContractTypes)[keyof typeof ContractTypes];
export type AccessControl = 'ownable' | 'roles' | 'none';
export type UpgradePattern = 'none' | 'transparent' | 'uups';
export interface FeatureOption {
    id: string;
    label: string;
    description: string;
    requires?: string[];
    conflicts?: string[];
}
export interface ContractTemplate {
    type: ContractType;
    label: string;
    description: string;
    icon: string;
    availableFeatures: FeatureOption[];
    defaultFeatures?: string[];
}
export interface ContractConfig {
    type: ContractType;
    name: string;
    symbol?: string;
    description?: string;
    features: string[];
    access?: AccessControl;
    upgradeable?: UpgradePattern;
    license?: string;
    solidityVersion?: string;
}
export interface RenderContext {
    config: ContractConfig;
    features: Set<string>;
    hasFeature: (id: string) => boolean;
    access: AccessControl;
}
export interface SolidityImport {
    path: string;
    symbol?: string;
}
export interface StateVariable {
    visibility: 'public' | 'private' | 'internal';
    mutability?: 'constant' | 'immutable' | '';
    type: string;
    name: string;
    initialValue?: string;
    comment?: string;
}
export interface ConstructorArg {
    type: string;
    name: string;
    comment?: string;
}
export interface ConstructorBody {
    lines: string[];
}
export interface FunctionDef {
    source: string;
}
export interface EventDef {
    source: string;
}
export interface ErrorDef {
    source: string;
}
export interface ModifierDef {
    source: string;
}
export interface ContractParts {
    license: string;
    solidityVersion: string;
    imports: SolidityImport[];
    inheritances: string[];
    natspecTitle: string;
    natspecNotice: string;
    natspecDev?: string;
    stateVariables: StateVariable[];
    events: EventDef[];
    errors: ErrorDef[];
    modifiers: ModifierDef[];
    constructorArgs: ConstructorArg[];
    constructorNatspec?: string[];
    constructorBody: string[];
    constructorInitializers: string[];
    functions: FunctionDef[];
}
export interface FeatureMixin {
    id: string;
    apply(parts: ContractParts, ctx: RenderContext): void;
}
export interface ContractGenerator {
    type: ContractType;
    baseParts(ctx: RenderContext): ContractParts;
    mixins: FeatureMixin[];
}
export declare enum ContractStatus {
    DRAFT = "draft",
    DEPLOYED = "deployed",
    ARCHIVED = "archived"
}
export interface CreateContractRequest {
    contractType: ContractType;
    name: string;
    symbol?: string;
    initialSupply?: number;
    decimals?: number;
    features?: string[];
    description?: string;
    contractAddress?: string;
    abi?: string;
    network?: string;
}
export interface UpdateContractRequest {
    contractAddress: string;
    abi: Abi;
    status: ContractStatus;
}
export interface ContractResponse {
    id: number;
    name: string;
    contractType: ContractType;
    chainId: number;
    symbol: string | null;
    initialSupply: number | null;
    decimals: number | null;
    features: string[] | null;
    description: string | null;
    address: string | null;
    abi: Abi | null;
    network: string | null;
    status: ContractStatus;
    createdAt: string;
    updatedAt: string | null;
}
//# sourceMappingURL=contract.d.ts.map