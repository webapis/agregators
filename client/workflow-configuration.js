customElements.define('workflow-configuration', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `loading...`
        const resources = await import('./resources.js')
        await resources.default()
        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
        const { idToken, localId: uid, token } = JSON.parse(localStorage.getItem('auth'))
        const { taskName, id: taskId } = JSON.parse(localStorage.getItem('taskSelected'))
        const { selectedRepo, workflowKey } = JSON.parse(localStorage.getItem('workflowEditor'))

        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
        document.getElementById('workflow-breadcrumb').innerText = `Workflow(${selectedRepo})`
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        this.innerHTML = `
      
        <div>
        <h5>Workflow Enviroment Valiables:</h5>
        </div>
        <div id="var-container" class="row">Loading..</div>`


        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${selectedRepo}/vars`).get((error, repoVars) => {
         
            debugger;
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/vars`).get((error, workflowfVars) => {
                if (workflowfVars) {
                    debugger;
                    const mergedVars = { ...repoVars, ...workflowfVars }
                    for (let m in mergedVars) {
                        if (mergedVars[m].value === undefined) {

                            mergedVars[m].value = ''
                        }
                    }
                    for (let m in workflowfVars) {
                        if (repoVars[m] === undefined) {

                            delete mergedVars[m]
                        }
                    }

                    this.render({ mergedVarConfig: mergedVars })

                } else {
                    for (let rv in repoVars) {
                        repoVars[rv].value = ''
                    }
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
            const inputType = mergedVarConfig[key]['inputType']
            const defaultValue = mergedVarConfig[key]['defaultValue']

            document.getElementById('var-container').insertAdjacentHTML('beforeend', ` <div class="mb-3"><label for="${key}" class="form-label">${varName}:</label><input type="text" value="${value}" placeholder="${varName}" class="form-control m-1" id="${varName}">  </div>`)

            document.getElementById(varName).addEventListener('input', (e) => {
                const { id, value } = e.target

                const workflowConfiguration = localStorage.getItem('workflowConfiguration') && JSON.parse(localStorage.getItem('workflowConfiguration'))
                let updatedVars ={}
                if (workflowConfiguration && workflowConfiguration.vars) {
                     updatedVars = workflowConfiguration.vars
                    if (workflowConfiguration.vars[key]) {
                        updatedVars[key].value = value
                        localStorage.setItem('workflowConfiguration', JSON.stringify({ vars: updatedVars }))
                    } else {
                        updatedVars[key] = {}
                        debugger;
                        updatedVars[key].varName = varName
                        updatedVars[key].value = value
                        updatedVars[key].inputType = inputType
                        updatedVars[key].defaultValue = defaultValue
                        localStorage.setItem('workflowConfiguration', JSON.stringify({ vars: updatedVars }))
                    }
                } else {
                    localStorage.setItem('workflowConfiguration', JSON.stringify({ vars: { [key]: { varName, value, inputType, defaultValue } } }))
                }
            })
        }
        document.getElementById('var-container').insertAdjacentHTML('beforeend', `  <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3" id="save-wf-vars">Save</button>
      </div>`
        )
        document.getElementById('save-wf-vars').addEventListener('click', (e) => {

            const { vars: workflowVars } = localStorage.getItem('workflowConfiguration') && JSON.parse(localStorage.getItem('workflowConfiguration'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
            const { id: taskId } = JSON.parse(localStorage.getItem('taskSelected'))
            const { workflowKey } = JSON.parse(localStorage.getItem('workflowEditor'))
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/vars`).update(workflowVars, (error, result) => {
                window.location.replace('/task-workflows.html')
            })
        })
    }
})