customElements.define(
  'filter-container',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `<div>
        Filter container
        </div>`;
    }
    render() {}
  }
);
