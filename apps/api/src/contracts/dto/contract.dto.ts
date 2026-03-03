import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsArray,
  MaxLength,
  IsEnum,
  IsEthereumAddress,
  IsInt,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { ContractTypes, type ContractType } from '@vesper/types';
import type { Abi } from 'abitype';

export class CreateContractDto {
  @ApiProperty({ enum: ContractTypes })
  @IsIn(Object.values(ContractTypes))
  @IsNotEmpty()
  contractType!: ContractType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ValidateIf((o: CreateContractDto) => o.contractType === ContractTypes.ERC20)
  @IsString()
  @IsNotEmpty({ message: 'Symbol is required for ERC20 contracts' })
  @MaxLength(10)
  symbol?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  initialSupply?: number;

  // Validate decimals ONLY if contractType is ERC20
  @ValidateIf((o: CreateContractDto) => o.contractType === ContractTypes.ERC20)
  @IsInt()
  @Min(0)
  @Max(18)
  @IsNotEmpty()
  decimals?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEthereumAddress()
  contractAddress?: string;

  @IsOptional()
  @IsString()
  abi?: string;

  @IsOptional()
  @IsString()
  network?: string;
}

export class UpdateContractDto {
  @IsOptional()
  @IsEthereumAddress()
  contractAddress?: string;

  @IsOptional()
  @IsString()
  abi?: Abi;

  @IsOptional()
  @IsEnum(['draft', 'deployed'])
  status?: 'draft' | 'deployed';
}

export interface ContractResponse {
  id: number;
  name: string;
  contractType: ContractType;
  chainId: number;
  symbol: string | null;
  initialSupply: number | null;
  decimals: number | null;
  features: string[] | null;
  description: string | null;
  address: string | null;
  abi: Abi | null;
  network: string | null;
  status: 'draft' | 'deployed';
  createdAt: string;
  updatedAt: string | null;
}
