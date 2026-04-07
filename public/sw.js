const CACHE_NAME = 'qatrial-v1';
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: network-first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful GET responses
          if (request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Network failed — check if it's a mutation that should be queued
          if (request.method !== 'GET') {
            // Store failed mutations in IndexedDB for offline queue
            try {
              const body = await request.clone().text();
              await storeOfflineMutation(request.method, request.url, body, Object.fromEntries(request.headers.entries()));
            } catch {
              // silently fail queue storage
            }
            return new Response(
              JSON.stringify({ message: 'Queued for offline sync', offline: true }),
              { status: 202, headers: { 'Content-Type': 'application/json' } }
            );
          }
          // GET: try cache
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(
            JSON.stringify({ message: 'Offline and no cached data' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache JS, CSS, images, fonts
        if (
          response.ok &&
          request.method === 'GET' &&
          (url.pathname.endsWith('.js') ||
            url.pathname.endsWith('.css') ||
            url.pathname.endsWith('.svg') ||
            url.pathname.endsWith('.png') ||
            url.pathname.endsWith('.woff2') ||
            url.pathname.endsWith('.json'))
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // SPA fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// IndexedDB helpers for offline mutation queue
function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('qatrial-offline', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('mutations')) {
        db.createObjectStore('mutations', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function storeOfflineMutation(method, url, body, headers) {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('mutations', 'readwrite');
    const store = tx.objectStore('mutations');
    store.add({ method, url, body, headers, timestamp: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Listen for online events to replay queue
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REPLAY_QUEUE') {
    replayOfflineQueue().then((count) => {
      event.ports[0].postMessage({ replayed: count });
    });
  }
});

async function replayOfflineQueue() {
  const db = await openOfflineDB();
  return new Promise((resolve) => {
    const tx = db.transaction('mutations', 'readwrite');
    const store = tx.objectStore('mutations');
    const getAll = store.getAll();
    getAll.onsuccess = async () => {
      const mutations = getAll.result;
      let replayed = 0;
      for (const mutation of mutations) {
        try {
          const response = await fetch(mutation.url, {
            method: mutation.method,
            headers: mutation.headers,
            body: mutation.body || undefined,
          });
          if (response.ok) {
            // Remove from queue
            const deleteTx = db.transaction('mutations', 'readwrite');
            deleteTx.objectStore('mutations').delete(mutation.id);
            replayed++;
          }
        } catch {
          // Still offline, stop retrying
          break;
        }
      }
      resolve(replayed);
    };
    getAll.onerror = () => resolve(0);
  });
}
