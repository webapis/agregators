customElements.define('oauth-configuration', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
    const resources = await import('./resources.js')
    await resources.default()
   // const { auth: { idToken, localId: uid, googleOauth }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
    const { idToken, localId: uid, token } = JSON.parse(localStorage.getItem('auth'))
    this.uid = uid
    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML=`Auth configuration
        <a href="/google-oauth-config.html" id="google-oauth-config-link">Google OAuth Config</a>
        `
    

    }
})