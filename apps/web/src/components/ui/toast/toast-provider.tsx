"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ToastItem } from "./toast";
import type { Toast, ToastContextValue } from "./types";

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...opts, id }]);
  }, []);

  const successToast = useCallback(
    (title: string, description?: string) => {
      toast({ variant: "success", title, description });
    },
    [toast],
  );

  const warningToast = useCallback(
    (title: string, description?: string) => {
      toast({ variant: "warning", title, description });
    },
    [toast],
  );

  const errorToast = useCallback(
    (title: string, description?: string) => {
      toast({ variant: "error", title, description });
    },
    [toast],
  );

  return (
    <ToastContext.Provider
      value={{ toast, successToast, warningToast, errorToast }}
    >
      {children}

      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
