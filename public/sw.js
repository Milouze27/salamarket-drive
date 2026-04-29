const CACHE_NAME = 'salamarket-v2';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
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

  // Autres requêtes (images, JS, CSS, fonts...) : on ne touche à rien.
  // Le navigateur gère lui-même réseau + erreurs natives, ce qui évite
  // de polluer ces ressources avec une réponse "Hors ligne" inutile.
});
