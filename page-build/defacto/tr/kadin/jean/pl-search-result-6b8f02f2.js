customElements.define(
  'pl-search-result',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
   
      const length = this.getAttribute('length');
      const pattern = this.getAttribute('pattern');
      this.innerHTML = `  <div class='d-flex justify-content-md-between'>
        <div class="m-2 text-black-50"> Bulunan ürün ${length} adet  
        </div>
        <div>
        ${pattern !== ''
          ? ` Filtre:  <button id="filter-btn" class="btn">${pattern}${' '}<span class="badge rounded-pill bg-danger"> X</span></button>`
          : ''}
          </div>`;
      
    }

    render() {
   
    }
  }
);
