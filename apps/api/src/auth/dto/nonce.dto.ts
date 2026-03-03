import { IsEthereumAddress } from 'class-validator';

export class GetNonceDto {
  @IsEthereumAddress()
  address!: string;
}

export interface NonceResponse {
  nonce: string;
  message: string;
}
