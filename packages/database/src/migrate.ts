import { migrate } from 'drizzle-orm/libsql/migrator';
import { type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

export async function runMigrations(
  db: LibSQLDatabase<typeof schema>,
): Promise<void> {
  await migrate(db, {
    migrationsFolder: path.resolve(__dirname, '../drizzle'),
  });
}
