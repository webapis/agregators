
const result = []

customElements.define('monitor-component', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `<div>
          <monitor-top-panel></monitor-top-panel>
          <monitor-bottom-panel></monitor-bottom-panel>
        </div>`
    }
})





customElements.define('monitor-top-panel', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>
        <div class="row">

        <ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="#">Main Panel</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="#">Configuations</a>
  </li>
 

</ul>
       <srape-config class="col"></srape-config>
       <srape-start-cancel class="col"></srape-start-cancel>
        </div>
        </div>`
    }
})

customElements.define('monitor-bottom-panel', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>Monitor bottom panel</div>`
    }
})



customElements.define('srape-config', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `
        <h4>Configurations:</h4>
        <div class="d-flex flex-column">
        <button class="btn btn-info m-1">Save to Temporary Location </button>
        <button class="btn btn-info m-1">Save to My Google Drive</button>
        <button class="btn btn-info m-1">Send Me Email Alert</button>
        </div>`
    }
})


customElements.define('srape-start-cancel', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = ` 
        <div >
        <button class="btn btn-primary btn-lg">Start Scraping</button>
        <button class="btn btn-warning btn-lg">Cancel Scraping</button>
        </div>
       `
    }
})