import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../lib/apiClient';
import type { AuditEntry } from '../types';

export function useApiAudit(projectId: string) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AuditEntry[]>(`/audit?projectId=${encodeURIComponent(projectId)}`);
      if (mountedRef.current) setEntries(data);
    } catch (err: unknown) {
      if (mountedRef.current) {
        const msg = err instanceof Error ? err.message : String(err); if (msg.includes('401')) {
          window.location.hash = '#/login';
        }
        setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch audit entries');
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

  const fetchByEntity = useCallback(async (entityId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AuditEntry[]>(
        `/audit?projectId=${encodeURIComponent(projectId)}&entityId=${encodeURIComponent(entityId)}`,
      );
      if (mountedRef.current) setEntries(data);
    } catch (err: unknown) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch audit entries');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [projectId]);

  const fetchByDateRange = useCallback(async (from: string, to: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AuditEntry[]>(
        `/audit?projectId=${encodeURIComponent(projectId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      );
      if (mountedRef.current) setEntries(data);
    } catch (err: unknown) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch audit entries');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [projectId]);

  const exportCsv = useCallback(async () => {
    try {
      const blob = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/audit/export?projectId=${encodeURIComponent(projectId)}&format=csv`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('qatrial:token') || ''}`,
          },
        },
      ).then((r) => r.blob());

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-trail-${projectId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to export audit trail');
    }
  }, [projectId]);

  return { entries, loading, error, fetchByEntity, fetchByDateRange, exportCsv, refetch: fetchAll };
}
