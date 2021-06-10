customElements.define(
  'firebase-bucket',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `<div>Hello</div>`;
    }
  }
);
