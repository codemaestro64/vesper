import { migrate } from 'drizzle-orm/libsql/migrator';
import { type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

const migrationsFolder = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'production'
    ? '../drizzle' // dist/src/../drizzle = dist/drizzle
    : '../../drizzle', // src/../../drizzle  = packages/database/drizzle
);

export async function runMigrations(
  db: LibSQLDatabase<typeof schema>,
): Promise<void> {
  await migrate(db, { migrationsFolder });
}
