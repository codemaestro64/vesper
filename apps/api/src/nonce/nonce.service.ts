import { Injectable, Inject } from '@nestjs/common';
import { eq, and, lt } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { type DrizzleDB, DRIZZLE } from '@/database/database.module';
import { nonces, users } from '@vesper/database';

@Injectable()
export class NonceService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async generate(walletAddress: string): Promise<string> {
    const userResult = await this.db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress.toLowerCase()))
      .limit(1);

    if (!userResult.length) {
      throw new Error(`No user found for wallet address: ${walletAddress}`);
    }

    const userId = userResult[0].id;
    const nonce = randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Delete any previous unused nonces for this user
    await this.db.delete(nonces).where(eq(nonces.userId, userId));

    await this.db.insert(nonces).values({ userId, nonce, expiresAt });

    return nonce;
  }

  async consume(walletAddress: string, nonce: string): Promise<boolean> {
    const now = new Date().toISOString();

    const result = await this.db
      .select({ nonce: nonces })
      .from(nonces)
      .innerJoin(users, eq(nonces.userId, users.id))
      .where(
        and(
          eq(users.walletAddress, walletAddress.toLowerCase()),
          eq(nonces.nonce, nonce),
        ),
      )
      .limit(1);

    if (!result.length) return false;

    const record = result[0].nonce;

    if (record.expiresAt < now) {
      await this.db.delete(nonces).where(eq(nonces.id, record.id));
      return false;
    }

    await this.db.delete(nonces).where(eq(nonces.id, record.id));
    return true;
  }

  async cleanExpired(): Promise<void> {
    const now = new Date().toISOString();
    await this.db.delete(nonces).where(lt(nonces.expiresAt, now));
  }
}
