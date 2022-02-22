customElements.define('runner-logs', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()
        const { workspace: { workspaceSelected }, wfContainer: { selectedContainer }, auth: { idToken, localId: uid } } = window.pageStore.state

        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceSelected})`
        document.getElementById('wf-runner-breadcrumb').innerText = `Runner logs (${selectedContainer})`
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.render({ workspaceSelected, selectedContainer })

    }

    render({ workspaceSelected, selectedContainer }) {
        this.innerHTML = `<div>
        <h5>Runner logs:</h5>
        <div id="containers" class="row"></div>
        </div>
        `
        document.getElementById('containers').innerHTML = `Loading...`
        window.FB_DATABASE.ref(`workspaces/${workspaceSelected}/containers/${selectedContainer}/workflows`).on('value', (error, response) => {
            const workflows = Object.keys(response.data)
            document.getElementById('containers').innerHTML = ``
            debugger;
            workflows.forEach(c => {
                document.getElementById('containers').insertAdjacentHTML('beforeend', `<log-card class="m-1 col-3" title="${c}" >${c}</log-card>`)
            })

        })
    }
})


customElements.define('log-card', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const title = this.getAttribute('title')
        this.innerHTML = `<div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Workflow</h5>
          <h6 class="card-subtitle mb-2 text-muted">${title}</h6>
          <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Started</div>
              00000000000
            </div>
         
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Completed</div>
             00000000000
            </div>
          
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Duration</div>
             000000
            </div>
        
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Result</div>
           Successful
          </div>
      
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">Output</div>
          <a href="#" class="card-link">Go to output</a>
        </div>
    
      </li>
  
        </ul>

        </div>
        <div class="card-footer">
        <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
   
        </div>
      </div>`
    }

})

customElements.define('log-component', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        this.innerHTML=`<div></div>`
    }
})