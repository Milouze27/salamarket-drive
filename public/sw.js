const CACHE_NAME = 'salamarket-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes API (Supabase, Stripe)
  if (event.request.url.includes('/functions/v1/') ||
      event.request.url.includes('supabase.co') ||
      event.request.url.includes('stripe.com')) {
    return;
  }
  // Network-first pour les autres
  event.respondWith(fetch(event.request).catch(() => {
    return new Response('Hors ligne', { status: 503 });
  }));
});
