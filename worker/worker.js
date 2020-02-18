'use strict';

(() => {
  let functions = new Map();
  onmessage = async (event) => {
    console.log('worker message', event);
    switch (event.data.request) {
    case 'create':
      functions.set(event.data.requestId, new Function('args', event.data.code));
      postMessage({
        requestId: event.data.requestId,
        functionId: event.data.requestId
      });
      break;
    case 'destroy':
      functions.delete(event.data.functionId);
      postMessage({
        requestId: event.data.requestId
      });
      break;
    case 'call':
      let f = functions.get(event.data.functionId);
      if (f) {
        postMessage({
          requestId: event.data.requestId,
          result: await f.call(f, event.data.args)
        });
      } else {
        postMessage({
          requestId: event.data.requestId,
          error: new Error('function not found')
        });
      }
      break;
    }
  };
})();
