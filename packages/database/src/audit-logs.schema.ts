import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  index,
} from 'drizzle-orm/sqlite-core';

export const auditLogs = sqliteTable('audit_logs', {
    id: text('id').primaryKey(),
    userId: text('user_id'),
    walletAddress: text('wallet_address'),
    action: text('action', {
      enum: ['LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', 'TOKEN_REFRESH', 'TOKEN_REVOKE', 'NONCE_GENERATED'],
    }).notNull(),
    metadata: text('metadata'),  // JSON string
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
})

export const auditLogsIndexes = {
  userIdIdx: index('audit_logs_user_id_idx').on(auditLogs.userId),
  actionIdx: index('audit_logs_action_idx').on(auditLogs.action),
  createdAtIdx: index('audit_logs_created_at_idx').on(auditLogs.createdAt),
}
export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert
