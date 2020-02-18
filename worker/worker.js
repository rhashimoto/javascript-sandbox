'use strict';

(() => {
  let f = undefined;
  onmessage = async (event) => {
    try {
      switch (event.data.request) {
      case 'create':
        f = new Function('args', event.data.code);
        postMessage({
          requestId: event.data.requestId,
          functionId: event.data.requestId
        });
        break;
      case 'call':
        postMessage({
          requestId: event.data.requestId,
          result: await f.call(f, event.data.args)
        });
        break;
      }
    } catch (e) {
      postMessage({
        requestId: event.data.requestId,
        error: e
      });
    }
  };
})();
