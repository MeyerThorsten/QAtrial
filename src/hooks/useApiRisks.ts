import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../lib/apiClient';
import type { RiskAssessment } from '../types';

type RiskListResponse = RiskAssessment[] | { risks: RiskAssessment[] };

function unwrapRisks(data: RiskListResponse): RiskAssessment[] {
  return Array.isArray(data) ? data : data.risks ?? [];
}

export function useApiRisks(projectId: string) {
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<RiskListResponse>(`/risks?projectId=${encodeURIComponent(projectId)}`);
      if (mountedRef.current) setAssessments(unwrapRisks(data));
    } catch (err: unknown) {
      if (mountedRef.current) {
        const msg = err instanceof Error ? err.message : String(err); if (msg.includes('401')) {
          window.location.hash = '#/login';
        }
        setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch risk assessments');
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

  const create = useCallback(async (data: Partial<RiskAssessment>) => {
    setError(null);
    try {
      await apiFetch<RiskAssessment>('/risks', {
        method: 'POST',
        body: JSON.stringify({ ...data, projectId }),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to create risk assessment');
      throw err;
    }
  }, [projectId, fetchAll]);

  const update = useCallback(async (id: string, data: Partial<RiskAssessment>) => {
    setError(null);
    try {
      await apiFetch<RiskAssessment>(`/risks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to update risk assessment');
      throw err;
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/risks/${id}`, { method: 'DELETE' });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to delete risk assessment');
      throw err;
    }
  }, [fetchAll]);

  return { assessments, loading, error, create, update, remove, refetch: fetchAll };
}
