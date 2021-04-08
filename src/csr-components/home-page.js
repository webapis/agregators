customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `<div>Home page</div>`;
    }
  }
);

const component = document.createElement('home-page');

document.body.prepend(component);
