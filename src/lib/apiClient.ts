const DEFAULT_API_BASE = 'http://localhost:3001/api';

export function getApiBase(): string {
  const storedApiBase = typeof window !== 'undefined'
    ? localStorage.getItem('qatrial:api-url')
    : null;

  return (storedApiBase || import.meta.env.VITE_API_URL || DEFAULT_API_BASE).replace(/\/$/, '');
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('qatrial:token');
  const res = await fetch(`${getApiBase()}${normalizePath(path)}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || res.statusText);
  }
  return res.json();
}
