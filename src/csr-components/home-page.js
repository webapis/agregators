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
      <a href="/tr/moda/koton/kadin/jean/pantolon.html">Koton Jeans</a>
      </div>
      `;
    }
  }
);
//page-build/tr/moda/koton/kadin/jean/pantolon.html
// const component = document.createElement('home-page');

// document.body.prepend(component);
