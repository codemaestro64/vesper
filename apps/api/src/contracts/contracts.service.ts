import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { type DrizzleDB, DRIZZLE } from '../database/database.module';
import { contracts, Contract } from '@vesper/database';
import { CreateContractDto, UpdateContractDto } from './dto/contract.dto';

@Injectable()
export class ContractsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  findAllByUser(userId: number): Promise<Contract[]> {
    return this.db
      .select()
      .from(contracts)
      .where(eq(contracts.ownerId, userId));
  }

  async findOne(id: number, userId: number): Promise<Contract> {
    const rows = await this.db
      .select()
      .from(contracts)
      .where(and(eq(contracts.id, id), eq(contracts.ownerId, userId)))
      .limit(1);

    if (!rows.length) throw new NotFoundException(`Contract ${id} not found`);
    return rows[0];
  }

  async create(userId: number, dto: CreateContractDto): Promise<Contract> {
    const now = new Date().toISOString();

    const res = await this.db.insert(contracts).values({
      ownerId: userId,
      contractType: dto.contractType,
      name: dto.name,
      symbol: dto.symbol ?? null,
      initialSupply: dto.initialSupply ?? null,
      decimals: dto.decimals ?? null,
      features: dto.features ?? [],
      description: dto.description ?? '',
      network: dto.network,
      status: 'draft',
      createdAt: now,
    });

    return this.findOne(Number(res.lastInsertRowid), userId);
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateContractDto,
  ): Promise<Contract> {
    await this.findOne(id, userId); // ownership check

    const now = new Date().toISOString();

    await this.db
      .update(contracts)
      .set({
        abi: dto.abi,
        address: dto.contractAddress,
        updatedAt: now,
      })
      .where(and(eq(contracts.id, id), eq(contracts.ownerId, userId)));

    return this.findOne(id, userId);
  }
}
