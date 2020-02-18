import { LitElement, html, customElement } from 'lit-element';

const TARGET_ORIGIN = 'http://localhost:8081';
const IFRAME_URL = TARGET_ORIGIN + '/worker/worker.html';

/**
 * `javascript-sandbox`
 * Run foreign code in a WebWorker with restricted network access.
 *
 * @customElement
 * @demo demo/index.html
 */
class JavascriptSandbox extends LitElement {

  constructor() {
    super();

    // Hold iframe access until its contents load.
    this._iframe = new Promise(async (resolve) => {
      await this.updateComplete;
      const iframe = this.shadowRoot.querySelector('iframe');
      iframe.onload = (event) => resolve(iframe);
      iframe.src = IFRAME_URL;
    });

    this._requests = new Map();
  }

  // @override
  connectedCallback() {
    super.connectedCallback();
    this._handleMessageBound = this._handleMessage.bind(this);
    window.addEventListener('message', this._handleMessageBound);
  }

  // @override
  disconnectedCallback() {
    window.removeEventListener('message', this._handleMessageBound);
    super.disconnectedCallback();
  }
  
  // @override
  render() {
    return html`
      <div>how now brown cow</div>
      <iframe id="iframe" width="0" height="0" style="display: none;" />
    `;
  }

  async createFunction(code) {
    let response = await this._sendRequest({
      request: 'create',
      code: code
    });
    return response.data.functionId;
  }

  async destroyFunction(functionId) {
    let response = await this._sendRequest({
      request: 'destroy',
      functionId: functionId
    });
  }

  async callFunction(functionId, args) {
    let response = await this._sendRequest({
        request: 'call',
        functionId: functionId,
        args: args
    });
    return response.data.result;
  }
  
  _generateNonce() {
    let vals = new Uint8Array(16);
    crypto.getRandomValues(vals);
    let s = String.fromCharCode.apply(null, Array.from(vals));
    return btoa(s);
  }

  async _sendRequest(request) {
    const iframe = await this._iframe;
    return new Promise((resolve, reject) => {
      // Add the requestId to the request.
      request = Object.assign({ requestId: this._generateNonce() }, request);

      // Register the callback.
      this._requests.set(request.requestId, (event) => {
        this._requests.delete(request.requestId);
        resolve(event);
      });

      // Send the message.
      iframe.contentWindow.postMessage(request, TARGET_ORIGIN);
    });
  }
  
  _handleMessage(event) {
    console.log('lit-element message', event);
    if (event.origin !== TARGET_ORIGIN) return;

    const f = this._requests.get(event.data.requestId);
    f && f(event);
  }
}
customElements.define('javascript-sandbox', JavascriptSandbox);
