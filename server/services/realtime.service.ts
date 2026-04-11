import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';

interface SSEClient {
  id: string;
  userId: string;
  projectId: string;
  controller: ReadableStreamDefaultController<string> | null;
  send: (event: string, data: any) => void;
}

class RealtimeService {
  private clients: Map<string, SSEClient> = new Map();

  createSSEStream(c: Context, clientId: string, userId: string, projectId: string) {
    return streamSSE(c, async (stream) => {
      const client: SSEClient = {
        id: clientId,
        userId,
        projectId,
        controller: null,
        send: (event: string, data: any) => {
          try {
            stream.writeSSE({ event, data: JSON.stringify(data), id: Date.now().toString() });
          } catch {
            // client disconnected
          }
        },
      };

      this.clients.set(clientId, client);

      // Send initial connection event
      client.send('connected', { clientId, timestamp: new Date().toISOString() });

      // Send current presence
      const presence = this.getPresence(projectId);
      client.send('user.presence', { users: presence });

      // Keep alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          client.send('heartbeat', { timestamp: new Date().toISOString() });
        } catch {
          clearInterval(heartbeat);
          this.removeClient(clientId);
        }
      }, 30000);

      // Wait for abort
      try {
        await new Promise<void>((resolve) => {
          stream.onAbort(() => {
            resolve();
          });
        });
      } finally {
        clearInterval(heartbeat);
        this.removeClient(clientId);
      }
    });
  }

  removeClient(id: string): void {
    const client = this.clients.get(id);
    if (client) {
      this.clients.delete(id);
      // Broadcast presence update to remaining clients in same project
      this.broadcast(client.projectId, 'user.presence', {
        users: this.getPresence(client.projectId),
      });
    }
  }

  broadcast(projectId: string, event: string, data: any): void {
    for (const [, client] of this.clients) {
      if (client.projectId === projectId) {
        client.send(event, data);
      }
    }
  }

  broadcastAll(event: string, data: any): void {
    for (const [, client] of this.clients) {
      client.send(event, data);
    }
  }

  getPresence(projectId: string): { userId: string; lastSeen: string }[] {
    const users: { userId: string; lastSeen: string }[] = [];
    const seen = new Set<string>();
    for (const [, client] of this.clients) {
      if (client.projectId === projectId && !seen.has(client.userId)) {
        seen.add(client.userId);
        users.push({ userId: client.userId, lastSeen: new Date().toISOString() });
      }
    }
    return users;
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

export const realtimeService = new RealtimeService();
