customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    async connectedCallback() {
      this.innerHTML = `<div id='root'>My Home Page</div>`;
    }

    get items() {

      return this.items;
    }
    set items(values) {
      
      this.items = values;
    }
  }
);
