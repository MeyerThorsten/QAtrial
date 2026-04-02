import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../lib/apiClient';
import type { ProjectMeta } from '../types';

interface ServerProject extends ProjectMeta {
  id: string;
}

export function useApiProjects() {
  const [projects, setProjects] = useState<ServerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ServerProject | null>(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<ServerProject[]>('/projects');
      if (mountedRef.current) {
        setProjects(data);
        // Auto-select first project if none selected
        if (!activeProject && data.length > 0) {
          setActiveProject(data[0]);
        }
      }
    } catch (err: unknown) {
      if (mountedRef.current) {
        const msg = err instanceof Error ? err.message : String(err); if (msg.includes('401')) {
          window.location.hash = '#/login';
        }
        setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch projects');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();
    return () => { mountedRef.current = false; };
  }, [fetchAll]);

  const create = useCallback(async (data: Partial<ProjectMeta>) => {
    setError(null);
    try {
      const created = await apiFetch<ServerProject>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await fetchAll();
      setActiveProject(created);
      return created;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to create project');
      throw err;
    }
  }, [fetchAll]);

  const update = useCallback(async (id: string, data: Partial<ProjectMeta>) => {
    setError(null);
    try {
      await apiFetch<ServerProject>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to update project');
      throw err;
    }
  }, [fetchAll]);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/projects/${id}`, { method: 'DELETE' });
      if (activeProject?.id === id) {
        setActiveProject(null);
      }
      await fetchAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err) || 'Failed to delete project');
      throw err;
    }
  }, [fetchAll, activeProject]);

  return {
    projects,
    loading,
    error,
    create,
    update,
    remove,
    activeProject,
    setActiveProject,
    refetch: fetchAll,
  };
}
