customElements.define(
  'products-nav',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      Promise.all([import('./pl-search-box.js')]).then(() => {
        var s = document.createElement('link');
        s.rel = 'stylesheet';
        s.href =
          'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css';
        document.head.appendChild(s);
        this.innerHTML =`
        <pl-search-box></pl-search-box>
        <div id="root">Prducts navddsssd</div>`;
      });
    }
  }
);

const component = document.createElement('products-nav');

document.body.prepend(component);