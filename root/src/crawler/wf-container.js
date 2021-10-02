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
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.innerHTML=`<div>
        <div class="d-flex">
        <h5>Container:</h5>
        <h5 class="text-muted text-uppercase mx-2">${selectedContainer}</h5>
        </div>
        <a class="btn btn-outline-secondary" href="/workflow-editor.html">Add workflow</a>
        <h5>Workflows:</h5>
        <workflows-list></workflows-list>
        </div>`
    }
})