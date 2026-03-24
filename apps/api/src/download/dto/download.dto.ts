import { IsIn, IsString, MinLength, MaxLength } from 'class-validator';
import type { DownloadRequest, DownloadFormat } from '@vesper/types';

export class DownloadDto implements DownloadRequest {
  @IsString()
  @MinLength(1, { message: 'contractName must not be empty' })
  @MaxLength(64, { message: 'contractName too long' })
  contractName!: string;

  @IsString()
  @MinLength(10, { message: 'code too short to be a valid contract' })
  @MaxLength(200_000, { message: 'code exceeds 200 KB limit' })
  code!: string;

  @IsIn(['hardhat', 'foundry'])
  format!: DownloadFormat;
}
