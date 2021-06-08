const cacheName = 'question test-cache'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(cacheName)
    const cacheResponse = await cache.match(event.request)
    if (cacheResponse) return cacheResponse

    if (event.request.destination === 'document' ||
      event.request.destination === 'style' ||
      event.request.destination === 'script' ||
      event.request.url.includes('svg')) {
      const fetchResponse = await fetch(event.request.url)
      if (!fetchResponse.ok) throw fetchResponse.statusText
      await cache.put(event.request, fetchResponse.clone())
      return fetchResponse
    }

    if (event.request.url.includes('randomuser.me/api/portraits')) {
      const fetchResponse = await fetch(event.request.url, { mode: 'no-cors' })
      if (!fetchResponse.ok) throw fetchResponse.statusText
      await cache.put(event.request, fetchResponse.clone())
      return fetchResponse
    }

    return fetch(event.request.url)
  })())
})
