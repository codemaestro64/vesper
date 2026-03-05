export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
