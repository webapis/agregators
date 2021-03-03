const BOOTSTRAP_CSS =
  '  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">';
customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = '../components/df-product-view.js';
      document.body.appendChild(s);
      this.setAttribute('id', 'container');
      document.head.innerHTML = `
        ${BOOTSTRAP_CSS}
      `;
      this.innerHTML = `
      <div class="container"> <div id='root' class="row"></div></div>
      `;
    }

    get items() {
      return this._items;
    }
    set items(items) {
      const root = document.getElementById('root');
      items.forEach(item => {
        const {
          productInfo: {
            title,
            salePrice,
            marketPrice,
            discountRate,
            discountText
          },
          picture: { img: { scrset,placeHolder }, a: { detailLink } }
        } = item;
        var node = document.createElement('product-view');
        node.classList.add('col-sm-6');
        node.classList.add('col-xl-3');
        node.setAttribute('title', title);
        node.setAttribute('salePrice', salePrice);
        node.setAttribute('marketPrice', marketPrice);
        node.setAttribute('discountRate', discountRate);
        node.setAttribute('discountText', discountText);
        node.setAttribute('detailLink', detailLink);
        node.setAttribute('srcset', scrset);
        node.setAttribute('placeHolder', placeHolder);
        root.appendChild(node);
      });

      this._items = items;
    }
  }
);
