customElements.define(
  'products-container',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { selected_pl_tab, items } } = window.pageStore;
      if (selected_pl_tab === 'urunler-tab') {
        this.render({ value: items });
      }
      window.pageStore.subscribe(
        window.actionTypes.PL_PAGE_TAB_SELECTED,
        () => {
          const { state: { selected_pl_tab, items } } = window.pageStore;
          if (selected_pl_tab === 'urunler-tab') {
            this.render({ value: items });
          } else {
            this.innerHTML = ``;
          }
        }
      );

      window.pageStore.subscribe(window.actionTypes.PRODUCT_ITEMS_SET, () => {
        const { state: { selected_pl_tab, items } } = window.pageStore;

        if (selected_pl_tab === 'urunler-tab') {
          this.render({ value: items });
        }
      });
    }

    render({ value }) {
      const height = document.body.clientHeight;
      this.innerHTML = `<div class="container">
      <div class="row">
      <div class="col">
      <div>Search resultTCG</div>
      </div>
      </div>
        <div id="products" class="row" style="height:${height}"></div>
        </div>`;
      const productContainer = document.getElementById('products');

      this.style.height = `${height}px;`;
      if (value) {
        document.title = value.pageTitle;
        const descriptionTag = document.createElement('meta');
        descriptionTag.type = 'description';
        descriptionTag.content = value.pageDescription;
        document.querySelector('head').appendChild(descriptionTag);
        this.appendProducts(value.items);
      }

      this.addEventListener('scroll', () => {
        const { state: { autoscroll } } = window.pageStore;
        if (autoscroll) {
          if (
            productContainer.scrollTop + productContainer.clientHeight ===
            productContainer.scrollHeight
          ) {
            const { state: { items: { items } } } = window.pageStore;
            const itemTags = document.getElementsByTagName('product-view');
            const nextItems = items.slice(
              itemTags.length,
              itemTags.length + 70
            );
            this.appendProducts(nextItems);
          }
        }

        //toggle nav tab
      });
    } //render

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
        document.getElementById('products').appendChild(node);
      });
    }
  }
);
