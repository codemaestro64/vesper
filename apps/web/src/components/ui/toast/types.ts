export type ToastVariant = 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  successToast: (title: string, description?: string) => void;
  warningToast: (title: string, description?: string) => void;
  errorToast: (title: string, description?: string) => void;
}
