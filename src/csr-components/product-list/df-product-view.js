//import './df-product-view.css';
customElements.define(
  'product-view',
  class extends HTMLElement {
    constructor() {
      super();
      this._srcset = false;
    }
    connectedCallback() {
  

      document.addEventListener('scroll', () => {
        if (this.offsetTop >= window.innerHeight) {
          if (
            Math.round(document.body.scrollTop * 100 / this.offsetTop) >= 50
          ) {
            if (!this._srcset) {
              this._srcset = true;
              const img = this.querySelector('img');
              img.srcset = img.getAttribute('data-srcset');

              // console.log('this.offsetTop;', this.offsetTop);
              // console.log(
              //   ' document.body.scrollTop..',
              //   document.body.scrollTop
              // );
              // console.log(
              //   ' in %',
              //   Math.round(document.body.scrollTop * 100 / this.offsetTop)
              // );
              console.log('window.innerHeight', window.innerHeight);
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
      const placeHolder = this.getAttribute('placeHolder');
      boldenPattern(title, pattern);
      // eslint-disable-next-line no-undef
      this.innerHTML = /**/ `
    
        <div class="df-product-item">
          <img src=${placeHolder}  data-srcset=${srcset} class="df-picture">
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
              this._srcset = true;
              const img = this.querySelector('img');
              img.srcset = img.getAttribute('data-srcset');
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
    let bold = [];
    let normal = [];
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
/*
  .map(w => {
        if (pattern.includes(w)) {
          return `<b class="badge bg-primary text-wrap">${w}</b>`;
        } else {
          return w;
        }
      })
      .join(' ');
*/
