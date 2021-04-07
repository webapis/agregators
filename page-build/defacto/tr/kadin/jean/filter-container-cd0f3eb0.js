customElements.define(
  'filter-container',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { selected_pl_tab } } = window.pageStore;
      if (selected_pl_tab === 'secenekler-tab') {
        this.render();
      }
      window.pageStore.subscribe(
        window.actionTypes.PL_PAGE_TAB_SELECTED,
        () => {
          const { state: { selected_pl_tab } } = window.pageStore;
          if (selected_pl_tab === 'secenekler-tab') {
            this.render();
          } else {
            this.innerHTML = ``;
          }
        }
      );
    }
    render() {
      this.innerHTML = `<div>
        <pl-secenekler></pl
        </div>`;
    }
  }
);
