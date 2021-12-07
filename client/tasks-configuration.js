customElements.define('tasks-configuration', class extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        this.innerHTML = `Loading...`
        const resources = await import('./resources.js')
        await resources.default()
        if (document.getElementById('token')) {
            debugger;


            debugger;
            this.render()
        } else {
            debugger;
            this.render()
        }

    }

    render() {
        const { auth: { idToken, localId: uid, googleOauth }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `
     
        Tasks configuration
        <div id="configurations">
        <signed-in-as></signed-in-as>
        <button class="btn btn-secondary" id="google-auth-btn" ${googleOauth && "disabled"}>Google Authentication</button>
        </div>
        `

        document.getElementById('google-auth-btn').addEventListener('click', (e) => {
            const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { googleScopes } } = window.pageStore.state
            const client_id = "117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com"
            const redirect_url = `${window.location.origin}/google-auth-callback`
            debugger;
            const scope = googleScopes
            const state = `${workspaceName}--xxx--${uid}--xxx--${idToken}`
            const authRequestUri = `/google-auth?scope=${scope}&client_id=${client_id}&redirect_url=${redirect_url}&state=${state}`//`https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${redirect_url}&client_id=${client_id}`
            debugger;
            window.location.replace(authRequestUri)
            debugger;
        })

        //Collect google apis scopes remove dublicate scopes
        this.FB_DATABASE.ref(`workspaces/${workspaceName}/workflowConfigs/tasks`).get((error, result) => {
            if (result) {
                debugger;
                const tasks = Object.values(result)
                const configs = []
                debugger;
                tasks.forEach(task => {
                    const workflows = Object.values(task.workflows);

                    debugger;
                    workflows.forEach(workflowConfig => {

                        configs.push(workflowConfig)
                    })

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
            }
        })
    }
})