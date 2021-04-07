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
        import('./pl-page-tabs-a70b68af.js'),
        import('./pl-secenekler-53f87cfd.js'),
        import('./pl-search-result-afb840f9.js'),
        import('./products-container-0d8698ef.js'),
        import('./filter-container-456bd969.js')
      ]).then(modules => {
        this.render();
        window.pageStore = modules[0].createStore(
          modules[1].default,
          modules[1].initState,
          'page-store'
        );
        window.actionTypes = modules[1].actionTypes;

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
 
      
      `;
    }
  }
);
