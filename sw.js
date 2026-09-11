const CACHE='kennys-moas-r13-v1';
/* ASSETS "cœur" : doivent être en cache pour que l'app démarre hors-ligne.
   PDF.js est embarqué en local (pdf.min.mjs/pdf.worker.min.mjs, build officiel
   Mozilla) et précaché ci-dessous comme le reste — plus de dépendance à un
   téléchargement séparé ni à un CDN.
   Icônes "maskable" ajoutées en plus des icônes "any" existantes : nécessaires
   pour que l'app installée affiche une icône propre sur Android (zone de
   sécurité ~66%), sans quoi le système recadre l'icône "any" de façon
   imprévisible. */
const CORE_ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-192-maskable.png','./icon-512-maskable.png','./pdf.min.mjs','./pdf.worker.min.mjs'];

self.addEventListener('install',event=>event.waitUntil(
 caches.open(CACHE).then(c=>c.addAll(CORE_ASSETS)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{if(new URL(event.request.url).origin===location.origin){const copy=res.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}return res}).catch(()=>caches.match('./index.html'))));
});
