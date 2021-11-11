customElements.define('tasks-configuration', class extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {

        const resources = await import('./resources.js')
        await resources.default()
        if (document.getElementById('token')) {
            debugger;

            const token = document.getElementById('token').value

          
            window.pageStore.dispatch({ type: window.actionTypes.GOOGLE_AUTH_SUCCESS, payload: token })
debugger;
            this.render()
        } else {
            debugger;
            this.render()
        }

    }

    render() {
        const { auth: { idToken, localId: uid,googleToken }, workspace: { workspaceSelected:{title:workspaceName} },workspaceTasks: { taskSelected:{taskName,id:taskId} }, } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `
     
        Tasks configuration
        <div id="configurations">
        <signed-in-as></signed-in-as>
        <button class="btn btn-secondary" id="google-auth-btn" ${googleToken  && "disabled"}>Google Authentication</button>
        </div>
        `

        document.getElementById('google-auth-btn').addEventListener('click', (e) => {
         const { auth: { idToken, localId: uid }, workspace: { workspaceSelected:{title:workspaceName} }, workspaceTasks: { taskSelected:{taskName,id:taskId} ,googleScopes}, taskWorkflows: { workflowSelected: { workflowName, workflowKey } } } = window.pageStore.state
            const client_id = "117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com"
            const redirect_url = "http://localhost:3000/tasks-configuration.html"
            const scope = googleScopes
            const state =`${workspaceName}--xxx--${uid}`
            const authRequestUri = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${redirect_url}&client_id=${client_id}`
            debugger;
            window.location.replace(authRequestUri)
            debugger;
        })
     
        this.FB_DATABASE.ref(`workspaces/${workspaceName}/workflowConfigs/tasks/${taskId}/workflows/`).on('value', (error, result) => {
            debugger;
            const workflows = Object.values(result.data)
            const configs = []
        debugger;
               
                workflows.forEach(workflowConfig => {
                    debugger;
                    
                    configs.push(workflowConfig)
                })
            
            const gmailScopes = configs.reduce((prev, curr, i) => {
                if (i === 0) {
                    const { scope } = curr['auth']['google']
                    return scope
                }
                else {
                    const { scope } = curr['auth']['google']
                    return prev.concat(` ` + scope)
                }
            }, {})
            const withoutDublicate = gmailScopes.split(' ').filter(function (item, pos, self) {
                return self.indexOf(item) == pos
            }).join(' ')
            debugger;
            window.pageStore.dispatch({ type: window.actionTypes.GOOGLE_SCOPES, payload: withoutDublicate })
        })
    }
})