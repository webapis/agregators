customElements.define(
  'product-list',
  class extends HTMLElement {
    constructor() {
      super();

      window.addEventListener('scroll', () => {
        const { state: { autoscroll } } = window.pageStore;
        if (autoscroll) {
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
            const nextItems = items.slice(
              itemTags.length,
              itemTags.length + 70
            );
            this.appendProducts(nextItems);
            console.log('nextItems', nextItems);
          }
        }
      });
    }

    connectedCallback() {
      const jsonUrl = this.getAttribute('jsonUrl');
      var s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href = './main.css';

      document.head.appendChild(s);
      Promise.all([
        import('./air-store-0b06b9a4.js'),
        import('./reducer-046f5d27.js'),
        import('./df-product-view-bde34222.js'),
        import('./pl-page-tabs-645808a0.js'),
        import('./pl-secenekler-53f87cfd.js'),
        import('./pl-search-result-afb840f9.js')
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
            console.log('filter', filter);

            this.render({
              selected: selected_pl_tab,
              value: { ...items, items: filter }
            });
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
            'd-none'}" style="height:300px">
            <pl-search-result></pl-search-result>
            </div>
         
          <div id="secenekler-container" class="row ${selected !==
            'secenekler' && 'd-none'}">
            <pl-secenekler></pl-secenekler>
            <div>
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

      const filterBtn = document.getElementById('filter-btn');
      if (filterBtn) {
        filterBtn.addEventListener('click', () => {
          window.pageStore.dispatch({ type: 'CLEAR_PATTERN' });

          const { state: { selected_pl_tab, items } } = window.pageStore;
          this.render({ selected: selected_pl_tab, value: items });
        });
      }
    }
  }
);
