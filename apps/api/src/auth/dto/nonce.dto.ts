import { IsEthereumAddress, IsNotEmpty, IsNumber } from 'class-validator';
import { GetNonceRequest } from '@vesper/types';

export class GetNonceDto implements GetNonceRequest {
  @IsEthereumAddress()
  address!: string;

  @IsNumber()
  @IsNotEmpty()
  chainId!: number;
}
