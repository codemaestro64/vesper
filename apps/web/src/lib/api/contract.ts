import { apiFetch, BASE_URL } from '@/lib/api/client';
import {
  ContractResponse,
  CreateContractRequest,
  DownloadFormat,
} from '@vesper/types';

interface ScaffoldPayload {
  contractName: string;
  code: string;
  format: DownloadFormat;
}

async function downloadScaffold(payload: ScaffoldPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/download`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown server error');
    throw new Error(text);
  }

  // Prefer the server-set filename; fall back to a sensible default
  const disposition = res.headers.get('Content-Disposition') ?? '';
  const match = disposition.match(/filename="([^"]+)"/);
  const filename =
    match?.[1] ?? `${payload.contractName}-${payload.format}.zip`;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const contractApi = {
  // Saves a new contract by sending a POST request with the request body
  save: (req: CreateContractRequest): Promise<ContractResponse> =>
    apiFetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    }),

  // Fetch a specific contract by its ID
  getById: (id: string): Promise<ContractResponse> =>
    apiFetch(`/api/contracts/${id}`),

  // DELETE a contract
  delete: (id: string): Promise<void> =>
    apiFetch(`/api/contracts/${id}`, { method: 'DELETE' }),

  downloadSol(code: string, filename: string): void {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  downloadHardhat(contractName: string, code: string): Promise<void> {
    return downloadScaffold({ contractName, code, format: 'hardhat' });
  },

  downloadFoundry(contractName: string, code: string): Promise<void> {
    return downloadScaffold({ contractName, code, format: 'foundry' });
  },
};
