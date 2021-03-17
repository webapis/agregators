customElements.define(
  'alphabe-page',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
  
    }

    set items(items) {
      debugger;
      this.render({ items });
      this._items = items;
    }

    get items() {
      return this._items;
    }

    render({ items }) {
      const alphabe = items.map(item => {
        const { productName } = item;
        return '<li>' + productName + '</li>';
      });
      this.innerHTML = `
          <div>${alphabe}</div>
        `;
    }
  }
);
