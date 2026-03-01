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
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name?: string;

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
  bytecode?: string;

  @IsOptional()
  @IsString()
  network?: string;

  @IsOptional()
  @IsEnum(['draft', 'deployed', 'archived'])
  status?: 'draft' | 'deployed' | 'archived';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
