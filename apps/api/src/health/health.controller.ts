import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
} from '@nestjs/terminus';
import { configSchema } from '../config/schema';
import { DatabaseHealthIndicator } from './database.health';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: DatabaseHealthIndicator,
  ) {}

  private run(): Promise<HealthCheckResult> {
    return this.health.check([() => this.database.isHealthy('health')]);
  }

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.run();
  }

  @Get('environment')
  environment(): z.infer<typeof configSchema> {
    if (process.env.NODE_ENV === 'production') throw new NotFoundException();
    return configSchema.parse(process.env);
  }
}
