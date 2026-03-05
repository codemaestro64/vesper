import { IsNotEmpty, IsString } from 'class-validator';
import { GetUserRequest } from '@vesper/types';

export class GetUserDto implements GetUserRequest {
  @IsString()
  @IsNotEmpty()
  walletAddress!: string;
}
