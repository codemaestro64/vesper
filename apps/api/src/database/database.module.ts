import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@vesper/database';
import { runMigrations } from '@vesper/database';
import { type LibSQLDatabase } from 'drizzle-orm/libsql';
import { CONFIG } from '@/config/config.keys';

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

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbURL = configService.get<string>(CONFIG.DATABASE_URL)!;
        const dbAuthToken = configService.get<string | undefined>(
          CONFIG.DATABASE_AUTH_TOKEN,
        );

        const db = initDb(dbURL, dbAuthToken);
        await runMigrations(db);

        return db;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
