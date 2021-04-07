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
        import('./reducer-cb2cb50f.js'),
        import('./df-product-view-bde34222.js'),
        import('./pl-page-tabs-8b9c0546.js'),
        import('./pl-secenekler-53f87cfd.js'),
        import('./pl-search-result-afb840f9.js'),
        import('./products-container-19bea9b2.js'),
        import('./filter-container-456bd969.js')
      ]).then(modules => {
        window.pageStore = modules[0].createStore(
          modules[1].default,
          modules[1].initState,
          'page-store'
        );
        window.actionTypes = modules[1].actionTypes;
        const { state: { selected_pl_tab } } = window.pageStore;
        this.render({ selected: selected_pl_tab });
        if (jsonUrl) {
          fetch(jsonUrl).then(response => response.json()).then(items => {
            window.pageStore.dispatch({
              type: window.actionTypes.PRODUCT_ITEMS_SET,
              payload: items
            });
          });
        }

        window.pageStore.subscribe(
          window.actionTypes.PL_PAGE_TAB_SELECTED,
          () => {
            const { state: { selected_pl_tab } } = window.pageStore;
            this.render({ selected: selected_pl_tab });
          }
        );
      });
    }
    render({ selected }) {
      if (selected === 'urunler-tab') {
        this.innerHTML = `
        <pl-page-tabs></pl-page-tabs>
        <products-container></products-container>
      `;
      }
    }
  }
);
