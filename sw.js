const CACHE = 'mealprep-v10-20261122-1';
const ASSETS = ["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./fonts/noto-sans-kr.woff","./fonts/OFL.txt","./illustrations/bean-stew.jpg","./illustrations/beef-greens.jpg","./illustrations/beef-rice.jpg","./illustrations/chicken-rice.jpg","./illustrations/clear-soup.jpg","./illustrations/coconut-curry.jpg","./illustrations/egg-rice.jpg","./illustrations/ginger-pork.jpg","./illustrations/mapo-tofu.jpg","./illustrations/pan-patty.jpg","./illustrations/pork-stew.jpg","./illustrations/roast-chicken.jpg","./illustrations/salmon.jpg","./illustrations/spicy-pork.jpg","./illustrations/steamed-egg.jpg","./illustrations/tofu-greens.jpg"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(url => new Request(url,{cache:'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => /^mealprep-v(?:[3-9]|10)-/.test(key) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
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
