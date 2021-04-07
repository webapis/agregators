customElements.define(
  'pl-search-result',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { pattern, items } } = window.pageStore;

      this.render({ items:items.items, pattern });
      // window.pageStore.subscribe(
      //   window.actionTypes.PRODUCT_ITEMS_SET,
      //   state => {
      //     const { items: { items }, pattern } = state;

      //     this.render({
      //       items,
      //       pattern
      //     });
      //   }
      // );

      window.pageStore.subscribe(window.actionTypes.PATTERN_SELECTED, state => {
        const { items, pattern } = state;
        const filter = items.items.filter(item => {
          return item.productName.includes(pattern);
        });
        console.log('filter?????????', filter);

        this.render({
          items: filter,
          pattern
        });
      });
    }

    render({ items, pattern }) {
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
