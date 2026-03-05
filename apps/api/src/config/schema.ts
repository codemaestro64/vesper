import { z } from 'zod';

export const configSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'production']).default('production'),

  // Server
  PORT: z.coerce.number().default(3000),
  APP_DOMAIN: z.string().url(),
  APP_URI: z.string().default('/'),

  // Security
  CORS_ORIGIN: z.string().url().optional(),
  JWT_SECRET: z.string().min(16, 'Secret is too short!'),
  JWT_DURATION: z.string().default('24h'),

  // Blockchain
  SUPPORTED_CHAIN_IDS: z.string().transform((val, ctx): number[] => {
    try {
      const parsed: unknown = JSON.parse(val);
      if (
        !Array.isArray(parsed) ||
        !parsed.every((id): id is number => typeof id === 'number')
      ) {
        throw new Error();
      }
      return parsed;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'SUPPORTED_CHAIN_IDS must be a valid JSON array of numbers (e.g. [1,137])',
      });
      return z.NEVER;
    }
  }),

  // Database
  DATABASE_URL: z.string().min(1),
  DATABASE_AUTH_TOKEN: z.string().min(1).optional(),
});

export type Config = z.infer<typeof configSchema>;
