import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('production'),

  // Ports
  PORT: z.coerce.number().default(3000),

  // URLs
  PUBLIC_URL: z.string().url(),
  STORAGE_URL: z.string().url(),

  // Database (Prisma)
  DATABASE_URL: z.string().url().startsWith('postgresql://'),

  // Authentication Secrets
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

export type Config = z.infer<typeof configSchema>;
