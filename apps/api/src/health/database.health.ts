import { Injectable, Inject } from '@nestjs/common';
import {
  HealthIndicatorService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { sql } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '@/database/database.module';

@Injectable()
export class DatabaseHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.db.run(sql`SELECT 1`);

      return indicator.up();
    } catch (error: unknown) {
      // Type guard to safely access .message
      const message =
        error instanceof Error ? error.message : 'Unknown database error';

      return indicator.down({ message: message });
    }
  }
}
