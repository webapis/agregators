customElements.define('workspaces-list', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        window.onerror = (errorMessage) => {
            debugger;
            window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: errorMessage })
            debugger;
        }
        this.innerHTML=`loading...`
        const resources = await import('./resources.js')
        await resources.default()
        debugger;
        const { auth: { idToken, localId: uid }, workspaceList: {  selectedWorkspaceTab } } = window.pageStore.state
        this.uid = uid
        debugger;
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        debugger;
        this.innerHTML = `  <signed-in-as></signed-in-as>
        <div class="container" id="container"></div>
        `

        let workspacesRef = ''
        if (selectedWorkspaceTab === 'private-tab') {
            workspacesRef = `private/${uid}/workspaces`
        }
        else if (selectedWorkspaceTab === 'public-tab') {
            workspacesRef = `public/workspaces`
        } else {
            workspacesRef = `shared/${uid}/workspaces`  
        }

    
debugger;

        this.FB_DATABASE.ref(workspacesRef).get( (error, ws) => {
debugger;
            if (ws) {
                const workspaces = Object.entries(ws)
                this.render({ workspaces })
            } else {
                debugger;
                this.render({ workspaces: [] })
            }
        })

    }

    render({ workspaces }) {
 debugger;
        document.getElementById('container').innerHTML = ``
        document.getElementById('container').insertAdjacentHTML('beforeend', `
        <h5>Workspaces:</h5>
        <a class="btn btn-outline-secondary mb-1" href="/workspace-editor.html" id="create-workspace-btn">Create Workspace</a>
        <workspaces-tab class="m-1"></workspaces-tab>
        <div class="row" id="ws-container">
    
        </div>
       
       `)

       document.getElementById('ws-container').innerHTML=``

        workspaces && workspaces.forEach(ws => {
            const title = ws[0]
            const { accessLevel, description, owner } = ws[1]

            document.getElementById('ws-container').insertAdjacentHTML(`beforeend`, `<workspace-component title="${title}" accesslevel="${accessLevel}" description="${description}" owner="${owner}" id="${title}-ws"></workspace-component>`)
        })

        document.getElementById('create-workspace-btn').addEventListener('click', (e) => {
            e.preventDefault()
            window.pageStore.dispatch({ type: window.actionTypes.CREATE_NEW_WORKSPACE })
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

            window.pageStore.dispatch({ type: window.actionTypes.WORKSPACE_SELECTED, payload: { title, accessLevel, description, owner } })
            window.location.replace('/workspace.html')
        })


    }
})


customElements.define('workspaces-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { auth: { idToken, localId: uid } } = window.pageStore.state
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)

        const { workspaceList: { selectedWorkspaceTab,totalPrivate ,totalPublic,totalShared } } = window.pageStore.state
        this.render({ selectedWorkspaceTab,totalPrivate ,totalPublic,totalShared })

    
          window.pageStore.subscribe(window.actionTypes.WORKSPACES_COUNTED, state => {
            const { workspaceList: { selectedWorkspaceTab,totalPrivate ,totalPublic,totalShared} } = state
            
            this.render({ selectedWorkspaceTab,totalPrivate ,totalPublic,totalShared })
        })
  
        this.FB_DATABASE.ref(`private/${uid}/workspaces`).get((error, ws) => {
            debugger;
            let totalPrivate=0
            let totalPublic=0
            let totalShared=0
            if (ws && ws.data) {

                const workspaces =ws &&  Object.entries(ws)
                totalPrivate=workspaces.length
               

            }

            this.FB_DATABASE.ref(`public/workspaces`).get( (error, ws) => {

                if (ws) {
                    const workspaces =ws &&  Object.entries(ws)
                  
                    totalPublic=workspaces.length

                }
                this.FB_DATABASE.ref(`shared/user/${uid}/workspaces`).get( (error, ws) => {

                    if (ws) {
                        const workspaces = ws && Object.entries(ws)
                        totalShared=workspaces.length
                     

                    }

                    window.pageStore.dispatch({type:window.actionTypes.WORKSPACES_COUNTED,payload:{totalShared,totalPublic,totalPrivate}})


                })
            })

        })




    }

    render({ selectedWorkspaceTab,totalPrivate=0 ,totalPublic=0,totalShared=0  }) {


        this.innerHTML = `<ul class="nav nav-tabs justify-content-end">
        <li class="nav-item">
          <a class="nav-link ${selectedWorkspaceTab === 'private-tab' && 'active'}" aria-current="page" href="/workspaces-list.html" id="private-tab">Private(${totalPrivate })</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${selectedWorkspaceTab === 'public-tab' && 'active'}" href="/workspaces-list.html" id="public-tab">Public(${totalPublic})</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${selectedWorkspaceTab === 'shared-tab' && 'active'}" href="/workspaces-list.html" id="shared-tab">Shared(${totalShared})</a>
        </li>
       
      </ul>`

        Array.from(document.getElementsByClassName('nav-link')).forEach(element => {
          
            element.addEventListener('click', (e) => {
                e.preventDefault()
                const { id } = e.target

                window.pageStore.dispatch({ type: window.actionTypes.WORKSPACE_TAB_CHANGED, payload: id })
                window.location.replace('/workspaces-list.html')

            })
        })
    }
})