const CACHE_NAME = 'salamarket-v3';
const OFFLINE_URL = '/offline.html';
const OFFLINE_ASSETS = [OFFLINE_URL, '/brand/logo-horizontal.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Ne pas intercepter les requêtes API (Supabase, Stripe)
  if (url.includes('/functions/v1/') ||
      url.includes('supabase.co') ||
      url.includes('stripe.com')) {
    return;
  }

  // Pour les navigations HTML : network-first avec fallback offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Pour les assets pré-cachés (logo affiché dans offline.html) :
  // network-first avec fallback cache pour rester visibles hors ligne.
  if (OFFLINE_ASSETS.some((asset) => url.endsWith(asset))) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Autres requêtes (images, JS, CSS, fonts...) : on ne touche à rien.
  // Le navigateur gère lui-même réseau + erreurs natives, ce qui évite
  // de polluer ces ressources avec une réponse "Hors ligne" inutile.
});
