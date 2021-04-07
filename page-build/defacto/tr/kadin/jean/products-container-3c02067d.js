customElements.define(
    'products-container',
    class extends HTMLElement {
      constructor() {
        super();
      }
  
      connectedCallback() {}
  
      render({ selected, value }) {
        const height = document.body.clientHeight;
        this.innerHTML = /*html*/ `
         
          <pl-page-tabs></pl-page-tabs>
            <div  id="root">
            <div id="urun-container" class="row ${selected !== 'urunler' &&
              'd-none'} position-fixed" style="height:${height}px; overflow: auto;" >
              <pl-search-result class="pt-5"></pl-search-result>
              </div>
            <div id="secenekler-container" class="row ${selected !==
              'secenekler' && 'd-none'} bg-info">
              <pl-secenekler></pl-secenekler>
              <div>
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
        const urunContainer = document.getElementById('urun-container');
        urunContainer.addEventListener('scroll', () => {
          const { state: { autoscroll } } = window.pageStore;
          if (autoscroll) {
            if (
              urunContainer.scrollTop + urunContainer.clientHeight ===
              urunContainer.scrollHeight
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
          document.getElementById('urun-container').appendChild(node);
        });
      }
    }
  );
