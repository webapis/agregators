customElements.define(
  'pl-page-tabs',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      window.onscroll = () => {
        const { state: { scrollTop, selected_pl_tab } } = window.pageStore;
        if (scrollTop <= document.body.scrollTop) {
          console.log('Scrolling to Bottom++++++++++++++++');
          this.innerHTML = ``;
        }
        if (scrollTop > document.body.scrollTop) {
          this.render({ selected: selected_pl_tab });
          console.log('Scrolling to Top----');
        }
        window.pageStore.dispatch({
          type: window.actionTypes.PAGE_SCROLLED,
          payload: document.body.scrollTop
        });
        console.log('document.body.scrollTop', document.body.scrollTop);
        console.log('state.scrollTop', scrollTop);
      };
      if (window.pageStore) {
        const { state: { selected_pl_tab } } = window.pageStore;

        this.render({ selected: selected_pl_tab });

        window.pageStore.subscribe(
          window.actionTypes.PL_PAGE_TAB_SELECTED,
          state => {
            const { selected_pl_tab } = state;

            this.render({ selected: selected_pl_tab });
          }
        );
      }
    }

    render({ selected }) {
      this.innerHTML = `
      <ul class="nav nav-tabs position-fixed  bg-light w-100" st>
       <li class="nav-item">
       <a id="secenekler" class="nav-link ${selected === 'secenekler' &&
         'active'}" aria-current="page" href="#">Seçenekler</a>
       </li>
       <li class="nav-item">
       <a id="urunler" class="nav-link ${selected === 'urunler' &&
         'active'}" href="#">Ürünler</a>
       </li>
     </ul>`;
      this.querySelectorAll('a').forEach(element => {
        element.addEventListener('click', e => {
          e.preventDefault();
          const { id } = e.currentTarget;
          window.pageStore.dispatch({
            type: window.actionTypes.PL_PAGE_TAB_SELECTED,
            payload: id
          });
        });
      });
    }
  }
);
