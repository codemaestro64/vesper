"use client";

import { useEffect, useRef } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useSignMessage } from "wagmi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useToast } from "@/components/ui/toast";

export function useWalletAuth() {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const queryClient = useQueryClient();
  const didAuth = useRef<string | null>(null); // prevent double-auth
  const { errorToast, successToast } = useToast();

  const { mutateAsync: verify } = useMutation({
    mutationFn: authApi.verify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  useEffect(() => {
    if (!isConnected || !address) {
      didAuth.current = null;
      return;
    }

    // already authed this address
    if (didAuth.current === address) return;

    async function authenticate() {
      try {
        const { message } = await authApi.getNonce(address!, chainId!);

        const signature = await signMessageAsync({ message });

        await verify({ message, signature });

        didAuth.current = address!;
        successToast("Authentication", "Authentication successful...");
      } catch (err) {
        errorToast(`Authentication", "Authentication failed...`);
        disconnect();
      }
    }

    void authenticate();
  }, [isConnected, address]);
}
