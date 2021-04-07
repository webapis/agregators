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
        import('./reducer-80b1b249.js'),
        import('./df-product-view-bde34222.js'),
        import('./pl-page-tabs-91fab440.js'),
        import('./pl-secenekler-53f87cfd.js'),
        import('./pl-search-result-afb840f9.js'),
        import('./products-container-95fe7462.js'),
        import('./filter-container-32a13d28.js')
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
      });
    }
    render() {
      this.innerHTML = `
        <pl-page-tabs></pl-page-tabs>
        <products-container></products-container>
        <filter-container></filter-container>
      `;
    }
  }
);