import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../lib/apiClient';
import type { CAPARecord } from '../store/useCAPAStore';

export function useApiCapa(projectId: string) {
  const [records, setRecords] = useState<CAPARecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<CAPARecord[]>(`/capa?projectId=${encodeURIComponent(projectId)}`);
      if (mountedRef.current) setRecords(data);
    } catch (err: unknown) {
      if (mountedRef.current) {
        const msg = err instanceof Error ? err.message : String(err); if (msg.includes('401')) {
          window.location.hash = '#/login';
        }
        setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch CAPA records');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();
    return () => { mountedRef.current = false; };
  }, [fetchAll]);

  const create = useCallback(async (data: Partial<CAPARecord>) => {
    setError(null);
    try {
      await apiFetch<CAPARecord>('/capa', {
        method: 'POST',
        body: JSON.stringify({ ...data, projectId }),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to create CAPA record');
      throw err;
    }
  }, [projectId, fetchAll]);

  const update = useCallback(async (id: string, data: Partial<CAPARecord>) => {
    setError(null);
    try {
      await apiFetch<CAPARecord>(`/capa/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to update CAPA record');
      throw err;
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/capa/${id}`, { method: 'DELETE' });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to delete CAPA record');
      throw err;
    }
  }, [fetchAll]);

  return { records, loading, error, create, update, remove, refetch: fetchAll };
}
