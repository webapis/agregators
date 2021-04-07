customElements.define(
  'filter-container',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      window.pageStore.subscribe(
        window.actionTypes.PL_PAGE_TAB_SELECTED,
        () => {
        }
      );

      
    }
    render() {
        this.innerHTML = `<div>
        Filter container
        </div>`;
    }
  }
);
