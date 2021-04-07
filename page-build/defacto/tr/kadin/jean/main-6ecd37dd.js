customElements.define(
  'product-list',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const jsonUrl = this.getAttribute('jsonUrl');
      var s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href = './main.css';

      document.head.appendChild(s);
      Promise.all([
        import('./air-store-0b06b9a4.js'),
        import('./reducer-bd9d3f11.js'),
        import('./df-product-view-bde34222.js'),
        import('./pl-page-tabs-fd43f2d2.js'),
        import('./pl-secenekler-53f87cfd.js'),
        import('./pl-search-result-afb840f9.js'),
        import('./pl-search-result-afb840f9.js'),
        import('./pl-search-result-afb840f9.js')
      ]).then(function(modules) {
        window.pageStore = modules[0].createStore(
          modules[1].default,
          modules[1].initState,
          'page-store'
        );
        window.actionTypes = modules[1].actionTypes;

        window.onpagestore();

        if (jsonUrl) {
          fetch(jsonUrl).then(response => response.json()).then(items => {
            window.pageStore.dispatch({
              type: window.actionTypes.PRODUCT_ITEMS_SET,
              payload: items
            });
          });
        }
      });

      window.onpagestore = () => {
        const { state: { selected_pl_tab } } = window.pageStore;
        this.render({ selected: selected_pl_tab });
        window.pageStore.subscribe(
          window.actionTypes.PL_PAGE_TAB_SELECTED,
          state => {
            const { selected_pl_tab, items } = state;

            this.render({ selected: selected_pl_tab, value: items });
          }
        );
        window.pageStore.subscribe(
          window.actionTypes.PRODUCT_ITEMS_SET,
          state => {
            const { items, selected_pl_tab } = state;

            this.render({ selected: selected_pl_tab, value: items });
          }
        );

        window.pageStore.subscribe(
          window.actionTypes.PATTERN_SELECTED,
          state => {
            const { items, selected_pl_tab, pattern } = state;
            const filter = items.items.filter(item => {
              return item.productName.includes(pattern);
              //
            });

            this.render({
              selected: selected_pl_tab,
              value: { ...items, items: filter }
            });
          }
        );
      };
    }
    render() {
      this.innerHTML = `
        <pl-page-tabs></pl-page-tabs>
        <filter-container></filter-container>
        <products-container></products-container>
      `;
    }
  }
);
