customElements.define('oauth-configuration', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
    const resources = await import('/js/resources.js')
    await resources.default()
   // const { auth: { idToken, localId: uid, googleOauth }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))



    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML=`Auth configuration
        <a href="/pages/google/google-oauth-config.html" id="google-oauth-config-link">Google OAuth Config</a>
        `
    

    }
})