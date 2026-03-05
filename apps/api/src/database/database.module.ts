import { Global, Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@vesper/database';
import { runMigrations } from '@vesper/database';
import { type LibSQLDatabase } from 'drizzle-orm/libsql';

export const DRIZZLE = Symbol('DRIZZLE');
export type DrizzleDB = LibSQLDatabase<typeof schema>;

function initDb(url: string, authToken?: string): DrizzleDB {
  // Auth token is only needed for remote — local file works without it
  const client = createClient({
    url,
    ...(authToken && { authToken }),
  });

  return drizzle(client, { schema });
}

const logger = new Logger('DatabaseModule');

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbURL = configService.get<string>(
          'DATABASE_URL',
          'file:./database.sqlite',
        );

        const dbAuthToken = configService.get<string | undefined>(
          'DATABASE_AUTH_TOKEN',
        );

        const db = initDb(dbURL, dbAuthToken);
        console.log('Running migrations...');
        await runMigrations(db);
        console.log('Migrations complete.');

        return db;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
