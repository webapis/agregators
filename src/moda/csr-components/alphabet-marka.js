customElements.define(
  'alphabet-marka',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render({ selected: 'defacto-count' });
      window.pageStore.subscribe(
        window.actionTypes.SELECTED_MARKA_COUNT,
        state => {
          const { selected } = state;

          this.render({ selected });
        }
      );
    }

    render({ selected }) {
      const title = this.getAttribute('title');
      const defactoCount = this.getAttribute('defacto-count');
      const kigiliCount = this.getAttribute('kigili-count');
      this.innerHTML = /*html*/ `
        <div class="border-bottom d-flex align-items-start ps-3">
        <a href="#" class="nav-link col-2">
       ${title}
        </a>
        <div class="col-10 d-flex">
          <marka-icon selected=${selected} count=${defactoCount}  id="defacto-count" title="defacto" ></marka-icon>
          <marka-icon selected=${selected} count=${kigiliCount}  imgHeight="25" id="kigili-count" title="kiğili" ></marka-icon>
        </div>`;
      this.querySelectorAll('a').forEach(element => {
        element.addEventListener('click', e => {
          const { id } = e.currentTarget;

          window.pageStore.dispatch({
            type: window.actionTypes.SELECTED_MARKA_COUNT,
            payload: id
          });
        });
      });
    }
  }
);

customElements.define(
  'marka-icon',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const selected = this.getAttribute('selected');
      const count = this.getAttribute('count');
      const title = this.getAttribute('title');

      const id = this.getAttribute('id');

      this.innerHTML = `
      </a>
      <div class="col-10 d-flex">
      <a id=${id} class="nav-link   ${selected === id &&
        'border-secondary border-bottom border-2 bg-light'}" aria-current="page" href="#" style="${selected !==
        id && 'opacity:.50;'}">
     
          ${title}
      <span class="badge rounded-pill bg-light text-dark">${count}</span>
     
      </a>
      `;
    }
  }
);
