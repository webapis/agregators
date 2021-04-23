customElements.define(
  'prerender-component',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const jsonUrl = this.getAttribute('jsonurl');

      window.prerender = () => {
        this.render();
        console.log('prerendering.....');
        if (jsonUrl) {
          console.log('fetching data.......!!!!!!!!!!????');
          fetch(jsonUrl).then(response => response.json()).then(items => {
            window.pageStore.dispatch({
              type: window.actionTypes.PRERENDER_DATA,
              payload: items
            });
          });

          // window.pageStore.subscribe(window.actionTypes.IMG_TAGS_LOADED, () => {
          //   const images = document.getElementsByTagName('img');
          //   let i = 0;
          //   for (i; i < images.length; i++) {
          //     const img = images[i];
          //     const dataUrl = getBase64Image(img.src);
          //     img.src = dataUrl;
          //   }
          //   // debugger;
          // });
        }
      };
    }

    render() {
      const root = document.createElement('div');
      root.classList.add('container');
      root.id = 'root';
      const productsContainer = document.createElement('div');
      productsContainer.id = 'products';
      productsContainer.style.height = '300px';
      productsContainer.style.position = 'relative';
      productsContainer.classList.add('row');
      root.appendChild(productsContainer);
      document.body.appendChild(root);
    }
  }
);
