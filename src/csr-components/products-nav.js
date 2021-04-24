customElements.define(
  'products-nav',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      Promise.all([import('./pl-search-box.js')]).then(() => {
        var s = document.createElement('link');
        s.rel = 'stylesheet';
        s.href =
          'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css';
        document.head.appendChild(s);
        this.innerHTML = `
        <pl-search-box></pl-search-box>
        <div class="container">
        <div id="root" class="row">Loading...</div>
        </div>
        `;
      });
      window.addEventListener('load', () => {
        const jsonurl = this.getAttribute('jsonurl');

        fetch(jsonurl).then(result => result.json()).then(data => {
          document.getElementById('root').innerHTML = `${data
            .map(
              d => `
              <div class="col-12 col-md-3">
              <a href="${d.url}">
              <img src="${d.image.placeHolder}" srcset="${d.image
                .scrset}" class="img-thumbnail"/>
              ${d.productNameLabel}${' '}${d.totalItems}
            </a>
            </div>
            `
            )
            .join('')}`;
        });
      });
    }
  }
);

// const component = document.createElement('products-nav');

// document.body.prepend(component);

//${d.productNameLabel}${' '}${d.totalItems}
