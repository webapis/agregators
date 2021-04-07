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
      this.innerHTML = /*html*/ `

   
     <pl-search-box></pl-search-box>
    <page-tab name="selenekler-tab" title="Seçenekler"></page-tab>
    <page-tab name="urunler-tab" title="Ürünler"></page-tab>
  
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

customElements.define(
  'pl-search-box',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `
        <div class="row">
        <div class="input-group mt-3">
        <input type="text" class="form-control">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Ara</button>
        </div>
        </div>
        `;
    }
  }
);

customElements.define(
  'page-tab',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const name = this.getAttribute('name');
      const title = this.getAttribute('title');
      this.innerHTML = `<a href="#" id=${name} class="nav-link">${title}</a>`;
    }
  }
);


/*

  <ul class=" d-flex justify-content-center border-bottom  border-1 mt-1">
       <a id="secenekler" class="nav-link ${selected === 'secenekler' &&
         'active'}" aria-current="page" href="#">Seçenekler</a>
       <a id="urunler" class="nav-link ${selected === 'urunler' &&
         'active'}" href="#">Ürünler</a>
     </ul>
*/
