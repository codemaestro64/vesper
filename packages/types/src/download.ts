export type DownloadFormat = 'hardhat' | 'foundry';

export interface DownloadRequest {
  contractName: string;
  code: string;
  format: DownloadFormat;
}
