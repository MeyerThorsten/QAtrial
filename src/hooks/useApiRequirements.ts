import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../lib/apiClient';
import type { Requirement } from '../types';

type RequirementListResponse = Requirement[] | { requirements: Requirement[] };

function unwrapRequirements(data: RequirementListResponse): Requirement[] {
  return Array.isArray(data) ? data : data.requirements ?? [];
}

export function useApiRequirements(projectId: string) {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    if (!projectId) {
      if (mountedRef.current) {
        setRequirements([]);
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<RequirementListResponse>(`/requirements?projectId=${encodeURIComponent(projectId)}`);
      if (mountedRef.current) setRequirements(unwrapRequirements(data));
    } catch (err: unknown) {
      if (mountedRef.current) {
        const msg = err instanceof Error ? err.message : String(err); if (msg.includes('401')) {
          window.location.hash = '#/login';
        }
        setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch requirements');
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

  const create = useCallback(async (data: Partial<Requirement>) => {
    setError(null);
    try {
      await apiFetch<Requirement>('/requirements', {
        method: 'POST',
        body: JSON.stringify({ ...data, projectId }),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to create requirement');
      throw err;
    }
  }, [projectId, fetchAll]);

  const update = useCallback(async (id: string, data: Partial<Requirement>) => {
    setError(null);
    try {
      await apiFetch<Requirement>(`/requirements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to update requirement');
      throw err;
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/requirements/${id}`, { method: 'DELETE' });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to delete requirement');
      throw err;
    }
  }, [fetchAll]);

  return { requirements, loading, error, create, update, remove, refetch: fetchAll };
}
