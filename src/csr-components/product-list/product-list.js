//import required components for the page
//import css and attach to page
//init and setup page state with store.js
//after render required components
customElements.define(
  'product-list',
  class extends HTMLElement {
    constructor() {
      super();
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }
    connectedCallback() {
      var s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href =
        'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css';
      document.head.appendChild(s);
      var pds = document.createElement('link');
      const marka = this.getAttribute('marka');
      pds.rel = 'stylesheet';
      pds.href = `/components/product-list/${marka}-product-view.css`;
      document.head.appendChild(pds);
      Promise.all([
        import('../air-store.js'),
        import('./reducer.js')
      ]).then(modules => {
        window.pageStore = modules[0].createStore(
          modules[1].default,
          modules[1].initState,
          'page-store'
        );
        window.actionTypes = modules[1].actionTypes;
      });
      Promise.all([
        import('./product-item-scroller.js'),
        import(`./${marka}-product-view.js`),
        import('./pl-page-tabs.js'),
        import('./pl-secenekler.js'),
        import('./pl-search-result.js'),
        import('./products-container.js'),
        import('./filter-container.js'),
        import('../pl-search-box.js')
      ]).then(() => {
        const { state: { selected_pl_tab } } = window.pageStore;
        this.render({ selected: selected_pl_tab });
        window.prerender && window.prerender();

        // const productContainer = document.getElementById('products');

        // if (window.jsonUrl && productContainer.children.length === 0) {
        //   console.log('fetching data...');
        //   fetch(window.jsonUrl)
        //     .then(response => response.json())
        //     .then(items => {
        //       window.pageStore.dispatch({
        //         type: window.actionTypes.PRODUCT_ITEMS_SET,
        //         payload: items
        //       });
        //     });
        // }
      });
    }
    render() {
      const marka = this.getAttribute('marka');

      this.innerHTML = `
        <pl-page-tabs></pl-page-tabs>
        <products-container marka=${marka}></products-container>
        <filter-container></filter-container>
      `;
    }
  }
);
