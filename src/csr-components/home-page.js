customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `
      <div>Home page
      <a href="/tr/moda/defacto/kadin/jean/jean-kategoriler.html">Defacto Jeans</a>
      </div>
      `;
    }
  }
);

// const component = document.createElement('home-page');

// document.body.prepend(component);
