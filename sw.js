const CACHE = 'mealprep-v8-20261122-1';
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./photos/chicken.jpg","./photos/chickenGrill.jpg","./photos/chickenCurry.jpg","./photos/pork.jpg","./photos/porkGinger.jpg","./photos/porkStew.jpg","./photos/beef.jpg","./photos/gingerBeef.jpg","./photos/sesameTofu.jpg","./photos/tofuMapo.jpg","./photos/egg.jpg","./photos/beans.jpg","./photos/salmon.jpg"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(url => new Request(url,{cache:'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => /^mealprep-v[3-8]-/.test(key) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const {request} = event;
  if(request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  const cache = caches.open(CACHE);
  if(request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if(!response.ok) return cache.then(c => c.match('./index.html')).then(saved => saved || response);
      return response;
    }).catch(() => cache.then(c => c.match('./index.html')).then(saved => saved || Response.error())));
    return;
  }
  event.respondWith(cache.then(c => c.match(request)).then(saved => saved || fetch(request)));
});
