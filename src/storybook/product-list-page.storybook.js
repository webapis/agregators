import '../ssr-components/product-list-page';

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
            this.innerHTML = `<product-list-page></product-list-page>`;
          document.querySelector('product-list-page').items = data;
          
        })

    
     
    }
  }
);
