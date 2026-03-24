import { apiFetch } from "@/lib/api/client";
import { ContractResponse, CreateContractRequest } from "@vesper/types";

export const contractApi = {
  // Saves a new contract by sending a POST request with the request body
  save: (req: CreateContractRequest): Promise<ContractResponse> =>
    apiFetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    }),

  // Fetch a specific contract by its ID
  getById: (id: string): Promise<ContractResponse> =>
    apiFetch(`/api/contracts/${id}`),

  // DELETE a contract
  delete: (id: string): Promise<void> =>
    apiFetch(`/api/contracts/${id}`, { method: "DELETE" }),
};