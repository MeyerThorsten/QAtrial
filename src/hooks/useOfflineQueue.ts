import { useState, useEffect, useCallback } from 'react';

const DB_NAME = 'qatrial-offline';
const STORE_NAME = 'mutations';

interface QueuedMutation {
  id?: number;
  method: string;
  url: string;
  body: string;
  headers: Record<string, string>;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getQueueCount(): Promise<number> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const countReq = store.count();
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
}

async function getAllMutations(): Promise<QueuedMutation[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getAll = store.getAll();
      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function deleteMutation(id: number): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // silent
  }
}

async function addMutation(mutation: Omit<QueuedMutation, 'id'>): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).add(mutation);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // silent
  }
}

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshCount = useCallback(async () => {
    const count = await getQueueCount();
    setPendingCount(count);
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  const queueMutation = useCallback(
    async (method: string, url: string, body: string) => {
      const token = localStorage.getItem('qatrial:token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await addMutation({ method, url, body, headers, timestamp: Date.now() });
      await refreshCount();
    },
    [refreshCount],
  );

  const syncQueue = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      // First try via service worker message channel
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const mc = new MessageChannel();
        const result = await new Promise<{ replayed: number }>((resolve) => {
          mc.port1.onmessage = (event) => resolve(event.data);
          navigator.serviceWorker.controller!.postMessage({ type: 'REPLAY_QUEUE' }, [mc.port2]);
          // Timeout after 30s
          setTimeout(() => resolve({ replayed: 0 }), 30000);
        });
        if (result.replayed > 0) {
          await refreshCount();
          setIsSyncing(false);
          return;
        }
      }

      // Fallback: replay directly
      const mutations = await getAllMutations();
      for (const mutation of mutations) {
        try {
          const response = await fetch(mutation.url, {
            method: mutation.method,
            headers: mutation.headers,
            body: mutation.body || undefined,
          });
          if (response.ok && mutation.id !== undefined) {
            await deleteMutation(mutation.id);
          }
        } catch {
          break; // Still offline
        }
      }
      await refreshCount();
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshCount]);

  // Auto-sync when back online
  useEffect(() => {
    const handleOnline = () => {
      syncQueue();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncQueue]);

  return { queueMutation, syncQueue, pendingCount, isSyncing };
}
