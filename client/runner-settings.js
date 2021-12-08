customElements.define('runner-settings', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
        const resources = await import('./resources.js')
        await resources.default()
        const {workspace:{workspaceSelected},wfContainer:{selectedContainer},auth: { idToken, localId: uid }}=window.pageStore.state
        
        document.getElementById('ws-breadcrumb').innerText=`Workspace(${workspaceSelected})`
        document.getElementById('wf-runner-breadcrumb').innerText=`Runner settings (${selectedContainer})`
      
     
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.render({ workspaceSelected,selectedContainer })
        
    }

    render({workspaceSelected,selectedContainer}){
        this.innerHTML=`<div>
        <h5>Runner settings:</h5>
        <div id="containers" class="row"></div>
        </div>
        
        `

        document.getElementById('containers').innerHTML = `Loading...`
        window.FB_DATABASE.ref(`workspaces/${workspaceSelected}/containers/${selectedContainer}/workflows`).on('value', (error, response) => {
            const workflows = Object.keys(response.data)
            document.getElementById('containers').innerHTML = ``
            debugger;
            workflows.forEach(c => {
                document.getElementById('containers').insertAdjacentHTML('beforeend', `<settings-card class="m-1 col-3" title="${c}" >${c}</settings-card>`)
            })
         

        })
    }

})


customElements.define('settings-card', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const title =this.getAttribute('title')
        this.innerHTML=`<div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Workflow</h5>
          <h6 class="card-subtitle mb-2 text-muted">${title}</h6>
      
          <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Authentication:</div>
              <button type="button" class="btn btn-link">ENABLE</button>
              <button type="button" class="btn btn-link">DISABLE</button>
            </div>
          
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
              <div class="fw-bold">Settings:</div>
              <button type="button" class="btn btn-link">USER SETTINGS</button>
              <button type="button" class="btn btn-link">DEVELOPER SETTINGS</button>
            </div>
            
          </li>
      
        </ul>
        </div>
      </div>`
    }
})