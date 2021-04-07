customElements.define(
  'filter-container',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      window.pageStore.subscribe(
        window.actionTypes.PL_PAGE_TAB_SELECTED,
        () => {}
      );

      this.innerHTML = `<div>
        Filter container
        </div>`;
    }
    render() {}
  }
);
