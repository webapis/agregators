customElements.define('workspaces-list', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        this.innerHTML = `loading...`
        const resources = await import('./resources.js')
     
        await resources.default()
        
        const  { idToken, localId: uid } = JSON.parse(localStorage.getItem('auth'))
        this.uid = uid
        
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        
    

        this.innerHTML = `
        <div class="container" id="container"></div>
        `
        


        
        this.render()
    

    }

    render() {
       
        const selectedWorkspaceTab =localStorage.getItem('selectedWorkspaceTab')
       // document.getElementById('container').innerHTML = ``
        document.getElementById('container').insertAdjacentHTML('beforeend', `
        <h5>Workspaces:</h5>
        <a class="btn btn-outline-secondary mb-1" href="/workspace-editor.html" id="create-workspace-btn">Create Workspace</a>
        <workspaces-tab class="m-1"></workspaces-tab>
        <div class="row" id="ws-container">
    
        </div>
       ${selectedWorkspaceTab ==='private-tab' ? '<workspaces-tab-content ws-type="private-tab"></workspaces-tab-content>':''}
       ${selectedWorkspaceTab ==='public-tab' ? '<workspaces-tab-content ws-type="public-tab"></workspaces-tab-content>':''}
       ${selectedWorkspaceTab ==='shared-tab' ? '<workspaces-tab-content ws-type="shared-tab"></workspaces-tab-content>':''}
       `)

        document.getElementById('ws-container').innerHTML = ``

   

        document.getElementById('create-workspace-btn').addEventListener('click', (e) => {
            e.preventDefault()
          
            window.location.replace('/workspace-editor.html')
        })

    }
})

customElements.define('workspace-component', class extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.classList.add('col-3')
        const title = this.getAttribute('title')
        const accessLevel = this.getAttribute('accesslevel')
        const description = this.getAttribute('description')
        const owner = this.getAttribute('owner')

        this.innerHTML = `<div class="card"  style="width: 18rem;">
   
        <div class="card-header d-flex justify-content-between">
       <span>workspace</span> <button class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
       <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
       <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
     </svg></button>
      </div>
      <div class="card-body">
      <h5 class="card-title">Wokspace detail</h5>
      
  
   
    </div>
    <ul class="list-group list-group-flush">
    <li class="list-group-item d-flex justify-content-between"><span class="fw-normal">name:</span><span class="fw-light" id="${title}-ws-title">${title}</span></li>
    <li class="list-group-item d-flex justify-content-between"><span class="fw-normal">description:</span><span class="fw-light" id="${title}-ws-description">${description}</span></li>
    <li class="list-group-item d-flex justify-content-between"><span class="fw-normal">access_level:</span><span class="fw-light" id="${title}-ws-access-level">${accessLevel}</span></li>
    <li class="list-group-item d-flex justify-content-between"><span class="fw-normal">owner:</span><span class="fw-light" id ="${title}-ws-owner">${owner}</span></li>

  </ul>
  <div class="card-body">

  <a href="#" class="card-link" id="${title}-link">Go to tasks</a>
</div>
      <div class="card-footer">
    
    </div>
        </div>`

        document.getElementById(`${title}-link`).addEventListener('click', (e) => {
            const { id } = e.target
            
           // window.pageStore.dispatch({ type: window.actionTypes.WORKSPACE_SELECTED, payload: { title, accessLevel, description, owner } })
            localStorage.setItem('workspaceSelected',JSON.stringify({title, accessLevel, description, owner }))
            window.location.replace('/workspace.html')
        })


    }
})


customElements.define('workspaces-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        //const { auth: { idToken, localId: uid },workspaceList: { selectedWorkspaceTab, totalPrivate, totalPublic, totalShared }  } = window.pageStore.state
        const selectedWorkspaceTab =localStorage.getItem('selectedWorkspaceTab')

    
        this.render({ selectedWorkspaceTab })




    }

    render({ selectedWorkspaceTab }) {


        this.innerHTML = `<ul class="nav nav-tabs justify-content-end">
        <li class="nav-item">
          <a class="nav-link ${selectedWorkspaceTab === 'private-tab' && 'active'}" aria-current="page" href="/workspaces-list.html" id="private-tab">Private(${0})</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${selectedWorkspaceTab === 'public-tab' && 'active'}" href="/workspaces-list.html" id="public-tab">Public(${0})</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${selectedWorkspaceTab === 'shared-tab' && 'active'}" href="/workspaces-list.html" id="shared-tab">Shared(${0})</a>
        </li>
       
      </ul>`

      document.getElementById('private-tab').addEventListener('click',(e)=>{
        e.preventDefault()
        const { id } = e.target
        localStorage.setItem('selectedWorkspaceTab',id)
       
        window.location.replace('/workspaces-list.html')
      })

      document.getElementById('public-tab').addEventListener('click',(e)=>{
        e.preventDefault()
        const { id } = e.target
        localStorage.setItem('selectedWorkspaceTab',id)
      
        window.location.replace('/workspaces-list.html')
      })

      document.getElementById('shared-tab').addEventListener('click',(e)=>{
        e.preventDefault()
        const { id } = e.target
        localStorage.setItem('selectedWorkspaceTab',id)
       
        window.location.replace('/workspaces-list.html')
      })
    }
})


customElements.define('workspaces-tab-content', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const {localId: uid  } = JSON.parse(localStorage.getItem('auth'))
        const wsType =this.getAttribute('ws-type')
        let workspacesRef = ''
        if (wsType === 'private-tab') {
            workspacesRef = `private/${uid}/workspaces`
        }
        else if (wsType === 'public-tab') {
            workspacesRef = `public/workspaces`
        } else {
            workspacesRef = `shared/${uid}/workspaces`
        }

        window.FB_DATABASE.ref(workspacesRef).get((error, ws) => {
            
            if (ws) {
                const workspaces = Object.entries(ws)
                this.render({ workspaces })
            } 
        })

        this.innerHTML=`<div id="workspaces">${wsType}</div>`
    }

    render({workspaces}){
        workspaces.forEach(ws => {
            const title = ws[0]
            const { accessLevel, description, owner } = ws[1]

            document.getElementById('workspaces').insertAdjacentHTML(`beforeend`, `<workspace-component title="${title}" accesslevel="${accessLevel}" description="${description}" owner="${owner}" id="${title}-ws"></workspace-component>`)
        })

    }
})