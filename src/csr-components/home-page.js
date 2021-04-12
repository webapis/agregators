customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `
      <div>Home page
      <a href="/defacto/tr/kadin/jean/jean-kategoriler.html">Jean Cagetory</a>
      </div>
      `;
    }
  }
);

const component = document.createElement('home-page');

document.body.prepend(component);
