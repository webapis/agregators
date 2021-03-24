const BOOTSTRAP_CSS =
  '  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">';
customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      addScriptTag({ src: '../components/search-bar-csr.js' });

      import('./kadin-jean-navigation-ssr-75efbeef.js').then(() => {
        this.innerHTML = `
        <div class="container">
        <search-bar-csr></search-bar-csr>
        <kadin-jean-navigation-ssr></kadin-jean-navigation-ssr>
        </div>
       
        `;
      });

      this.setAttribute('id', 'container');
      document.head.innerHTML = `
        ${BOOTSTRAP_CSS}
      `;
    }

    get items() {
      return this._items;
    }
    set items(items) {
      this._items = items;
    }
  }
);

const addScriptTag = ({ src }) => {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  document.body.appendChild(s);
};

document.body.innerHTML = `

<home-page></home-page>
`;
