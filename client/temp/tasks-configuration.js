customElements.define('tasks-configuration', class extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        this.innerHTML = `Loading...`
        const resources = await import('./resources.js')
        await resources.default()
        if (document.getElementById('token')) {
            


            
            this.render()
        } else {
            
            this.render()
        }

    }

    render() {
        const { auth: { idToken, localId: uid, googleOauth }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state

        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `
     
        Tasks configuration
        <div id="configurations">
        
        <button class="btn btn-secondary" id="google-auth-btn" ${googleOauth && "disabled"}>Google Authentication</button>
        </div>
        `

        document.getElementById('google-auth-btn').addEventListener('click', async (e) => {
            const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { googleScopes } } = window.pageStore.state
            const client_id = "117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com"
            const redirect_url = `${window.location.origin}/google-auth-callback`
            
            const scope = googleScopes
            const state = `${workspaceName}--xxx--${uid}--xxx--${idToken}`
            const authRequestUri = `/google-auth?scope=${scope}&client_id=${client_id}&redirect_url=${redirect_url}&state=${state}`//`https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${redirect_url}&client_id=${client_id}`
            
            window.location.replace(authRequestUri)
            
        })

        //Collect google apis scopes remove dublicate scopes
    const result= await window.firebase().ref(`workspaces/${workspaceName}/workflowConfigs/tasks`).get()
          
                
                const tasks = Object.values(result)
                const configs = []
                
                tasks.forEach(task => {
                    const workflows = Object.values(task.workflows);

                    
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
                
                window.pageStore.dispatch({ type: window.actionTypes.GOOGLE_SCOPES, payload: withoutDublicate })
            
        
    }
})



// async function getWebConfigs() {
//     try {
//       const { auth: { token, screenName }, workflowEditor: { selectedRepo, selectedBranch } } = window.pageStore.state
      
//       if (selectedRepo && selectedBranch) {

//         const element = document.getElementById('workflowConfig')
//         if (element) {
//           element.textContent = 'Loading....'
//         }

//         const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/contents/workflow.config.json?ref=${selectedBranch}`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
//         if (response.status > 400) {
//           const { message } = await response.json()
//           window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
//         } else {
//           const data = await response.json()
//           const { content } = data
//           const workflowConfig = JSON.parse(atob(content))
//           window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_CONFIG_FETCHED, payload: workflowConfig })

//         }



//       }
//     } catch (error) {

//       const { message } = error
//       window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
//     }






//   }