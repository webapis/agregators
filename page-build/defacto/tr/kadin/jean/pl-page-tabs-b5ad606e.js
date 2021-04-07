customElements.define(
  'pl-page-tabs',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
    }

    render() {
      this.innerHTML = /*html*/ `
     <pl-search-box></pl-search-box>
     <page-tabs></page-tabs>
     `;
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
        <div class="container">
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
  'page-tabs',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = /*html*/ `
      <div class="container d-flex">
      <page-tab name="selenekler-tab" title="Seçenekler" class="border-bottom  border-4"></page-tab>
      <page-tab name="urunler-tab" title="Ürünler"></page-tab>
      </div>
      <div class="border-bottom"></div>
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
      this.querySelector('a').addEventListener('click', e => {
        e.preventDefault();
        const { id } = e.currentTarget;
        window.pageStore.dispatch({
          type: window.actionTypes.PL_PAGE_TAB_SELECTED,
          payload: id
        });
      });

      window.pageStore.subscribe(
        window.actionTypes.PL_PAGE_TAB_SELECTED,
        state => {
          const { selected_pl_tab } = state;
          if (selected_pl_tab === name) {
            console.log('I am clicked', name);
            this.classList.add('border-bottom');
            this.classList.add('border-4');
            
          } else {
            this.classList.remove('border-bottom');
            this.classList.remove('border-4');
          }
        }
      );
    }
  }
);
