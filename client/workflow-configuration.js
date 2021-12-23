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


        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars`).get((error, result) => {
            let mergedVarConfig = {}

            const varConfig = Object.entries(result).reduce((prev, curr, i) => {
                if (i === 0) {

                    return { [curr[1]['varName']]: { ...curr[1], value: '' } }
                }
                else {

                    return { ...prev, [curr[1]['varName']]: { ...curr[1], value: '' } }
                }

            }, {})

            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/vars`).get((error, wfVars) => {
                if (wfVars) {
                    mergedVarConfig = { ...varConfig, ...wfVars }

                } else {

                    mergedVarConfig = varConfig
                    this.render({ mergedVarConfig })
                }
            })


        })


    }

    render({ mergedVarConfig }) {
        document.getElementById('var-container').innerHTML = ''
        for (let v in mergedVarConfig) {
            const value = mergedVarConfig[v]['value']
            const varName =mergedVarConfig[v]['varName']
            document.getElementById('var-container').insertAdjacentHTML('beforeend', ` <div class="mb-3"><label for="${v}" class="form-label">${v}:</label><input type="text" value="${value}" placeholder="${v}" class="form-control m-1" id="${v}">  </div>`)
            debugger;
            document.getElementById(v).addEventListener('input', (e) => {
                const { id, value } = e.target
                window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_INPUT_CHANGED, payload: { id, value,varName } })
                debugger;

            })
        }
        document.getElementById('var-container').insertAdjacentHTML('beforeend', `  <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3" id="save-wf-vars">Save</button>
      </div>`
      )
      document.getElementById('save-wf-vars').addEventListener('click',(e)=>{
        const { workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { taskSelected: {  id: taskId } }, taskWorkflows: { workflowSelected: {workflowKey },workflowConfiguration:{} } } = window.pageStore.state

        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/vars`)
      })
    }
})