customElements.define('workflow-configuration', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `loading...`
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { taskSelected: { taskName, id: taskId } }, taskWorkflows: { workflowSelected: { workflowName, workflowKey, repoName } } } = window.pageStore.state


        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
        document.getElementById('workflow-breadcrumb').innerText = `Configuration(${workflowName})`
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        this.innerHTML = `
      
        <div>
        <h5>Workflow Enviroment Valiables:</h5>
        </div>
        <div id="var-container" class="row">Loading..</div>`


        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars`).get((error, repoVars) => {
            let mergedVarConfig = {}
            
            // const  = Object.entries(result).reduce((prev, curr, i) => {
            //     if (i === 0) {

            //         return { [curr[1]['varName']]: { ...curr[1], value: '' } }
            //     }
            //     else {

            //         return { ...prev, [curr[1]['varName']]: { ...curr[1], value: '' } }
            //     }

            // }, {})

            window.pageStore.dispatch({ type: window.actionTypes.REPO_VARS_FETCHED, payload: repoVars })



        })

        window.pageStore.subscribe(window.actionTypes.REPO_VARS_FETCHED, state => {
            const { workflowConfiguration: { repoVars } } = state
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/vars`).get((error, workflowfVars) => {
                if (workflowfVars) {
                    const mergedVars = { ...repoVars, ...workflowfVars }
                    for (let m in mergedVars) {
                        if (mergedVars[m].value === undefined) {

                            mergedVars[m].value = ''
                        }
                    }
                    for (let m in workflowfVars) {
                        if (repoVars[m] === undefined) {
                        
                           delete  mergedVars[m]
                        }
                    }
                    
                    window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_VARS_FETCHED, payload: mergedVars })
                    this.render({ mergedVarConfig: mergedVars })
                    
                } else {
                    
                    for (let rv in repoVars) {
                        repoVars[rv].value = ''
                        
                    }
                    window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_VARS_FETCHED, payload: repoVars })
                    this.render({ mergedVarConfig: repoVars })
                }
            })

        })


    }

    render({ mergedVarConfig }) {
        
        document.getElementById('var-container').innerHTML = ''
        for (let key in mergedVarConfig) {
            const value = mergedVarConfig[key]['value']
            const varName = mergedVarConfig[key]['varName']
            document.getElementById('var-container').insertAdjacentHTML('beforeend', ` <div class="mb-3"><label for="${key}" class="form-label">${varName}:</label><input type="text" value="${value}" placeholder="${varName}" class="form-control m-1" id="${varName}">  </div>`)
            
            document.getElementById(varName).addEventListener('input', (e) => {
                const { id, value } = e.target
                window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_INPUT_CHANGED, payload: { id, value, key } })


            })
        }
        document.getElementById('var-container').insertAdjacentHTML('beforeend', `  <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3" id="save-wf-vars">Save</button>
      </div>`
        )
        document.getElementById('save-wf-vars').addEventListener('click', (e) => {
            const { workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { taskSelected: { id: taskId } }, taskWorkflows: { workflowSelected: { workflowKey } }, workflowConfiguration: { workflowVars } } = window.pageStore.state
            
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/vars`).update(workflowVars, (error, result) => {
                window.location.replace('/task-workflows.html')
            })
        })
    }
})