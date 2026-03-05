import { IsString, IsNotEmpty } from 'class-validator';
import { VerifySignatureRequest } from '@vesper/types';

export class VerifySignatureDto implements VerifySignatureRequest {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString()
  @IsNotEmpty()
  signature!: string;
}
