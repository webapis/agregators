customElements.define(
  'marka-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      addScriptTag({ src: '../components/navigation-bar.js' });
      this.innerHTML = `
        <div class="container">
        <navigation-bar></navigation-bar>
        <div id='root' class="row">Marka Page</div></div>
        `;
    }
  }
);

const addScriptTag = ({ src }) => {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  document.body.appendChild(s);
};
