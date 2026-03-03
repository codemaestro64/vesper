import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  walletAddress: text('wallet_address').notNull().unique(),
  ens: text('ens'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  lastLoginAt: text('last_login_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  bannedAt: text('banned_at'),
});

export const usersIndexes = {
  walletAddressIdx: index('wallet_address_idx').on(users.walletAddress),
};

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
