/* KENNY'S MOAS — Service Worker (version Vite/React).
   - Précache les assets statiques stables (icônes, splash, PDF.js local, manifest).
   - Cache dynamique (stale-while-revalidate) pour tout le reste du même domaine, y compris
     les fichiers générés par Vite (noms hachés) : l'app démarre donc hors-ligne dès la 2e visite.
   - Navigation hors-ligne : repli sur index.html.
   Incrémenter CACHE à chaque livraison pour forcer la mise à jour côté utilisateurs. */
const CACHE = 'kennys-moas-react-v22';
const BASE = self.registration.scope;   // dossier où vit l'appli (racine du domaine OU sous-dossier GitHub Pages)
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'logo.svg',
  'icon-192-maskable.png', 'icon-512-maskable.png', 'pdf.min.mjs', 'pdf.worker.min.mjs',
  'splash/splash-640x1136.png', 'splash/splash-750x1334.png', 'splash/splash-828x1792.png',
  'splash/splash-1125x2436.png', 'splash/splash-1170x2532.png', 'splash/splash-1179x2556.png',
  'splash/splash-1242x2688.png', 'splash/splash-1284x2778.png', 'splash/splash-1290x2796.png'].map((p) => new URL(p, BASE).href);

self.addEventListener('install', (e) =>
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())));

self.addEventListener('activate', (e) =>
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Google APIs, polices : jamais interceptés
  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => cached || (req.mode === 'navigate' ? caches.match(new URL('index.html', BASE).href) : undefined));
      return cached || net;
    })
  );
});
