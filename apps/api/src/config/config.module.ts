import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { configSchema } from './schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
      validate: (config) => configSchema.parse(config),
    }),
  ],
})
export class ConfigModule {}
