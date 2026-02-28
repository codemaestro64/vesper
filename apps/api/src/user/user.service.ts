import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../database/database.module';
import { users, type User } from '@vesper/database';
import { FindOrCreateDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findByWalletAddress(walletAddress: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress.toLowerCase()))
      .get();

    return result ?? null;
  }

  async findOrCreate(dto: FindOrCreateDto): Promise<User> {
    const address = dto.walletAddress.toLowerCase();
    const now = new Date().toISOString();

    const [result] = await this.db
      .insert(users)
      .values({
        walletAddress: address,
        chainId: dto.chainID,
        createdAt: now,
        lastLoginAt: now,
      })
      .onConflictDoUpdate({
        target: users.walletAddress,
        set: {
          lastLoginAt: now,
          chainId: dto.chainID,
        },
      })
      .returning();

    return result;
  }
}
