import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { type DrizzleDB, DRIZZLE } from '../database/database.module';
import { contracts } from '@vesper/database';
import { CreateContractDto, UpdateContractDto, ContractResponse } from './dto';
import { toContractResponse } from './contracts.mapper';

@Injectable()
export class ContractsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAllByUser(userId: number): Promise<ContractResponse[]> {
    const result = await this.db
      .select()
      .from(contracts)
      .where(eq(contracts.ownerId, userId));

    return result.map(toContractResponse);
  }

  async findOne(id: number, userId: number): Promise<ContractResponse> {
    const contract = await this.db
      .select()
      .from(contracts)
      .where(and(eq(contracts.id, id), eq(contracts.ownerId, userId)))
      .get();

    if (!contract) throw new NotFoundException(`Contract ${id} not found`);
    return toContractResponse(contract);
  }

  async create(
    userId: number,
    dto: CreateContractDto,
  ): Promise<ContractResponse> {
    const now = new Date().toISOString();

    const [contract] = await this.db
      .insert(contracts)
      .values({
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
      })
      .returning();

    return toContractResponse(contract);
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateContractDto,
  ): Promise<ContractResponse> {
    const [contract] = await this.db
      .update(contracts)
      .set({
        ...(dto.contractAddress !== undefined && {
          address: dto.contractAddress,
        }),
        ...(dto.abi !== undefined && { abi: dto.abi }),
        ...(dto.status !== undefined && { status: dto.status }),
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(contracts.id, id), eq(contracts.ownerId, userId)))
      .returning();

    if (!contract) throw new NotFoundException(`Contract ${id} not found`);
    return toContractResponse(contract);
  }
}
