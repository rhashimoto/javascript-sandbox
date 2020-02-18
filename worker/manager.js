'use strict';

(() => {
  // Install the service worker.
  let serviceWorkerRegistration = new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(resolve, reject);
      });
    } else {
      reject(new Error('ServiceWorker not supported in this browser.'));
    }
  });

  // Set up handler for responses from workers.
  let requests = new Map();
  let workerListener = (event) => {
    requests.get(event.data.requestId)(event);
    requests.delete(event.data.requestId);
  };

  // Listen for messages from the custom element.
  let workers = new Map();
  window.addEventListener('message', async (event) => {
    let workerId = event.data.functionId || event.data.requestId;
    switch (event.data.request) {
    case 'create':
      requests.set(event.data.requestId, (response) => {
        event.source.postMessage(response.data, '*');
      });

      // Create a worker for each function.
      await serviceWorkerRegistration;
      let worker = new Worker('worker.js');
      workers.set(workerId, worker);
      worker.addEventListener('message', workerListener);
      worker.postMessage(event.data);
      break;

    case 'call':
      requests.set(event.data.requestId, (response) => {
        event.source.postMessage(response.data, '*');
      });
      workers.get(workerId).postMessage(event.data);
      break;

    case 'destroy':
      workers.get(workerId).terminate();
      workers.delete(workerId);
      event.source.postMessage({ requestId: event.data.requestId }, '*');
      break;
    }
  });
})();
