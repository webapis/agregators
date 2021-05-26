customElements.define(
  'products-container',
  class extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      this.innerHTML = `<nav-component></nav-component>`;
      const env = document.querySelector('head meta[name=env]').content;
      const fileName = document.location.href
        .substr(document.location.href.lastIndexOf('/') + 1)
        .replace('.html', '');
      const prefolder = document.location.href;

      if (env === 'dev') {
        const response = await fetch(`./${fileName}-0.json`);
        const data = await response.json();
        window.fetched = true;
        this.appendProducts(data);
      }

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

      let pageNum = 1;

      document.onscroll = async () => {
        console.log('scrolling page.....????/');
        const { state: { autoscroll } } = window.pageStore;
        if (autoscroll) {
          if (
            document.body.scrollTop + document.body.clientHeight ===
            document.body.scrollHeight
          ) {
            console.log('Fetch started');
            const response = await fetch(`./${fileName}-${pageNum}.json`);
            const data = await response.json();
            window.fetched = true;
            this.appendProducts(data);
            pageNum++;
          }
        }
        //toggle nav tab
      };

      window.dynamicRender = items => {
        window.fetched = true;
        this.appendProducts(items);
      };
    }

    render({ value }) {
      debugger;
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
      // let pageNum = 0;

      // window.document.onscroll = () => {
      //   console.log('scrolling page.....????/');
      //   const { state: { autoscroll } } = window.pageStore;
      //   if (autoscroll) {
      //     if (
      //       document.body.scrollTop + document.body.clientHeight ===
      //       document.body.scrollHeight
      //     ) {
      //       console.log('Fetch started');

      //       //  const marka = this.getAttribute('marka');
      //       // const itemTags = document.getElementsByTagName(
      //       //   `${marka}-product-view`
      //       // );

      //       const jsonUrl = JSON.parse(this.getAttribute('jsonurl'));

      //       if (jsonUrl && pageNum <= jsonUrl.length) {
      //         console.log('fetching next data');
      //         fetch(jsonUrl[pageNum])
      //           .then(response => response.json())
      //           .then(data => {
      //             pageNum++;
      //             this.appendProducts(data.items);
      //           })
      //           .catch(err => {
      //
      //           });
      //       }

      //       // this.appendProducts(nextItems);
      //     }
      //   }
      //   //toggle nav tab
      // };
    } //render

    appendProducts(items) {
      items.forEach((item, i) => {
        var node = document.createElement(`product-view`);
        node.classList.add('col-6');
        node.classList.add('col-md-3');
        node.classList.add('col-lg-2');
        node.setAttribute('id', guidGenerator());
        readObjProp({ node, obj: item });
        const products = document.getElementById('products');

        products.appendChild(node);
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

function guidGenerator() {
  var S4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return '_' + S4() + S4() + S4() + S4() + S4() + S4();
}
