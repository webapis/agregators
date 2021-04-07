customElements.define(
  'pl-search-result',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { pattern, items } } = window.pageStore;
      if (items && items.items) {
        this.render({ items: items.items, pattern });
      }

    }

    render({ items, pattern }) {
      this.getAttribute('length');
      this.innerHTML = `  <div class='d-flex justify-content-md-between'>
        <div class="m-2 text-black-50"> Bulunan ürün ${items &&
          items.length} adet  
        </div>
        <div>
        ${pattern !== ''
          ? ` Filtre:  <button id="filter-btn" class="btn">${pattern}${' '}<span class="badge rounded-pill bg-danger"> X</span></button>`
          : ''}
          </div>`;
    }
  }
);
