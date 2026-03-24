import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { contractApi } from '@/lib/api/contract';
import { CreateContractRequest, ContractResponse } from '@vesper/types';
import { useToast } from '@/components/ui/toast';

/**
 * Fetch a single contract by ID
 * Returns a QueryResult containing the ContractResponse or an Error
 */
export function useContract(
  id?: string,
): UseQueryResult<ContractResponse, Error> {
  return useQuery({
    queryKey: ['contract', id],
    // Ensures it won't run without the ID
    queryFn: () => contractApi.getById(id!),
    enabled: !!id,
    retry: 1,
  });
}

/**
 * Interface for the return value of useCreateContract
 */
interface CreateContractHook {
  createContract: (data: CreateContractRequest) => void;
  isCreating: boolean;
  isCreateError: boolean;
}

export function useCreateContract(): CreateContractHook {
  const queryClient = useQueryClient();
  const { errorToast, successToast } = useToast();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: CreateContractRequest) => contractApi.save(data),
    onSuccess: (newContract: ContractResponse) => {
      void queryClient.invalidateQueries({ queryKey: ['contracts'] });
      successToast(`Contract "${newContract.name}" saved.`);
    },
    onError: (err: Error) => {
      errorToast(err.message || 'Failed to save contract.');
    },
  });

  return {
    createContract: mutate,
    isCreating: isPending,
    isCreateError: isError,
  };
}

/**
 * Delete a contract
 * Returns the full MutationResult to give the component maximum control
 */
export function useDeleteContract(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  const { errorToast, successToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => contractApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Use 'void' for floating promises to keep the linter happy
      void queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.removeQueries({ queryKey: ['contract', deletedId] });

      successToast('Contract deleted successfully.');
    },
    onError: (err: Error) => {
      errorToast(err.message || 'Could not delete contract.');
    },
  });
}
