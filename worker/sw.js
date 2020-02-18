'use strict';

self.addEventListener('fetch', (event) => {
  event.respondWith(
    self.clients.get(event.clientId).then((client) => {
      if (event.request.url.includes(location.origin)) {
        // Same-origin.
        // TODO: Forward request to embedding page for offline support.
        // We can't use the Cache API because any worker can
        // corrupt it. Instead use the embedding page as a proxy.
        return fetch(event.request);
      } else {
        // On Chrome, a Worker request has the clientId of the WindowClient
        // that created it (https://crbug.com/731604).
        console.log('client', client);

        // External origin.
        // TODO: Check client whitelist.
        return new Response('', {
          status: 403,
          statusText: 'Forbidden'
        });
      }
    }));
});
