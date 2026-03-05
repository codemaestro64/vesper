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
import {
  CreateContractRequest,
  UpdateContractRequest,
  ContractStatus,
} from '@vesper/types';
import type { Abi } from 'abitype';

export class CreateContractDto implements CreateContractRequest {
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
  symbol: string | undefined;

  @IsOptional()
  @IsInt()
  @Min(0)
  initialSupply: number | undefined;

  // Validate decimals ONLY if contractType is ERC20
  @ValidateIf((o: CreateContractDto) => o.contractType === ContractTypes.ERC20)
  @IsInt()
  @Min(0)
  @Max(18)
  @IsNotEmpty()
  decimals: number | undefined;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features: string[] | undefined;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description: string | undefined;

  @IsOptional()
  @IsEthereumAddress()
  contractAddress: string | undefined;

  @IsOptional()
  @IsString()
  abi: string | undefined;

  @IsOptional()
  @IsString()
  network: string | undefined;
}

export class UpdateContractDto implements UpdateContractRequest {
  @IsOptional()
  @IsEthereumAddress()
  contractAddress!: string;

  @IsOptional()
  @IsString()
  abi!: Abi;

  @IsOptional()
  @IsEnum(ContractStatus)
  status!: ContractStatus;
}
