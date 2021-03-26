customElements.define(
  'product-list-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
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
    set items(value) {
      window.pageStore.dispatch({
        type: window.actionTypes.PRODUCT_ITEMS_SET,
        payload: value
      });
      this._items = value;
    }

    get items() {
      return this._items;
    }
  }
);

const addScriptTag = ({ src }) => {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;

  document.body.appendChild(s);
};

const addLinkTag = ({ href }) => {
  var s = document.createElement('link');

  s.rel = 'stylesheet';
  s.href = href;
  document.head.appendChild(s);
};

addScriptTag({ src: '../components/pageStore.js' });
addLinkTag({
  href:
    'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css'
});

window.pageUrl =
  'page-meta-data/defacto/kadin/defacto-kadin-jean-pantolon.json';
document.body.innerHTML = `<product-list-page > </product-list-page>`;
