import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class GetNonceDto {
  @IsEthereumAddress()
  address!: string;
}

export class VerifySignatureDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString()
  @IsNotEmpty()
  signature!: string;
}
