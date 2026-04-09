import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../lib/apiClient';
import type { Test } from '../types';

type TestListResponse = Test[] | { tests: Test[] };

function unwrapTests(data: TestListResponse): Test[] {
  return Array.isArray(data) ? data : data.tests ?? [];
}

export function useApiTests(projectId: string) {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    if (!projectId) {
      if (mountedRef.current) {
        setTests([]);
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<TestListResponse>(`/tests?projectId=${encodeURIComponent(projectId)}`);
      if (mountedRef.current) setTests(unwrapTests(data));
    } catch (err: unknown) {
      if (mountedRef.current) {
        const msg = err instanceof Error ? err.message : String(err); if (msg.includes('401')) {
          window.location.hash = '#/login';
        }
        setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch tests');
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

  const create = useCallback(async (data: Partial<Test>) => {
    setError(null);
    try {
      await apiFetch<Test>('/tests', {
        method: 'POST',
        body: JSON.stringify({ ...data, projectId }),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to create test');
      throw err;
    }
  }, [projectId, fetchAll]);

  const update = useCallback(async (id: string, data: Partial<Test>) => {
    setError(null);
    try {
      await apiFetch<Test>(`/tests/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to update test');
      throw err;
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/tests/${id}`, { method: 'DELETE' });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to delete test');
      throw err;
    }
  }, [fetchAll]);

  return { tests, loading, error, create, update, remove, refetch: fetchAll };
}
