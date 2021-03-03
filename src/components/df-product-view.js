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
       debugger;
        // eslint-disable-next-line no-undef
        this.innerHTML = /**/ `
        <style>
        .df-market-price{
          font-weight: 500;
          color: #aaa;
          text-decoration: line-through;
          margin-right: 10px;
          margin-top: 4px;
        }
        .df-sale-price{
          font-weight: 700;
          color: #ff5700;
          font-size: 24px;
        }
        .df-discount-rate-box{
          width: 45px;
          height: 45px;
          color: #fff;
          background-color: #ff5700;
          text-align: center;
          line-height: 13px;
               }
          .df-discount-rate{
            display: block;
            font-size: 16px;
            font-weight: 500;
            margin-top: 10px;
          }
          .df-discount-text{
            font-size: 8px;
          }
          .df-price-info{
            display:flex;
            justify-content:space-between;
          }
          .df-product-item{
            display:flex;
            flex-direction:column;
            padding:3px;
          }
          .df-product-info-title-link{
            color:#636363;
            text-decoration: none;
           background-color: transparent;
          }
          .df-product-info-title-link:hover{
            color:#636363;
            text-decoration: underline;
        
          }
          .df-picture{
            width: 100%;
            height: auto;
            transition: all .8s;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
          }
        </style>
        <div class="df-product-item">
          <img src=${placeHolder} srcset=${srcset} class="df-picture">
          <a href="${detailLink}" class="df-product-info-title-link">
          <div>${title}</div>
          </a>
      
          <div class="df-price-info">
          <div class="df-market-price">${marketPrice}</div>
            <div class ="df-sale-price">${salePrice}</div>
            <div class="df-discount-rate-box">
              <div class="df-discount-rate">${discountRate}</div>
              <div class="df-discount-text">${discountText}</div>
            </div>
          </div>
          </div>
        `;
      }
    }
  );
