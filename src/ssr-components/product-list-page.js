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
            const { selected_pl_tab } = state;
            this.render({ selected: selected_pl_tab });
          }
        );
        window.pageStore.subscribe(
          window.actionTypes.PRODUCT_ITEMS_SET,
          state => {
            const { items, selected_pl_tab } = state;
            debugger;
            this.render({ selected: selected_pl_tab, value: items });
          }
        );
      };
      addScriptTag({ src: '../components/pageStore.js' });
      addLinkTag({
        href:
          'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css'
      });
    }

    render({ selected, value }) {
      this.innerHTML = /*html*/ `
      <div class="container">
        <pl-page-tabs></pl-page-tabs>
        ${selected === 'secenekler' ? '<div >Secenekler<div>' : ''}
        ${selected === 'urunler'
          ? '<div  id="root" class="row"></div></div>'
          : ''}
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
          debugger;
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
          document.getElementById('root').appendChild(node);
        });
      }
    }
    set items(value) {
      debugger;
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
