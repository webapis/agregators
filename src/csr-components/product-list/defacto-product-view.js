//import './df-product-view.css';

customElements.define(
  'defacto-product-view',
  class extends HTMLElement {
    constructor() {
      super();
      this._srcset = false;
    }
    connectedCallback() {
      // console.log('window.screen.width', window.screen.width);

      document.addEventListener('scroll', () => {
        if (this.offsetTop >= window.innerHeight) {
          if (
            Math.round(document.body.scrollTop * 100 / this.offsetTop) >= 30
          ) {
            const img = this.querySelector('img');

            const src = this.getAttribute('src');
            img.srcset = src;
          }
        }
      });

      this.render();
    }

    render() {
      const { state: { pattern } } = window.pageStore;
      const title = this.getAttribute('productName');
      const salePrice = this.getAttribute('salePrice');
      const src = this.getAttribute('src');
      const marketPrice = this.getAttribute('marketPrice');
      const discountRate = this.getAttribute('discountRate');
      const discountText = this.getAttribute('discountText');
      const detailLink = this.getAttribute('detailLink');

      boldenPattern(title, pattern);
      // eslint-disable-next-line no-undef
      this.innerHTML = /*html*/ `
        <div class="df-product-item">
          <img src="/components/product-list/image-placeholder.svg"  srcset=${src} class="df-picture" style="width:150px;hight:auto;">
          <a href="${detailLink}" class="df-product-info-title-link">
          <div >${boldenPattern(title, pattern)}</div>
          </a>
          <div class="df-price-info">
          <div>
          <div class="df-market-price" style="${marketPrice === null &&
            'visibility:hidden;'}">${marketPrice}</div>
            <div class ="df-sale-price">${salePrice}</div>
            </div>
            <div class="df-discount-rate-box" style="${discountRate === null &&
              'visibility:hidden;'}">
              <div class="df-discount-rate">${discountRate}</div>
              <div class="df-discount-text">${discountText}</div>
            </div>
          </div>
          </div>
        `;
    }
  }
);

function boldenPattern(word, pattern) {
  if (pattern !== '') {
    const withBold = word.split(' ');

    return withBold
      .map(w => {
        if (pattern.includes(w)) {
          return `<b class="bg-secondary text-light px-1">${w}</b>`;
        } else {
          return w;
        }
      })
      .join(' ');
  }
  return word;
}
