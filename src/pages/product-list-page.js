customElements.define(
  'product-list-page',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `<div>ProductListPage Component</div>`;
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
      debugger;
      this.render(value.items);
    }

    render(items) {
      debugger;
      this.innerHTML = items.map(item => {
        return `<li>${item.productName}</li>`;
      });

      debugger;
    }
  }
);
