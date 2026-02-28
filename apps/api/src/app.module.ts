import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

const isProduction = process.env.NODE_ENV === 'production';

const imports = [
  // Core Modules
  ConfigModule,
  DatabaseModule,
  HealthModule,

  // Feature Modules
];

@Module({
  imports: imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
