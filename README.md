# Vesper

Vesper is a no-code Solidity smart contract builder for the Web3 ecosystem. Choose from six contract templates — ERC-20 tokens, NFTs, multi-tokens, staking contracts, DAOs, and multi-sigs — then toggle features on and off through a guided UI. Vesper resolves feature dependencies and conflicts automatically, wires together audited [OpenZeppelin v5](https://docs.openzeppelin.com/contracts/5.x/) base contracts under the hood, and generates clean, NatSpec-documented Solidity code ready to deploy with Hardhat, Foundry, or Remix. No wallet, no account, no lock-in — configure and download in under a minute.

---

## Monorepo Structure

Built with [Turborepo](https://turbo.build/repo).

```
vesper/
├── apps/
│   ├── web/          # Next.js frontend (this app)
│   └── api/          # NestJS backend (in progress)
├── packages/
│   └── types/        # Shared TypeScript types
└── turbo.json
```

---

## Apps & Packages

### `apps/web`

Next.js 16 + Tailwind v4 frontend. Two routes:

- `/` — Marketing homepage
- `/create` — Contract builder: template picker → feature configuration → live Solidity preview → download

### `apps/api`

NestJS backend. Not yet implemented — see [TODO](#todo).

### `packages/types`

Shared TypeScript interfaces used across `apps/web` and `apps/api`:

```ts
ContractType       // 'erc20' | 'erc721' | 'erc1155' | 'staking' | 'governance' | 'multisig'
ContractTemplate   // template definition with availableFeatures
ContractConfig     // what the UI collects and passes to the generator
ContractParts      // intermediate representation used by the generator engine
ContractGenerator  // interface each generator file must implement
FeatureMixin       // interface each feature mixin must implement
AccessControl      // 'ownable' | 'roles' | 'none'
```

---

## Getting Started

```bash
# From the repo root
pnpm install

# Run all apps in dev mode
pnpm dev

# Or run just the web app
pnpm --filter web dev
```

---

## Contract Generator

Lives entirely in `apps/web/src/lib/contract-generator`. No API calls — runs client-side.

The pipeline: `ContractConfig` → `resolveFeatures()` → `generator.baseParts()` → feature mixins → `applyAccessControl()` → `renderContract()` → Solidity string.

Each generator exports a `baseParts()` function that returns a skeleton `ContractParts` object, and a `mixins` array. Each enabled feature's mixin pushes into the parts (imports, state vars, functions, etc.). The renderer assembles the final file.

**Feature relationships** are declared on each `FeatureOption`:
- `requires` — auto-enables another feature (e.g. `votes` requires `permit`)
- `conflicts` — skips a feature if a conflicting one was already resolved (e.g. `enumerable` vs `uri-storage`)

**To add a new template:** define it in `registry.ts`, extend `ContractType` in `packages/types`, add a Lucide icon to `TokenIcon.tsx`, create a generator file, register it in `index.ts`.

---

## Tech Stack

| | Package | Version |
|---|---|---|
| Framework | `next` | 16.x |
| Styling | `tailwindcss` | 4.x |
| Animations | `framer-motion` | 12.x |
| Icons | `lucide-react` | 0.575 |
| Variants | `class-variance-authority` | 0.7 |
| State | `@tanstack/react-query` | 5.x |
| Monorepo | `turborepo` | latest |
| Language | `typescript` | 5.x |

---

## TODO

### Wallet & User Accounts
- [ ] Add wallet connection (wagmi / RainbowKit)
- [ ] Create `apps/api` NestJS service with auth via wallet signature
- [ ] User profile — save and name contracts
- [ ] Contract library — list, view, and re-edit saved contracts
- [ ] Share contracts via public link

### Deployment
- [ ] Deploy directly from the app (via ethers.js / viem — no backend needed for testnets)
- [ ] Network selector (mainnet, Sepolia, Base, Arbitrum, etc.)
- [ ] Post-deploy dashboard — address, tx hash, verified link on Etherscan

### Export
- [ ] Download full Hardhat project (contracts, ignition scripts, config, `package.json`)
- [ ] Download full Foundry project (`src/`, `test/`, `foundry.toml`, `Makefile`)
- [ ] Copy ABI alongside `.sol` file

### Backend (`apps/api`)
- [ ] NestJS project scaffold
- [ ] Contracts CRUD endpoints
- [ ] JWT auth via wallet signature (SIWE)
- [ ] PostgreSQL + Prisma schema for saved contracts
- [ ] Rate limiting

### General
- [ ] Dark / light theme toggle
- [ ] Mobile layout improvements on `/create`
- [ ] Unit tests for the contract generator engine
