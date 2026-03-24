import { SOL_VERSION } from './constants';

export function hardhatFiles(
  name: string,
  code: string,
): Record<string, string> {
  return {
    // Contract source
    [`contracts/${name}.sol`]: code,

    // Ignition deploy module
    [`ignition/modules/${name}.ts`]: `\
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

export default buildModule('${name}Module', (m) => {
  const contract = m.contract('${name}')
  return { contract }
})
`,
    // Hardhat config
    'hardhat.config.ts': `\
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: '${SOL_VERSION}',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    // ── Testnets ───────────────────────────────────────────────────────────────
    sepolia: {
      url:      process.env.SEPOLIA_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    baseSepolia: {
      url:      process.env.BASE_SEPOLIA_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    arbitrumSepolia: {
      url:      process.env.ARBITRUM_SEPOLIA_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    optimismSepolia: {
      url:      process.env.OPTIMISM_SEPOLIA_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    polygonAmoy: {
      url:      process.env.POLYGON_AMOY_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    // ── Mainnets ──────────────────────────────────────────────────────────────
    mainnet: {
      url:      process.env.MAINNET_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    base: {
      url:      process.env.BASE_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    arbitrum: {
      url:      process.env.ARBITRUM_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    optimism: {
      url:      process.env.OPTIMISM_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
    polygon: {
      url:      process.env.POLYGON_RPC_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [\`0x\${process.env.PRIVATE_KEY}\`] : [],
    },
  },
  etherscan: {
    apiKey: {
      mainnet:         process.env.ETHERSCAN_API_KEY   ?? '',
      sepolia:         process.env.ETHERSCAN_API_KEY   ?? '',
      base:            process.env.BASESCAN_API_KEY    ?? '',
      baseSepolia:     process.env.BASESCAN_API_KEY    ?? '',
      arbitrumOne:     process.env.ARBISCAN_API_KEY    ?? '',
      arbitrumSepolia: process.env.ARBISCAN_API_KEY    ?? '',
      optimisticEthereum: process.env.OPTIMISM_API_KEY ?? '',
      polygon:         process.env.POLYGONSCAN_API_KEY ?? '',
      polygonAmoy:     process.env.POLYGONSCAN_API_KEY ?? '',
    },
  },
}

export default config
`,

    // package.json
    'package.json': JSON.stringify(
      {
        name: `${name.toLowerCase()}-hardhat`,
        version: '1.0.0',
        private: true,
        scripts: {
          compile: 'hardhat compile',
          test: 'hardhat test',
          'deploy:sepolia': `hardhat ignition deploy ./ignition/modules/${name}.ts --network sepolia`,
          'deploy:base': `hardhat ignition deploy ./ignition/modules/${name}.ts --network base`,
          verify: 'hardhat verify',
          clean: 'hardhat clean',
        },
        devDependencies: {
          hardhat: '^2.22.0',
          '@nomicfoundation/hardhat-toolbox': '^5.0.0',
          '@nomicfoundation/hardhat-ignition': '^0.15.0',
          '@nomicfoundation/hardhat-ignition-ethers': '^0.15.0',
          '@nomicfoundation/hardhat-verify': '^2.0.0',
          dotenv: '^16.0.0',
          typescript: '^5.0.0',
          'ts-node': '^10.9.0',
          '@types/node': '^20.0.0',
        },
      },
      null,
      2,
    ),

    // tsconfig
    'tsconfig.json': JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'commonjs',
          esModuleInterop: true,
          strict: true,
          resolveJsonModule: true,
          outDir: 'dist',
        },
      },
      null,
      2,
    ),

    // .env.example
    '.env.example': `\
# ── Deployer ─────────────────────────────────────────────────────────────────
# Raw private key WITHOUT the 0x prefix
PRIVATE_KEY=

# ── RPC URLs — get free keys at https://alchemy.com or https://infura.io ─────
MAINNET_RPC_URL=
SEPOLIA_RPC_URL=
BASE_RPC_URL=
BASE_SEPOLIA_RPC_URL=
ARBITRUM_RPC_URL=
ARBITRUM_SEPOLIA_RPC_URL=
OPTIMISM_RPC_URL=
OPTIMISM_SEPOLIA_RPC_URL=
POLYGON_RPC_URL=
POLYGON_AMOY_RPC_URL=

# ── Block explorer API keys (for contract verification) ───────────────────────
ETHERSCAN_API_KEY=
BASESCAN_API_KEY=
ARBISCAN_API_KEY=
OPTIMISM_API_KEY=
POLYGONSCAN_API_KEY=
`,

    // .gitignore
    '.gitignore': `\
node_modules/
dist/
artifacts/
cache/
typechain-types/
.env
`,

    // README
    'README.md': `\
# ${name} — Hardhat Project

Generated by [Vesper](https://vesper.build).

## Prerequisites

- Node.js ≥ 18
- pnpm (or npm/yarn)

## Setup

\`\`\`bash
pnpm install
cp .env.example .env
# Fill in PRIVATE_KEY and at least one RPC URL
\`\`\`

## Compile

\`\`\`bash
pnpm hardhat compile
\`\`\`

## Test

\`\`\`bash
pnpm hardhat test
\`\`\`

## Deploy

\`\`\`bash
# Testnet (recommended first)
pnpm deploy:sepolia

# Mainnet (real funds — double-check everything)
pnpm deploy:base
\`\`\`

## Verify on block explorer

\`\`\`bash
pnpm hardhat verify --network sepolia <DEPLOYED_ADDRESS>
\`\`\`
`,
  };
}
