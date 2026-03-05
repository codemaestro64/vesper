import { Contract } from '@vesper/database';
import { ContractResponse } from '@vesper/types';

export function toContractResponse(contract: Contract): ContractResponse {
  return {
    id: contract.id,
    contractType: contract.contractType,
    chainId: contract.chainId,
    name: contract.name,
    symbol: contract.symbol,
    initialSupply: contract.initialSupply,
    decimals: contract.decimals,
    features: contract.features,
    description: contract.description,
    address: contract.address,
    abi: contract.abi,
    network: contract.network,
    status: contract.status ?? 'draft',
    createdAt: contract.createdAt,
    updatedAt: contract.updatedAt,
  };
}
