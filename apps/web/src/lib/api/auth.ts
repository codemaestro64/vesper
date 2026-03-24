import { apiFetch } from '@/lib/api/client';
import {
  NonceResponse,
  VerifySignatureRequest,
  VerifySignatureResponse,
} from '@vesper/types';

export const authApi = {
  getNonce: (address: string, chainId: number): Promise<NonceResponse> =>
    apiFetch(`/api/auth/nonce?address=${address}&chainId=${chainId}`),

  verify: (data: VerifySignatureRequest): Promise<VerifySignatureResponse> =>
    apiFetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
};
