customElements.define('oauth-configuration', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
    const resources = await import('./resources.js')
    await resources.default()
    const { auth: { idToken, localId: uid, googleOauth }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
    this.uid = uid
    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML=`Auth configuration
        <a href="/google-oauth-config.html">Google OAuth Config</a>
        `
    

    }
})