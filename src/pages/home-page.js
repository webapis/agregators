customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.setAttribute('id', 'container');
      this.innerHTML = `<div class="container"> <div id='root' class="row"></div></div>`;
    }

    get items() {
      return this._items;
    }
    set items(items) {
      const root = document.getElementById('root');
      items.forEach((item) => {
        const {
          productInfo: {
            title,
            salePrice,
            marketPrice,
            discountRate,
            discountText,
          },
          picture: {
            img: { scrset },
            a: { detailLink },
          },
        } = item;
        var node = document.createElement('product-view');
        node.classList.add('col-2')
        node.setAttribute('title', title);
        node.setAttribute('salePrice', salePrice);
        node.setAttribute('marketPrice', marketPrice);
        node.setAttribute('discountRate', discountRate);
        node.setAttribute('discountText', discountText);
        node.setAttribute('detailLink', detailLink);
        node.setAttribute('srcset', scrset);
        root.appendChild(node);
      });

      this._items = items;
    }
  }
);

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
        <img srcset=${srcset} class="df-picture">
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

/*
container.items = [
  {
    mainMenuTitle: 'AKSESUAR',
    subMenuTitle: 'ERKEK',
    title: 'DeFacto Erkek Saat | DeFacto',
    dataDocument:
      '{ "DiscountRate": 0.0, "ProductId": "227153c2-eef3-453a-94e4-c68b554070cd", "ProductVariantId": "00000000-0000-0000-0000-000000000000", "ProductName": "Metal Saat", "ProductVariantName": null, "ProductGtmName": null, "ProductNames": [ { "LanguageIndex": 1, "ProductName": "Metal Saat" } ], "ProductPictures": [ { "ProductPictureIsDefault": true, "ProductPictureOrder": 1, "ProductPicturePath": "T4140AZ_20WN_BK21_01_01.jpg" } ], "ProductPriceInclTax": 129.99, "ProductVariantDiscountedPriceInclTax": 129.99, "ProductVariantIndex": 1554158, "StampImages": [], "StampImagesV2": [ { "StampImageId": "25c530b9-4511-4d88-ab23-13be2af15fea", "ShopByIndex": null, "StampImagePath": "onlineozell.png", "StampImagePositions": [ { "StampImageVerticalMargin": 70, "StampImageHorizontalMargin": 263, "StampImageVerticalAlignmentTypeId": "8ed64f64-3070-4837-a3dc-6ac82fdb213a", "StampImageHorizontalAlignmentTypeId": "0f8ad332-0106-4534-a9c2-31f4a1ad0fe3", "StampPlatformTypeId": "90399635-fd36-46c1-b1cd-59c9194039dd", "StampSectionTypeId": "73126b61-4100-43f3-b490-7e1ae2e8f465" }, { "StampImageVerticalMargin": 70, "StampImageHorizontalMargin": 263, "StampImageVerticalAlignmentTypeId": "8ed64f64-3070-4837-a3dc-6ac82fdb213a", "StampImageHorizontalAlignmentTypeId": "0f8ad332-0106-4534-a9c2-31f4a1ad0fe3", "StampPlatformTypeId": "c43a5985-6d4a-4243-8238-c9c6397ba00d", "StampSectionTypeId": "73126b61-4100-43f3-b490-7e1ae2e8f465" }, { "StampImageVerticalMargin": 70, "StampImageHorizontalMargin": 263, "StampImageVerticalAlignmentTypeId": "8ed64f64-3070-4837-a3dc-6ac82fdb213a", "StampImageHorizontalAlignmentTypeId": "0f8ad332-0106-4534-a9c2-31f4a1ad0fe3", "StampPlatformTypeId": "ebddb3e4-4029-4b14-9194-eff6db0d20e9", "StampSectionTypeId": "73126b61-4100-43f3-b490-7e1ae2e8f465" } ] } ], "StampImagesV2ViewModel": null, "ProductSeoName": "metal-saat", "CurrencyDisplay": "TL", "ProductLongCode": "T4140AZ20WNBK21", "Color": { "ColorIndex": 9600, "ColorName": "Siyah" }, "ColorGtmName": "", "PriceRange": null, "Sizes": [ { "SizeIndex": 244, "SizeName": "STD" } ], "IsOutlet": false, "Stock": 1, "ProductVariantColorNames": [ { "ColorIndex": 9600, "ColorName": "Siyah" } ], "ProductClassificationIndex": 61, "ProductMainCode": "T4140AZBK21", "FastDeliveryEnabled": false, "CampaignBadge": null, "CategoriesLvl1": [ { "CategoryIndex": 1, "DisplayOrder": null, "CategoryName": null } ], "CategoriesLvl2": [ { "CategoryIndex": 3, "DisplayOrder": null, "CategoryName": null } ], "CategoriesLvl3": [ { "CategoryIndex": 116, "DisplayOrder": null, "CategoryName": "Saat" } ]}',
    picture: {
      a: {
        detailLink: 'https://www.defacto.com.tr/metal-saat-1554158',
      },
      img: {
        scrset:
          'https://dfcdn.defacto.com.tr/252/T4140AZ_20WN_BK21_01_01.jpg 525w,//dfcdn.defacto.com.tr/304/T4140AZ_20WN_BK21_01_01.jpg 773w,//dfcdn.defacto.com.tr/320/T4140AZ_20WN_BK21_01_01.jpg 2000w,//dfcdn.defacto.com.tr/376/T4140AZ_20WN_BK21_01_01.jpg 3000w',
        placeHolder:
          'https://dfcdn.defacto.com.tr/Assets/dist/images/product-place-holder.svg',
      },
    },
    onlineozel: {
      img: {
        src: 'https://dfcdn.defacto.com.tr/patlangac/tr-tr/onlineozell.png',
      },
    },
    buyukBeden: {
      img: {
        src: null,
      },
    },
    productInfo: {
      title: 'METAL SAAT',
      salePrice: '129,99 TL',
      marketPrice: null,
      discountRate: null,
      discountText: null,
    },
  },
];
*/
