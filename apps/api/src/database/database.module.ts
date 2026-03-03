import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@vesper/database';
import { runMigrations } from '@vesper/database';

export const DRIZZLE = Symbol('DRIZZLE');
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

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
        const client = createClient({ url: dbURL });
        const db = drizzle(client, { schema });
        await runMigrations(db);

        return db;
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
