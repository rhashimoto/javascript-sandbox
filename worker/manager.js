'use strict';

// Install the service worker.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
} else {
  console.log('ServiceWorker not supported in this browser.');
}

// Install the web worker.
setTimeout(() => {
  if ('Worker' in window) {
    let worker = new Worker('worker.js');
    console.log(worker);
  } else {
    console.log('Worker not supported in this browser.');
  }
}, 3000);

// TODO: Handle messages.
window.addEventListener('message', (event) => {
  console.log('manager message', event);

  event.source.postMessage({
    requestId: event.data.requestId,
    functionId: event.data.requestId
  });
});

console.log('Hello, manager!');
