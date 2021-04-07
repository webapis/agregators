customElements.define(
  'pl-search-box',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `<div class="input-group mt-3">
        <input type="text" class="form-control">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Ara</button>
        </div>`;
    }
  }
);
