customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `<div id='root'>MY Home Page</div>`;
    }
  }
);
