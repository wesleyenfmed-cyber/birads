const CACHE_NAME = "ultrassom-pwa-v6";
const APP_FILES = ["./", "./index.html", "./birads.html", "./tirads.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))); self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))); self.clients.claim(); });
self.addEventListener("fetch", event => {
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 const isDocument=event.request.mode==="navigate"||(url.origin===self.location.origin&&["/","/index.html","/birads.html","/tirads.html"].some(p=>url.pathname.endsWith(p)));
 if(isDocument){event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>caches.match(event.request).then(r=>r||caches.match("./index.html"))));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok&&url.origin===self.location.origin){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}return response;})));
});