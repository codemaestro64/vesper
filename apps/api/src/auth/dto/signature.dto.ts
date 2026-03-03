import { UserResponse } from '@/users/dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifySignatureDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString()
  @IsNotEmpty()
  signature!: string;
}

export interface VerifySignatureResponse {
  accessToken: string;
  expiresIn: string;
  user: UserResponse;
}
