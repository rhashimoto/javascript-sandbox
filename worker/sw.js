'use strict';

self.addEventListener('fetch', (event) => {
  event.respondWith(Promise.resolve().then(() => {
    // The original idea was to use the fetch client type to filter
    // requests from Worker instances, but on Chrome crbug.com/731604
    // prevents that. Instead filter on URLs that don't match our
    // origin.
    if (event.request.url.includes(location.origin)) {
      // TODO: Forward request to embedding page for offline support.
      // We can't use the Cache API here because any worker can
      // corrupt it. Instead use the embedding page as a proxy.
      return fetch(event.request);
    } else {
      // TODO: Check URL against client-specific whitelist.
      console.warn('forbidden', event.request);
      return new Response('', {
        status: 403,
        statusText: 'Forbidden'
      });
    }
  }));
});
