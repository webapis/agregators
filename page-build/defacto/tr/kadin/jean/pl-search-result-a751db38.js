customElements.define(
  'pl-search-result',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const length = this.getAttribute('length');
      this.getAttribute('pattern');
      this.innerHTML = `  <div class='d-flex justify-content-md-between'>
        <div class="m-2 text-black-50"> Bulunan ürün ${length} adet  
        </div>
        <div>
       `;
    }
  }
);
