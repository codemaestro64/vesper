export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  // Guard for SSR: localStorage doesn't exist on the server
  const isServer = typeof window === 'undefined';
  const token = !isServer ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error: ${res.status}`);
  }

  return (await res.json()) as T;
}
