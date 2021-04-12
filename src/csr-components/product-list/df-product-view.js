//import './df-product-view.css';

customElements.define(
  'product-view',
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
            if (!this._srcset) {
              const img = this.querySelector('img');
              this._srcset = true;
              const screenWidth = window.screen.width;
              const defaultScr = this.getAttribute('srcset');
              const srcCurrent = defaultScr.substring(
                0,
                defaultScr.indexOf('525w')
              );

              if (screenWidth <= 525) {
                img.src = srcCurrent;
              } else if (screenWidth > 525 && screenWidth < 773) {
                img.src = srcCurrent.replace('/252/', '/304/');
              } else if (screenWidth >= 773 && screenWidth < 2000) {
                img.src = srcCurrent.replace('/252/', '/320/');
              } else if (screenWidth > 2000) {
                img.src = srcCurrent.replace('/252/', '/376/');
              }
            } else {
              console.log('I am set');
            }
          }
        }
      });

      const { state: { pattern } } = window.pageStore;
      const title = this.getAttribute('title');
      const salePrice = this.getAttribute('salePrice');
      const srcset = this.getAttribute('srcset');
      const marketPrice = this.getAttribute('marketPrice');
      const discountRate = this.getAttribute('discountRate');
      const discountText = this.getAttribute('discountText');
      const detailLink = this.getAttribute('detailLink');

      boldenPattern(title, pattern);
      // eslint-disable-next-line no-undef
      this.innerHTML = /**/ `
        <div class="df-product-item">
          <img src="/components/product-list/image-placeholder.svg"  data-srcset=${srcset} class="df-picture img-fluid">
          <a href="${detailLink}" class="df-product-info-title-link">
          <div >${boldenPattern(title, pattern)}</div>
          </a>
          <div class="df-price-info">
          <div class="df-market-price" style="${marketPrice === 'null' &&
            'visibility:hidden;'}">${marketPrice}</div>
            <div class ="df-sale-price">${salePrice}</div>
            <div class="df-discount-rate-box" style="${discountRate ===
              'null' && 'visibility:hidden;'}">
              <div class="df-discount-rate">${discountRate}</div>
              <div class="df-discount-text">${discountText}</div>
            </div>
          </div>
          </div>
        `;

      if (this.offsetTop <= window.innerHeight) {
        if (!this._srcset) {
          const img = this.querySelector('img');
          this._srcset = true;
          const screenWidth = window.screen.width;
          const defaultScr = this.getAttribute('srcset');
          const srcCurrent = defaultScr.substring(
            0,
            defaultScr.indexOf('525w')
          );

          if (screenWidth <= 525) {
            img.src = srcCurrent;
          } else if (screenWidth > 525 && screenWidth < 773) {
            img.src = srcCurrent.replace('/252/', '/304/');
          } else if (screenWidth >= 773 && screenWidth < 2000) {
            img.src = srcCurrent.replace('/252/', '/320/');
          } else if (screenWidth > 2000) {
            img.src = srcCurrent.replace('/252/', '/376/');
          }

          console.log('window.innerHeight', window.innerHeight);
        } else {
          console.log('I am set');
        }
      }
    }

    set imgSrc(value) {
      this._srcset = value;
    }

    get imgSrc() {
      return this._srcset;
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
