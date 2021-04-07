let plPageTabsTemplate = document.createElement('template');
plPageTabsTemplate.innerHTML = `<slot></slot>`;

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
      this.appendChild(plPageTabsTemplate.content.cloneNode(true));
    }
  }
);

function tabRender({ name,title }) {
  let pageTabTemplate = document.createElement('template');
  pageTabTemplate.innerHTML = `
  
    <slot name="title"></slot>
    <a href="#">${title}</a>
 
  `;

  this.appendChild(pageTabTemplate.content.cloneNode(true));
}

customElements.define(
  'page-tab',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const name = this.getAttribute('name');
      tabRender.call(this, { name });
    }
  }
);

/*
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
      this.innerHTML =`
      <div class="nav nav-tabs position-fixed bg-light d-flex  flex-column justify-content-center" style="z-index:1000;width:100%;">
      <div class="row justify-content-center">
      <div class="col-md-6">
      <div class="input-group mt-5">
      <input type="text" class="form-control">
      <button class="btn btn-outline-secondary" type="button" id="button-addon2">Ara</button>
      </div>
      </div>
    </div>
      <ul class=" d-flex justify-content-center border-bottom  border-1 mt-1">
       
       <a id="secenekler" class="nav-link ${selected === 'secenekler' &&
         'active'}" aria-current="page" href="#">Seçenekler</a>
       <a id="urunler" class="nav-link ${selected === 'urunler' &&
         'active'}" href="#">Ürünler</a>
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

*/
