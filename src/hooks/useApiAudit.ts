import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch, getApiBase } from '../lib/apiClient';
import type { AuditEntry } from '../types';

interface ServerAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string | null;
}

type AuditResponse = AuditEntry[] | { auditLogs: ServerAuditLog[] };

function serializeJson(value: unknown): string | undefined {
  if (value == null) return undefined;
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function toAuditEntry(log: ServerAuditLog): AuditEntry {
  return {
    id: log.id,
    timestamp: log.timestamp,
    userId: log.userId,
    userName: log.userId,
    action: log.action as AuditEntry['action'],
    entityType: log.entityType,
    entityId: log.entityId,
    previousValue: serializeJson(log.previousValue),
    newValue: serializeJson(log.newValue),
    reason: log.reason ?? undefined,
  };
}

function unwrapAuditEntries(data: AuditResponse): AuditEntry[] {
  if (Array.isArray(data)) return data;
  return (data.auditLogs ?? []).map(toAuditEntry);
}

export function useApiAudit(projectId: string) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    if (!projectId) {
      if (mountedRef.current) {
        setEntries([]);
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AuditResponse>(`/audit?projectId=${encodeURIComponent(projectId)}`);
      if (mountedRef.current) setEntries(unwrapAuditEntries(data));
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
      const data = await apiFetch<AuditResponse>(
        `/audit?projectId=${encodeURIComponent(projectId)}&entityId=${encodeURIComponent(entityId)}`,
      );
      if (mountedRef.current) setEntries(unwrapAuditEntries(data));
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
      const data = await apiFetch<AuditResponse>(
        `/audit?projectId=${encodeURIComponent(projectId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
      );
      if (mountedRef.current) setEntries(unwrapAuditEntries(data));
    } catch (err: unknown) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : String(err) || 'Failed to fetch audit entries');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [projectId]);

  const exportCsv = useCallback(async () => {
    try {
      const blob = await fetch(
        `${getApiBase()}/audit/export?projectId=${encodeURIComponent(projectId)}&format=csv`,
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
