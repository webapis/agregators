customElements.define(
  'kadin-jean-navigation-ssr',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      fetch('page-meta-data/defacto/kadin/defacto-kadin-jean-pantolon.json')
        .then(result => {
          return result.json();
        })
        .then(data => {
          debugger;
        });
      this.innerHTML = `<div>Kadin Jean Navigation</div>`;
    }
  }
);
