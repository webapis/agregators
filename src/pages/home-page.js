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
      const root = document.getElementById('root');
      items.forEach((item) => {
        var node = document.createElement('LI');
        var textnode = document.createTextNode(item.title);
        node.appendChild(textnode);
        root.appendChild(node);
      });

      this._items = items;
    }
  }
);
