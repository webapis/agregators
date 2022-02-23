customElements.define('workspaces-list', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        this.innerHTML = `loading...`
        const resources = await import('../../js/resources.js')
        await resources.default()

        await Promise.all([

            import('./components/workspace-component.js'),
            import('./components/workspaces-tab.js'),
            import('./components/workspaces-tab-content.js')
        ])
        
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
            localStorage.setItem('workspace', JSON.stringify({ title:'', accessLevel:'', description:'', owner:'' }))
            window.location.replace('/pages/workspace-editor/workspace-editor.html')
        })

    }
})


