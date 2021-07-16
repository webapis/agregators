customElements.define(
  'products-container',
  class extends HTMLElement {
    constructor() {
      super();
    }

    async connectedCallback() {
      const fileName = document.location.href
      .substr(document.location.href.lastIndexOf('/') + 1)
      .replace('.html', '');

      if(!document.getElementById('products')){
        debugger;
        document.body.insertAdjacentHTML('afterbegin',   `<div class="container">
        <nav-component class="bg-info"></nav-component>
          <div class="row" id="products"></div>
        </div>
        `)
        const response = await fetch(`./${fileName}-0.json`);
        const data = await response.json();
        this.appendProducts(data)

      }
    

      let pageNum = 1;
      // document.onscroll = async () => {
      //   console.log('scrolling page.....????/');
      //   const { state: { autoscroll } } = window.pageStore;
      //   if (autoscroll) {
      //     if (
      //       document.body.scrollTop + document.body.clientHeight ===
      //       document.body.scrollHeight
      //     ) {
      //       console.log('Fetch started');
      //       const response = await fetch(`./${fileName}-${pageNum}.json`);
      //       const data = await response.json();
      //       window.fetched = true;
      //       const product = document.getElementById('products')
      //       this.appendProducts(data, product);
      //       pageNum++;
      //     }
      //   }
      //   //toggle nav tab
      // };
    }

    appendProducts(items) {
   
      items.forEach((item, i) => {
   
        var node = document.createElement(`product-view`);
        node.setAttribute('id', guidGenerator());
        readObjProp({ node, obj: item });
  
        document.getElementById('products').appendChild(node);
        
      //   this.parentNode.removeChild(this)
      });
    }
  }
);

function readObjProp({ node, obj }) {
  for (let attribute in obj) {
    const current = obj[attribute];
    let type = typeof current;

    if (type === 'string') {
      node.setAttribute(`${attribute}`, current);
      if (attribute === 'srcset') {
        console.log('srcset', obj[attribute]);
      }
    } else if (type === 'object') {
      readObjProp({ node, obj: current });
    }
  }
}

function guidGenerator() {

  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return '_' + S4() + S4() + S4() + S4() + S4() + S4();

}

if(!document.querySelector('products-container')){
  document.getElementById('root').appendChild(document.createElement('products-container'))
}

