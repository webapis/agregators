customElements.define(
  'products-container',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      // const { state: { selected_pl_tab, items } } = window.pageStore;
      // if (selected_pl_tab === 'urunler-tab') {
      //   this.render({ value: items });
      // }
      // window.pageStore.subscribe(
      //   window.actionTypes.PL_PAGE_TAB_SELECTED,
      //   () => {
      //     const { state: { selected_pl_tab, items } } = window.pageStore;
      //     if (selected_pl_tab === 'urunler-tab') {
      //       this.render({ value: items });
      //     } else {
      //       this.innerHTML = ``;
      //     }
      //   }
      // );

      window.pageStore.subscribe(window.actionTypes.PRERENDER_DATA, () => {
        const { state: { selected_pl_tab, items } } = window.pageStore;

        if (selected_pl_tab === 'urunler-tab') {
          this.render({ value: items });
        }
      });

      // window.pageStore.subscribe(window.actionTypes.PATTERN_SELECTED, state => {
      //   const { items, selected_pl_tab, pattern } = state;
      //   const filter = items.items.filter(item => {
      //     return item.productName.includes(pattern);
      //   });

      //   if (selected_pl_tab === 'urunler-tab') {
      //     this.render({ value: { ...items, items: filter } });
      //   }
      // });

      // if (window.jsonUrl ) {
      //   console.log('fetching data...');
      //   fetch(window.jsonUrl).then(response => response.json()).then(items => {
      //     window.pageStore.dispatch({
      //       type: window.actionTypes.PRODUCT_ITEMS_SET,
      //       payload: items
      //     });
      //   });
      // }
    }

    render({ value }) {
      const height = document.body.clientHeight;
      this.innerHTML = `<div class="container">
      <div class="row">
      <div class="col">
      <pl-search-result length=${value && value.items && value.items.length}>
      
      </pl-search-result>
      </div>
      </div>
      
        </div>`;
      const productContainer = document.getElementById('products');

      productContainer.style.height = `${height}px;`;
      if (value) {
        document.title = value.pageTitle;
        const descriptionTag = document.createElement('meta');
        descriptionTag.type = 'description';
        descriptionTag.content = value.pageDescription;
        document.querySelector('head').appendChild(descriptionTag);
        this.appendProducts(value.items);
      }

      document.addEventListener('scroll', () => {
        const { state: { autoscroll } } = window.pageStore;
        if (autoscroll) {
          if (
            document.body.scrollTop + document.body.clientHeight ===
            document.body.scrollHeight
          ) {
            console.log('Fetch started');
            // const { state: { items: { items } } } = window.pageStore;
            const marka = this.getAttribute('marka');
            const itemTags = document.getElementsByTagName(
              `${marka}-product-view`
            );
            // const nextItems = items.slice(
            //   itemTags.length,
            //   itemTags.length + 70
            // );
            const jsonUrl = window.jsonUrl;
            let filePath = '';
            console.log('length...', itemTags.length);
            if (itemTags.length === 100 || itemTags.length / 100 > 0) {
              let pageNum = 0;
              filePath =
                jsonUrl.substring(0, jsonUrl.lastIndexOf('/')) +
                `/${pageNum}.json`;

              if (itemTags.length / 100 > 0) {
                pageNum = Math.round(itemTags.length / 100);
                debugger;
                filePath =
                  jsonUrl.substring(0, jsonUrl.lastIndexOf('/')) +
                  `/${pageNum}.json`;
              }

              if (jsonUrl) {
                console.log('fetching next data');
                fetch(filePath)
                  .then(response => response.json())
                  .then(data => {
                    this.appendProducts(data.items);
                  })
                  .catch(err => {
                    debugger;
                  });
              }
            }
            // this.appendProducts(nextItems);
          }
        }
        //toggle nav tab
      });
    } //render

    appendProducts(items) {
      const marka = this.getAttribute('marka');
      items.filter((it, i) => i < 100).forEach((item, i) => {
        var node = document.createElement(`${marka}-product-view`);

        node.classList.add('col-6');
        node.classList.add('col-md-3');
        node.classList.add('col-lg-2');

        node.setAttribute('id', i);
        readObjProp({ node, obj: item });

        document.getElementById('products').appendChild(node);
      });
    }
  }
);

function readObjProp({ node, obj }) {
  for (let attribute in obj) {
    const current = obj[attribute];
    let type = typeof current;

    if (type === 'string') {
      node.setAttribute(`${attribute}`, current);
      if (attribute === 'srcset') {
        console.log('srcset', obj[attribute]);
      }
    } else if (type === 'object') {
      readObjProp({ node, obj: current });
    }
  }
}
