customElements.define(
  'pl-page-tabs',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const urunCoontainer = document.getElementById('urun-container');
      urunCoontainer.onscroll = () => {
        const { state: { scrollTop, selected_pl_tab } } = window.pageStore;
        if (scrollTop <= urunCoontainer.scrollTop) {
          this.innerHTML = ``;
        }
        if (scrollTop > urunCoontainer.scrollTop) {
          this.render({ selected: selected_pl_tab });
        }
        window.pageStore.dispatch({
          type: window.actionTypes.PAGE_SCROLLED,
          payload: urunCoontainer.scrollTop
        });
      };
      window.pageStore.subscribe('');
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
      <div class="nav nav-tabs position-fixed bg-light d-flex justify-content-center flex-column" style="z-index:1000;border-bottom:5px solid white;width:100%;">

      <div class="input-group mb-3 mt-5">
      <input type="text" class="form-control">
      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Ara</button>
  
    </div>
      <ul class="nav nav-tabs">
       <li class="nav-item">
       <a id="secenekler" class="nav-link ${selected === 'secenekler' &&
         'active'}" aria-current="page" href="#">Seçenekler</a>
       </li>
       <li class="nav-item">
       <a id="urunler" class="nav-link ${selected === 'urunler' &&
         'active'}" href="#">Ürünler</a>
       </li>
     </ul>
     <div>
     `;
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