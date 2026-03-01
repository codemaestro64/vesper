import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../database/database.module';
import { users, type User } from '@vesper/database';
import { FindOrCreateDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findById(id: number): Promise<User | null> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] ?? null;
  }

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
        chainId: dto.chainId,
        createdAt: now,
        lastLoginAt: now,
      })
      .onConflictDoUpdate({
        target: users.walletAddress,
        set: {
          lastLoginAt: now,
          chainId: dto.chainId,
        },
      })
      .returning();

    return result;
  }
}
