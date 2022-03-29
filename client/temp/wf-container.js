customElements.define('wf-container', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
        const resources = await import('./resources.js')
        await resources.default()
        const {workspace:{workspaceSelected},wfContainer:{selectedContainer},auth: { idToken, localId: uid }}=window.pageStore.state
        document.getElementById('ws-breadcrumb').innerText=`Workspace(${workspaceSelected})`
        document.getElementById('wf-container-breadcrumb').innerText=`Container(${selectedContainer})`
  
        this.innerHTML=`<div>
        <div class="d-flex">
        <h5>Container:</h5>
        <h5 class="text-muted text-uppercase mx-2">${selectedContainer}</h5>
        </div>
        <a class="btn btn-outline-secondary" href="/workflow-editor.html">Add workflow</a>
        <h5>Workflows:</h5>
        <div id="workflows" class="row"></div>
        </div>`


   const response =   await  window.firebase().ref(`workspaces/${workspaceSelected}/containers/${selectedContainer}/workflows`).on('value', (error, response) => {
          if(response.data){
            const workflows = Object.keys(response.data)
            document.getElementById('workflows').innerHTML = ``
            
            workflows.forEach(c => {
                document.getElementById('workflows').insertAdjacentHTML('beforeend', `<worklow-card class="m-1 col-3" title="${c}" >${c}</worklow-card>`)
            })
          } else{
            document.getElementById('workflows').innerHTML=`No worklows available`
          }
           
        })
    }
})





customElements.define('worklow-card', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const title =this.getAttribute('title')
        this.innerHTML=`<div class="card" style="width: 18rem;">
        <div class="card-header">
      
        <wf-gear-icon></wf-gear-icon>
      </div>
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



customElements.define('wf-gear-icon', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const title=this.getAttribute('title')
        this.innerHTML=`
        <a class="btn btn-outline-secondary" href="/runner-settings.html" id="btn-${title}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
     
        </svg>
     Settings
        </a>
      `

        document.getElementById(`btn-${title}`).addEventListener('click',(e)=>{
                
            window.pageStore.dispatch({ type: window.actionTypes.WF_CONTAINER_SELECTED, payload: title })

        })

    }
})