customElements.define(
  'pl-secenekler',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      //   window.pageStore.subscribe(
      //     window.actionTypes.PL_PAGE_TAB_SELECTED,
      //     state => {
      //       const { selected_pl_tab, items: { wordPatterns } } = state;

      //       if (selected_pl_tab === 'secenekler') {
      //       //  debugger;
      //         this.innerHTML = `<div>ssdsdsd</div>`;
      //       }
      //     }
      //   );

      const {
        state: { selected_pl_tab, items: { wordPatterns } }
      } = window.pageStore;
      this.render(wordPatterns);
    }

    render(wordPatterns) {
      this.innerHTML = `<div class="list-group">${wordPatterns &&
        wordPatterns
          .map(
            w =>
              `<button type="button" id= ${w.sw} class="list-group-item list-group-item-action" > 
              ${w.sw}
              </button>`
          )
          .join(' ')}<div>`;

      const btns = this.querySelectorAll('.list-group-item-action');
      btns.forEach(b => {
        b.addEventListener('click', e => {
          const id = e.target.id;
          window.pageStore.dispatch({
            type: window.actionTypes.PATTERN_SELECTED,
            payload: id
          });
          console.log('I amd clicked', id);
        });
      });
    }
  }
);
