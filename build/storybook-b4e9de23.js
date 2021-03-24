customElements.define(
  'product-list-page',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      addScriptTag({ src: '../components/df-product-view.js' });
      this.innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script> 
      <div class="container">
        <div id="root" class="row"></div>
      </div>`;
    }

    get items() {
      return this._items;
    }

    set items(value) {
      this._items = value;
      document.title = value.pageTitle;
      const descriptionTag = document.createElement('meta');
      descriptionTag.type = 'description';
      descriptionTag.content = value.pageDescription;
      document.querySelector('head').appendChild(descriptionTag);

      this.render(value.items);
    }

    render(items) {
      items.filter((it, i) => i < 76).forEach(item => {
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
        document.getElementById('root').appendChild(node);
      });
    }
  }
);

const addScriptTag = ({ src }) => {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  document.body.appendChild(s);
};

customElements.define(
  'product-list-page-storybook',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      fetch('./items/kadin-jean-pantolonPage.json')
        .then(response => {
          return response.json();
        })
        .then(data => {
            this.innerHTML = `<product-list-page></product-list-page>`;
          document.querySelector('product-list-page').items = data;
          
        });

    
     
    }
  }
);

// import './alphabet-page.storybook'

document.body.innerHTML = `<product-list-page-storybook></product-list-page-storybook>`;
