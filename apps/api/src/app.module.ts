import * as path from 'node:path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ZodValidationPipe } from 'nestjs-zod';
import { ConfigService } from '@nestjs/config';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    HealthModule,
    // Dynamic import for ServeStatic based on environment
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';
        if (!isProd) return []; // Don't serve our static ssg app files in dev (Next will handle it)

        return [
          {
            rootPath: path.join(__dirname, '..', 'web/out'),
            renderPath: '/*',
          },
        ];
      },
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
