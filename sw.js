/* KENNY'S MOAS — hors ligne, sans bloquer la mise à jour.
   Le code (page, app.js, app.css) est toujours repris sur le réseau d'abord.
   Les gros fichiers (PDF.js, images) ne sont mis en cache qu'après une vraie utilisation. */
const CACHE = 'kennys-moas-v47';
const BASE = self.registration.scope;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([
    new URL('./', BASE).href,
    new URL('index.html', BASE).href,
    new URL('app.js', BASE).href,
    new URL('app.css', BASE).href,
  ])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) =>
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const shell = req.mode === 'navigate' || /\/(index\.html|app\.js|app\.css|sw\.js)$/.test(url.pathname);
  if (shell) {
    e.respondWith(fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match(new URL('index.html', BASE).href) : undefined))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
