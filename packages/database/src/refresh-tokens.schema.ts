import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from './users.schema';

export const refreshTokens = sqliteTable('refresh_tokens', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  revokedAt: text('revoked_at'),
  isRevoked: integer('is_revoked', { mode: 'boolean' })
    .notNull()
    .default(false),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const refreshTokensIndexes = {
  userIdIdx: index('refresh_tokens_user_id_idx').on(refreshTokens.userId),
  tokenHashIdx: index('refresh_tokens_token_hash_idx').on(
    refreshTokens.tokenHash,
  ),
};
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
