import { LitElement, html, customElement } from 'lit-element';

/**
 * `javascript-sandbox`
 * Run foreign code in a WebWorker with restricted network access.
 *
 * @customElement
 * @demo demo/index.html
 */
class JavascriptSandbox extends LitElement {

  render() {
    return html`
      <div>how now brown cow</div>
    `;
  }
}
customElements.define('javascript-sandbox', JavascriptSandbox);
