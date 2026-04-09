import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '../lib/apiClient';
import type { ProjectMeta } from '../types';

interface ServerProject extends ProjectMeta {
  id: string;
}

type ProjectListResponse = ServerProject[] | { projects: ServerProject[] };
type ProjectResponse = ServerProject | { project: ServerProject };

function unwrapProjects(data: ProjectListResponse): ServerProject[] {
  return Array.isArray(data) ? data : data.projects ?? [];
}

function unwrapProject(data: ProjectResponse): ServerProject {
  return 'project' in data ? data.project : data;
}

export function useApiProjects(enabled = true) {
  const [projects, setProjects] = useState<ServerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ServerProject | null>(null);
  const mountedRef = useRef(true);
  const activeProjectRef = useRef<ServerProject | null>(null);

  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  const fetchAll = useCallback(async () => {
    if (!enabled) {
      if (mountedRef.current) {
        setProjects([]);
        setActiveProject(null);
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = unwrapProjects(await apiFetch<ProjectListResponse>('/projects'));
      if (mountedRef.current) {
        setProjects(data);
        // Auto-select first project if none selected
        if (!activeProjectRef.current && data.length > 0) {
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
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();
    return () => { mountedRef.current = false; };
  }, [fetchAll]);

  const create = useCallback(async (data: Partial<ProjectMeta>) => {
    setError(null);
    try {
      const created = unwrapProject(await apiFetch<ProjectResponse>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }));
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
      await apiFetch<ProjectResponse>(`/projects/${id}`, {
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
