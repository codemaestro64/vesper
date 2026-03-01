import { sql } from 'drizzle-orm';
import { sqliteTable, text, index, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users.schema';

export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  TOKEN_REVOKE = 'TOKEN_REVOKE',
  NONCE_GENERATED = 'NONCE_GENERATED',
}

export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  walletAddress: text('wallet_address'),
  action: text('action', {
    enum: Object.values(AuditAction) as [string, ...string[]],
  })
    .notNull()
    .$type<AuditAction>(),
  metadata: text('metadata'), // JSON string
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const auditLogsIndexes = {
  userIdIdx: index('audit_logs_user_id_idx').on(auditLogs.userId),
  actionIdx: index('audit_logs_action_idx').on(auditLogs.action),
  createdAtIdx: index('audit_logs_created_at_idx').on(auditLogs.createdAt),
};
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
