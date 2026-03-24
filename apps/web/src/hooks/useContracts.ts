import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contractApi } from "@/lib/api/contract";
import { CreateContractRequest } from "@vesper/types";
import { useToast } from "@/components/ui/toast";

// Fetch a single contract by ID
export function useContract(id?: string) {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: () => contractApi.getById(id!),
    enabled: !!id, // Only run if ID is provided
    retry: 1,      // Don't spam the server if 404
  });
}

// Save a contract
export function useCreateContract() {
  const queryClient = useQueryClient();
  const { errorToast, successToast } = useToast();


  const { mutate, isPending, isError, } = useMutation({
    mutationFn: (data: CreateContractRequest) => contractApi.save(data),
    onSuccess: (newContract) => {
      // Refresh the list of contracts
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      successToast(`Contract "${newContract.name}" saved.`);
    },
    onError: (err: any) => {
      errorToast(err.message || "Failed to save contract.");
    },
  });

  return {
    createContract: mutate,
    isCreating: isPending,
    isCreateError:isError
  }
}

// Delete a contract
export function useDeleteContract() {
  const queryClient = useQueryClient();
  const { errorToast, successToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => contractApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Update cache: remove the item from the list without a full refetch
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      // remove the specific query for this contract
      queryClient.removeQueries({ queryKey: ["contract", deletedId] });
      
      successToast("Contract deleted successfully.");
    },
    onError: (err: any) => {
      errorToast(err.message || "Could not delete contract.");
    },
  });
}