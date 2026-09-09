const CACHE='kennys-moas-r11-s9-v1';
/* ASSETS "cœur" : doivent être en cache pour que l'app démarre hors-ligne.
   PDFJS : précaché en best-effort — s'ils sont absents (pas encore
   téléchargés / pas encore poussés sur l'hébergement), on ne bloque pas
   l'installation du service worker pour autant (Ronde 8 : piège n°1 de
   la migration GitHub Pages, cf. fichier relais).
   Icônes "maskable" (Ronde 10, P1.5) ajoutées ici en plus des icônes
   "any" existantes : nécessaires pour que l'app installée affiche une
   icône propre sur Android (zone de sécurité ~66%), sans quoi le
   système recadre l'icône "any" de façon imprévisible. */
const CORE_ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-192-maskable.png','./icon-512-maskable.png'];
// PDF.js est chargé en local depuis index.html (Ronde 10, P1.2 : retrait de
// la dépendance CDN). Précaché en best-effort ci-dessous, même logique que
// les icônes maskable ci-dessus : si pdf.min.js/pdf.worker.min.js sont
// absents (pas encore téléchargés via download-pdfjs.sh/.ps1), l'installation
// du service worker n'est pas bloquée — seul le lecteur PDF restera indisponible.
const PDFJS_ASSETS=['./pdf.min.js','./pdf.worker.min.js'];

self.addEventListener('install',event=>event.waitUntil(
 caches.open(CACHE).then(async c=>{
  await c.addAll(CORE_ASSETS);
  await Promise.all(PDFJS_ASSETS.map(u=>c.add(u).catch(()=>{})));
 }).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{if(new URL(event.request.url).origin===location.origin){const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}return res}).catch(()=>caches.match('./index.html'))));
});
