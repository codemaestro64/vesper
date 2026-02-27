import type { ContractTemplate } from "@vesper/types"
import { Coins } from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Contract Template Registry
// ─────────────────────────────────────────────────────────────────────────────

export const contractTemplates: ContractTemplate[] = [
  {
    type: 'erc20',
    label: 'ERC-20 Token',
    description: 'Fungible token standard for currencies, utility tokens, and governance.',
    icon: 'erc20',
    defaultFeatures: [],
    availableFeatures: [
      {
        id: 'mintable',
        label: 'Mintable',
        description: 'Owner can mint new tokens to any address.',
      },
      {
        id: 'burnable',
        label: 'Burnable',
        description: 'Holders can permanently destroy their tokens.',
      },
      {
        id: 'pausable',
        label: 'Pausable',
        description: 'Owner can pause all token transfers in an emergency.',
        requires: ['mintable'], // requires access control (ownable)
      },
      {
        id: 'permit',
        label: 'Permit (EIP-2612)',
        description: 'Gasless approvals via off-chain signatures.',
      },
      {
        id: 'votes',
        label: 'Votes',
        description: 'Token holders can delegate and use tokens for on-chain governance.',
        requires: ['permit'],
      },
      {
        id: 'flash-mint',
        label: 'Flash Mint',
        description: 'Allow flash loans of tokens with zero collateral (ERC-3156).',
      },
      {
        id: 'capped',
        label: 'Capped Supply',
        description: 'Enforce a maximum token supply cap.',
        requires: ['mintable'],
      },
      {
        id: 'taxable',
        label: 'Transfer Tax',
        description: 'Deduct a configurable percentage fee on every transfer.',
      },
    ],
  },

  {
    type: 'erc721',
    label: 'ERC-721 NFT',
    description: 'Non-fungible tokens for unique digital assets, collectibles, and identity.',
    icon: 'erc721',
    defaultFeatures: ['uri-storage'],
    availableFeatures: [
      {
        id: 'mintable',
        label: 'Mintable',
        description: 'Owner can mint new NFTs to any address.',
      },
      {
        id: 'burnable',
        label: 'Burnable',
        description: 'Token owners can permanently destroy their NFTs.',
      },
      {
        id: 'enumerable',
        label: 'Enumerable',
        description: 'On-chain enumeration of all tokens and owner balances.',
        conflicts: ['uri-storage'], // both override _update, complex to combine
      },
      {
        id: 'uri-storage',
        label: 'URI Storage',
        description: 'Store per-token metadata URIs on-chain.',
        conflicts: ['enumerable'],
      },
      {
        id: 'royalties',
        label: 'Royalties (EIP-2981)',
        description: 'Declare a royalty recipient and percentage for secondary sales.',
      },
      {
        id: 'soulbound',
        label: 'Soulbound',
        description: 'Non-transferable tokens — minted to an address and locked forever.',
        conflicts: ['burnable'],
      },
      {
        id: 'pausable',
        label: 'Pausable',
        description: 'Owner can pause all transfers in an emergency.',
      },
      {
        id: 'reveal',
        label: 'Delayed Reveal',
        description: 'Pre-reveal placeholder URI that switches to real metadata after reveal.',
      },
    ],
  },

  {
    type: 'erc1155',
    label: 'Multi-Token',
    description: 'Efficient multi-token standard for both fungible and non-fungible tokens.',
    icon: 'erc1155',
    defaultFeatures: [],
    availableFeatures: [
      {
        id: 'mintable',
        label: 'Mintable',
        description: 'Owner can mint new token ids.',
      },
      {
        id: 'burnable',
        label: 'Burnable',
        description: 'Holders can burn their tokens.',
      },
      {
        id: 'supply',
        label: 'Supply Tracking',
        description: 'Track total supply per token id.',
      },
      {
        id: 'pausable',
        label: 'Pausable',
        description: 'Owner can pause all transfers.',
      },
      {
        id: 'royalties',
        label: 'Royalties (EIP-2981)',
        description: 'Declare a royalty recipient and percentage.',
      },
    ],
  },

  {
    type: 'staking',
    label: 'Staking Contract',
    description: 'Lock ERC-20 tokens to earn yield rewards over time.',
    icon: 'staking',
    defaultFeatures: [],
    availableFeatures: [
      {
        id: 'lock-period',
        label: 'Lock Period',
        description: 'Tokens are locked for a minimum duration before withdrawal.',
      },
      {
        id: 'tiered',
        label: 'Tiered Rewards',
        description: 'Different reward multipliers based on stake amount.',
      },
      {
        id: 'compounding',
        label: 'Auto-compound',
        description: 'Automatically reinvest earned rewards back into the stake.',
      },
      {
        id: 'emergency-withdraw',
        label: 'Emergency Withdraw',
        description: 'Allow users to withdraw principal with a penalty fee in emergencies.',
      },
      {
        id: 'referral',
        label: 'Referral Bonus',
        description: 'Reward users who refer new stakers.',
      },
    ],
  },

  {
    type: 'governance',
    label: 'Governance',
    description: 'On-chain voting and proposal execution for DAOs.',
    icon: 'governance',
    defaultFeatures: ['timelock', 'quorum'],
    availableFeatures: [
      {
        id: 'timelock',
        label: 'Timelock',
        description: 'Delay execution of passed proposals for a safety window.',
      },
      {
        id: 'quorum',
        label: 'Quorum Fraction',
        description: 'Require a minimum percentage of total supply to participate.',
      },
      {
        id: 'delegation',
        label: 'Vote Delegation',
        description: 'Delegate voting power to another address.',
      },
      {
        id: 'veto',
        label: 'Veto Guardian',
        description: 'A guardian address can veto passed proposals within the timelock window.',
      },
    ],
  },

  {
    type: 'multisig',
    label: 'Multi-Sig Wallet',
    description: 'M-of-N wallet requiring multiple owner signatures per transaction.',
    icon: 'multisig',
    defaultFeatures: [],
    availableFeatures: [
      {
        id: 'timelocked',
        label: 'Timelocked Execution',
        description: 'Enforce a delay between confirmation and execution.',
      },
      {
        id: 'daily-limit',
        label: 'Daily Limit',
        description: 'Allow small transactions below a daily limit without full confirmation.',
      },
      {
        id: 'recovery',
        label: 'Social Recovery',
        description: 'Allow guardians to replace a lost owner key.',
      },
      {
        id: 'batching',
        label: 'Batch Transactions',
        description: 'Submit and execute multiple transactions atomically.',
      },
    ],
  },
]

export const templatesByType = Object.fromEntries(
  contractTemplates.map((t) => [t.type, t])
) as Record<string, ContractTemplate>
