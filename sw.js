// ===== Guarda la app en el iPhone para que abra sin internet =====
// Cuando cambies algún archivo de la app, sube también este con el número de VERSION cambiado
// (v1 → v2…), así el iPhone sabe que tiene que coger la nueva.
const VERSION = 'v1';
const ARCHIVOS = ['./', 'index.html', 'config.js', 'manifest.webmanifest',
  'iconos/apple-touch-icon.png', 'iconos/icon-192.png', 'iconos/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Los archivos de la app salen del iPhone al instante; Google (la API) siempre va por internet
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(guardado => guardado || fetch(req)));
});
