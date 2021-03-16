import '../pages/product-list-page';

customElements.define(
  'product-list-page-storybook',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      fetch('./items/kadin-jean-pantolonPage.json')
        .then(response => {
          return response.json();
        })
        .then(data => {
          document.querySelector('product-list-page').items = data;
        });

      this.innerHTML = `<product-list-page></product-list-page>`;
      const element = document.getElementsByTagName('product-list-page')[0];
    }
  }
);
