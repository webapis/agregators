customElements.define('main-tabs', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = `

        <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Monitor</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Upload</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Email</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="#">Database</a>
      </li>
     
      </ul>
      <monitor-component></monitor-component>
      `
  }
})