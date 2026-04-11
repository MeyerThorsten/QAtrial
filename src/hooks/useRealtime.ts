import { useState, useEffect, useRef, useCallback } from 'react';
import { getApiBase } from '../lib/apiClient';

interface PresenceUser {
  userId: string;
  userName?: string;
  entityType?: string;
  entityId?: string;
  lastSeen: string;
  status: 'active' | 'idle';
}

interface RealtimeEvent {
  event: string;
  data: any;
}

export function useRealtime(projectId: string) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('qatrial:token') : null;

  // Connect to SSE
  useEffect(() => {
    if (!projectId || !token) return;

    const apiBase = getApiBase();
    const url = `${apiBase}/realtime/events?token=${encodeURIComponent(token)}&projectId=${encodeURIComponent(projectId)}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener('connected', (_e: MessageEvent) => {
      setConnected(true);
    });

    es.addEventListener('user.presence', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (Array.isArray(data.users)) {
          setOnlineUsers(data.users.map((u: any) => ({
            ...u,
            status: new Date(u.lastSeen).getTime() > Date.now() - 60 * 1000 ? 'active' : 'idle',
          })));
        } else if (data.userId) {
          // Single user update
          setOnlineUsers((prev) => {
            const existing = prev.findIndex((u) => u.userId === data.userId);
            const user: PresenceUser = {
              userId: data.userId,
              userName: data.userName,
              entityType: data.entityType,
              entityId: data.entityId,
              lastSeen: data.lastSeen,
              status: 'active',
            };
            if (existing >= 0) {
              const copy = [...prev];
              copy[existing] = user;
              return copy;
            }
            return [...prev, user];
          });
        }
      } catch {
        // ignore parse errors
      }
    });

    es.addEventListener('entity.updated', (e: MessageEvent) => {
      try {
        setLastEvent({ event: 'entity.updated', data: JSON.parse(e.data) });
      } catch {}
    });

    es.addEventListener('entity.created', (e: MessageEvent) => {
      try {
        setLastEvent({ event: 'entity.created', data: JSON.parse(e.data) });
      } catch {}
    });

    es.addEventListener('entity.deleted', (e: MessageEvent) => {
      try {
        setLastEvent({ event: 'entity.deleted', data: JSON.parse(e.data) });
      } catch {}
    });

    es.addEventListener('comment.new', (e: MessageEvent) => {
      try {
        setLastEvent({ event: 'comment.new', data: JSON.parse(e.data) });
      } catch {}
    });

    es.onerror = () => {
      setConnected(false);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
      setConnected(false);
    };
  }, [projectId, token]);

  // Heartbeat
  const sendHeartbeat = useCallback(
    async (entityType?: string, entityId?: string) => {
      if (!token || !projectId) return;
      try {
        const apiBase = getApiBase();
        await fetch(`${apiBase}/presence/heartbeat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectId, entityType, entityId }),
        });
      } catch {
        // silent
      }
    },
    [token, projectId]
  );

  useEffect(() => {
    if (!projectId || !token) return;

    // Send initial heartbeat
    sendHeartbeat();

    // Send heartbeat every 30s
    heartbeatRef.current = setInterval(() => sendHeartbeat(), 30000);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [projectId, token, sendHeartbeat]);

  return {
    onlineUsers,
    connected,
    lastEvent,
    sendHeartbeat,
  };
}
