// hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { VerifySignatureResponse } from "@vesper/types";

export function useNonce(address: string) {
  return useQuery({
    queryKey: ["nonce", address],
    queryFn: () => authApi.getNonce(address),
    enabled: !!address, // only fetch when address is available
  });
}

export function useVerify() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.verify,
    onSuccess: (data: VerifySignatureResponse) => {
      localStorage.setItem("token", data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
