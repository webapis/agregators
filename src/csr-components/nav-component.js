customElements.define(
  'nav-component',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      fetch(`${window.location.origin}/nav.html`)
        .then(response => response.text())
        .then(html => {
          this.innerHTML = `${html}`;
        });
    }
  }
);
