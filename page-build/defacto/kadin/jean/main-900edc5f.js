customElements.define(
  'product-list',
  class extends HTMLElement {
    constructor() {
      super();

      window.addEventListener('scroll', () => {
        console.log(' body.scrollHeight', document.body.scrollHeight);
        console.log(
          ' body.scrollTop',
          document.body.scrollTop + document.body.clientHeight
        );

        if (
          document.body.scrollTop + document.body.clientHeight ===
          document.body.scrollHeight
        ) {
          const { state: { items: { items } } } = window.pageStore;
          const itemTags = document.getElementsByTagName('product-view');

          console.log('itemTags', itemTags.length);
          const nextItems = items.slice(itemTags.length, itemTags.length + 70);
          this.appendProducts(nextItems);
          console.log('nextItems', nextItems);
        }
      });
    }
    // set items(value) {
    //   document.innerHTML = `<div>${value.pageTitle}</div>`;
    //   // this.render({ selected: 'urunler', value });
    //   this._items = value;
    // }

    // get items() {
    //   return this._items;
    // }
    connectedCallback() {
      const jsonUrl = this.getAttribute('jsonUrl');
      var s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href = './main.css';

      document.head.appendChild(s);
      Promise.all([
        import('./air-store-0b06b9a4.js'),
        import('./reducer-3e4f7fbe.js'),
        import('./df-product-view-f2e2a6d1.js'),
        import('./pl-page-tabs-13551ac1.js')
      ]).then(function(modules) {
        window.pageStore = modules[0].createStore(
          modules[1].default,
          modules[1].initState,
          'page-store'
        );
        window.actionTypes = modules[1].actionTypes;

        // const url = window.pageUrl;
        window.onpagestore();
       
        if (jsonUrl) {
          fetch(jsonUrl).then(response => response.json()).then(items => {
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
    appendProducts(items) {
      items.filter((it, i) => i < 70).forEach(item => {
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
    render({ selected, value }) {
      this.innerHTML = /*html*/ `
      <div class="container">
        <pl-page-tabs></pl-page-tabs>
       
          <div  id="root" class="container-fluid">
          <div id="urun-container" class="row ${selected !== 'urunler' &&
            'd-none'}">
            </div>
         
           
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
        this.appendProducts(value.items);
      }
    }
  }
);
