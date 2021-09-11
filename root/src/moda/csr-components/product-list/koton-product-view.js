customElements.define(
  'koton-product-view',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const productName = this.getAttribute('productname');
      const src = this.getAttribute('src');
      this.innerHTML = `<div style="width:150px;">
      <div>
      <img src="${src}" width="150"/>
      </div>
      ${productName}</div>`;
    }
  }
);
