/* Service Worker für Baustellen-Dokumentation
   Ein gemeinsamer SW für Landingpage + beide Tools.
   Cacht ausschließlich eigene, lokale Dateien. Keine Netzwerk-Requests an Dritte.
   Pfade sind relativ zur SW-Position, damit es lokal UND unter
   GitHub Pages (/baustellen-doku/) funktioniert. */

const CACHE = 'baustellen-doku-v1';

// Alle Pfade relativ zum SW-Verzeichnis (Projekt-Root).
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './tagesbericht/',
  './tagesbericht/index.html',
  './tagesbericht/manifest.webmanifest',
  './tagesbericht/icons/icon.svg',
  './gefaehrdungsbeurteilung/',
  './gefaehrdungsbeurteilung/index.html',
  './gefaehrdungsbeurteilung/app.js',
  './gefaehrdungsbeurteilung/styles.css',
  './gefaehrdungsbeurteilung/manifest.webmanifest',
  './gefaehrdungsbeurteilung/icons/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Einzeln cachen: scheitert eine Datei (z. B. fehlende Variante),
    // bricht nicht die gesamte Installation ab.
    await Promise.allSettled(
      ASSETS.map(path => cache.add(new Request(path, { cache: 'reload' })))
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // Nur eigene GET-Requests behandeln.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const res = await fetch(req);
      // Erfolgreiche Antworten für späteren Offline-Zugriff ablegen.
      if (res && res.ok && res.type === 'basic') {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (e) {
      // Offline und nicht im Cache: bei Navigation auf Tool-Index ausweichen.
      if (req.mode === 'navigate') {
        const fallback = await caches.match('./index.html', { ignoreSearch: true });
        if (fallback) return fallback;
      }
      throw e;
    }
  })());
});
