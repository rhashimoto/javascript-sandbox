'use strict';

(() => {
  let serviceWorkerRegistration = new Promise((resolve, reject) => {
    // Install the service worker.
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(resolve, reject);
      });
    } else {
      reject(new Error('ServiceWorker not supported in this browser.'));
    }
  });

  let requests = new Map();
  let worker = serviceWorkerRegistration.then(() => {
    if ('Worker' in window) {
      let worker = new Worker('worker.js');
      worker.addEventListener('message', (event) => {
        requests.get(event.data.requestId)(event);
        requests.delete(event.data.requestId);
      });
      return worker;
    }
    throw new Error('Worker not supported in this browser.');
  });

  window.addEventListener('message', async (event) => {
    console.log('manager message', event);

    requests.set(event.data.requestId, (response) => {
      event.source.postMessage(response.data);
    });
    (await worker).postMessage(event.data);
  });
})();

console.log('Hello, manager!');
