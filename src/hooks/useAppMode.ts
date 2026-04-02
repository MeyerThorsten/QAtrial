import { useState, useCallback, useMemo } from 'react';

export type AppMode = 'standalone' | 'server';

const MODE_KEY = 'qatrial:mode';
const API_URL_KEY = 'qatrial:api-url';

function getInitialMode(): AppMode {
  const stored = localStorage.getItem(MODE_KEY);
  if (stored === 'standalone' || stored === 'server') return stored;
  // If VITE_API_URL is set, default to server mode
  if (import.meta.env.VITE_API_URL) return 'server';
  return 'standalone';
}

function getInitialApiUrl(): string | null {
  return localStorage.getItem(API_URL_KEY) || import.meta.env.VITE_API_URL || null;
}

export function useAppMode() {
  const [mode, setMode] = useState<AppMode>(getInitialMode);
  const [apiUrl, setApiUrl] = useState<string | null>(getInitialApiUrl);

  const setServerMode = useCallback((url: string) => {
    localStorage.setItem(MODE_KEY, 'server');
    localStorage.setItem(API_URL_KEY, url);
    setMode('server');
    setApiUrl(url);
  }, []);

  const setStandaloneMode = useCallback(() => {
    localStorage.setItem(MODE_KEY, 'standalone');
    localStorage.removeItem(API_URL_KEY);
    setMode('standalone');
    setApiUrl(null);
  }, []);

  return useMemo(
    () => ({ mode, apiUrl, setServerMode, setStandaloneMode }),
    [mode, apiUrl, setServerMode, setStandaloneMode],
  );
}
