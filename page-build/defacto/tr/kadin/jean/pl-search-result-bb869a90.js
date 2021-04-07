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

      // window.pageStore.subscribe(window.actionTypes.PATTERN_SELECTED, state => {
      //   const { items, selected_pl_tab, pattern } = state;
      //   const filter = items.items.filter(item => {
      //     return item.productName.includes(pattern);
      //   });

      //   if (selected_pl_tab === 'urunler-tab') {
      //     this.render({ value: { ...items, items: filter } });
      //   }
      // });

      window.pageStore.subscribe(window.actionTypes.PATTERN_SELECTED, state => {
        const { items, pattern } = state;
        const filter = items.items.filter(item => {
          return item.productName.includes(pattern);
        });
        console.log('filter?????????_______', filter);

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
