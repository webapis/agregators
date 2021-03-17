customElements.define(
  'search-bar',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `
        
        <div class="input-group mb-3 mt-5">
  <input type="text" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon2">
  <span class="input-group-text" id="basic-addon2">Search</span>
  
</div>`;
    }
  }
);
