import './df-product-view.css';
customElements.define(
  'product-view',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
    
      const title = this.getAttribute('title');
      const salePrice = this.getAttribute('salePrice');
      const srcset = this.getAttribute('srcset');
      const marketPrice = this.getAttribute('marketPrice');
      const discountRate = this.getAttribute('discountRate');
      const discountText = this.getAttribute('discountText');
      const detailLink = this.getAttribute('detailLink');
      const placeHolder = this.getAttribute('placeHolder');

      // eslint-disable-next-line no-undef
      this.innerHTML = /**/ `

        <div class="df-product-item">
          <img src=${placeHolder} srcset=${srcset} class="df-picture">
          <a href="${detailLink}" class="df-product-info-title-link">
          <div>${title}</div>
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
    }
  }
);
