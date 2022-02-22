
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
          <a class="nav-link ${selectedWorkspaceTab === 'private-tab' && 'active'}" aria-current="page" href="/pages/workspaces-list/workspaces-list.html" id="private-tab">Private(${0})</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${selectedWorkspaceTab === 'public-tab' && 'active'}" href="/pages/workspaces-list/workspaces-list.html" id="public-tab">Public(${0})</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${selectedWorkspaceTab === 'shared-tab' && 'active'}" href="/pages/workspaces-list/workspaces-list.html" id="shared-tab">Shared(${0})</a>
        </li>
       
      </ul>`

      document.getElementById('private-tab').addEventListener('click',(e)=>{
        e.preventDefault()
        const { id } = e.target
        localStorage.setItem('selectedWorkspaceTab',id)
       
        window.location.replace('/pages/workspaces-list/workspaces-list.html')
      })

      document.getElementById('public-tab').addEventListener('click',(e)=>{
        e.preventDefault()
        const { id } = e.target
        localStorage.setItem('selectedWorkspaceTab',id)
      
        window.location.replace('/pages/workspaces-list/workspaces-list.html')
      })

      document.getElementById('shared-tab').addEventListener('click',(e)=>{
        e.preventDefault()
        const { id } = e.target
        localStorage.setItem('selectedWorkspaceTab',id)
       
        window.location.replace('/pages/workspaces-list/workspaces-list.html')
      })
    }
})
