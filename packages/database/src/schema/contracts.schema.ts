import { sql } from 'drizzle-orm';
import { sqliteTable, text, index, integer } from 'drizzle-orm/sqlite-core';
import { ContractTypes, ContractType, ContractStatus } from '@vesper/types';
import { users } from './users.schema';
import { Abi } from 'abitype';

export const contracts = sqliteTable('contracts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  contractType: text('contract_type', {
    enum: [
      ContractTypes.ERC1155,
      ContractTypes.ERC20,
      ContractTypes.ERC721,
      ContractTypes.GOVERNANCE,
      ContractTypes.MULTISIG,
      ContractTypes.STAKING,
    ],
  })
    .notNull()
    .$type<ContractType>(),
  chainId: integer('chain_id').notNull().default(1), // TODO ensure correctness
  name: text('title').notNull(),
  symbol: text('symbol'),
  initialSupply: integer('initial_supply'),
  decimals: integer('decimals').default(18),
  features: text('features', { mode: 'json' }).$type<string[]>(),
  description: text('description'),
  address: text('address').unique(),
  abi: text('abi', { mode: 'json' }).$type<Abi>(),
  network: text('network'),
  status: text('status')
    .$type<ContractStatus>()
    .notNull()
    .default(ContractStatus.DRAFT),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at'),
});

export const contractsIndexes = {
  ownerIdIdx: index('contracts_owner_id_idx').on(contracts.ownerId),
  statusIdx: index('contracts_status_idx').on(contracts.status),
  contractAddressIdx: index('contracts_address_idx').on(contracts.address),
};

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
