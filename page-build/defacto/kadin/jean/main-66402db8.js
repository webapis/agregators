customElements.define(
  'product-list',
  class extends HTMLElement {
    constructor() {
      super();
    }
    set items(value) {
      document.innerHTML = `<div>${value.pageTitle}</div>`;
      // this.render({ selected: 'urunler', value });
      this._items = value;
    }

    get items() {
      return this._items;
    }
    connectedCallback() {
      var s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href = './main.css';

      document.head.appendChild(s);
      Promise.all([
        import('./air-store-0b06b9a4.js'),
        import('./reducer-3e4f7fbe.js'),
        import('./df-product-view-f2e2a6d1.js'),
        import('./pl-page-tabs-1828411a.js')
      ]).then(function(modules) {
        window.pageStore = modules[0].createStore(
          modules[1].default,
          modules[1].initState,
          'page-store'
        );
        window.actionTypes = modules[1].actionTypes;

        // const url = window.pageUrl;
        window.onpagestore();
        if (window.pageUrl) {
          fetch(window.pageUrl)
            .then(response => response.json())
            .then(items => {
              console.log('window.pageStoress|||||||', window.pageStore);
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
      };
    }

    render({ selected, value }) {
      this.innerHTML = /*html*/ `
      <div class="container">
        <pl-page-tabs></pl-page-tabs>
       
          <div  id="root" class="container-fluid">
          <div id="urun-container" class="row ${selected !== 'urunler' &&
            'd-none'}"></div>
          <div id="secenekler-container" class="row ${selected !==
            'secenekler' && 'd-none'}">Secenekler<div>
          </div>
       </div>
         
        `;
      if (value) {
        document.title = value.pageTitle;
        const descriptionTag = document.createElement('meta');
        descriptionTag.type = 'description';
        descriptionTag.content = value.pageDescription;
        document.querySelector('head').appendChild(descriptionTag);
        value.items.filter((it, i) => i < 76).forEach(item => {
          const {
            detailLink,
            productName,
            price: { salePrice, marketPrice },
            discount: { discountRate, discountText },
            image: { scrset, placeHolder }
          } = item;

          var node = document.createElement('product-view');

          node.classList.add('col-sm-6');
          node.classList.add('col-xl-3');
          node.setAttribute('title', productName);
          node.setAttribute('salePrice', salePrice);
          node.setAttribute('marketPrice', marketPrice);
          node.setAttribute('discountRate', discountRate);
          node.setAttribute('discountText', discountText);
          node.setAttribute('detailLink', detailLink);
          node.setAttribute('srcset', scrset);
          node.setAttribute('placeHolder', placeHolder);
          document.getElementById('urun-container').appendChild(node);
        });
      }
    }
  }
);

const addLinkTag = ({ href }) => {
  var s = document.createElement('link');

  s.rel = 'stylesheet';
  s.href = href;
  document.head.appendChild(s);
};

addLinkTag({
  href:
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css'
});

//window.pageUrl = './defacto-kadin-jean-pantolon.json';
document.body.innerHTML = `<product-list></product-list>`;
