customElements.define(
  'navigation-bar',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `
      <div>
      <div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Search"  aria-describedby="basic-addon2">
  <span class="input-group-text" id="basic-addon2">Search </span>
</div>
      <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#">YENI GELENLER</a>
      </li> 
      <li class="nav-item">
        <a class="nav-link" href="#">KADIN</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">ERKEK</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">ÇOCUK & GENÇ</a>
      </li>
      <li class="nav-item">
      <a class="nav-link" href="#">BEBEK</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">AYAKKABI</a>
  </li>
  <li class="nav-item">
  <a class="nav-link" href="#">AKSESUAR</a>
</li>
  <li class="nav-item">
  <a class="nav-link" href="#">OUTLET</a>
</li>
    </ul>
    </div>
    `;
    }
  }
);
