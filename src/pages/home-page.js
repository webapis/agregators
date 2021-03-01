customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.setAttribute('id', 'container');
      this.innerHTML = `<div id='root'>My Home Page</div>`;
    }

    get items() {
      return this._items;
    }
    set items(items) {
      document.getElementById(
        'root'
      ).innerHTML = `<div id='root'>I am changed:${items.length}</div>`;
      this._items = items;
    }
  }
);
