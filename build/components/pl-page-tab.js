customElements.define(
  'pl-page-tabs',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `
     <ul class="nav nav-tabs">
      <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="#">Seçenekler</a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#">Ürünler</a>
      </li>
    </ul>`;
    }
  }
);

const addScriptTag = ({ src }) => {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  document.body.appendChild(s);
};

const addLinkTag = ({ href }) => {
  var s = document.createElement('link');
  s.rel = 'stylesheet';
  s.href = href;
  document.head.appendChild(s);
};
