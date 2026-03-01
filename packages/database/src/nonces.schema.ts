import { sql } from 'drizzle-orm';
import { sqliteTable, text, index, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users.schema';

export const nonces = sqliteTable('nonces', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  nonce: text('nonce').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const noncesIndexes = {
  userIdIdx: index('nonces_user_id_idx').on(nonces.userId),
  nonceIdx: index('nonces_nonce_idx').on(nonces.nonce),
};
export type Nonce = typeof nonces.$inferSelect;
export type NewNonce = typeof nonces.$inferInsert;
