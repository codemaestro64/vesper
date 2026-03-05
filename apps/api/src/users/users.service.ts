import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '@/database/database.module';
import { users } from '@vesper/database';
import { GetUserDto, UserResponse } from './dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async find(walletAddress: string): Promise<UserResponse> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress.toLowerCase()))
      .get();

    if (!result)
      throw new NotFoundException(`User (${walletAddress} not found`);

    return result;
  }

  async findOrCreate(dto: GetUserDto): Promise<UserResponse> {
    const address = dto.walletAddress.toLowerCase();
    const now = new Date().toISOString();

    const [result] = await this.db
      .insert(users)
      .values({
        walletAddress: address,
        createdAt: now,
        lastLoginAt: now,
      })
      .onConflictDoUpdate({
        target: users.walletAddress,
        set: {
          lastLoginAt: now,
        },
      })
      .returning();

    return result;
  }
}
