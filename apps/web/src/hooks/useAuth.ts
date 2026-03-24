// hooks/useAuth.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { VerifySignatureResponse } from '@vesper/types';

export function useNonce(
  address: string,
  chainId: number,
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['nonce', address],
    queryFn: () => authApi.getNonce(address, chainId),
    enabled: !!address,
  });
}

export function useVerify(): UseMutationResult<
  VerifySignatureResponse,
  Error,
  any
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.verify,
    onSuccess: (data: VerifySignatureResponse) => {
      localStorage.setItem('token', data.accessToken);
      void queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useLogout(): UseMutationResult<unknown, Error, void, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
