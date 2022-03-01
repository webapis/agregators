customElements.define('workspace-run-logs', class extends HTMLElement{
    constructor(){
        super()
    }

    async connectedCallback(){

        this.innerHTML=`loading...`
        const resources = await import('/js/resources.js')
        await resources.default()

        const {  title: workspaceName   } = JSON.parse(localStorage.getItem('workspace'))
 
        const { idToken, localId: uid } =JSON.parse(localStorage.getItem('auth'))
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('workspace-breadcrumb').innerText = `Workspace(${workspaceName})`
      
        this.innerHTML=`Workspace run logs`
    }
})