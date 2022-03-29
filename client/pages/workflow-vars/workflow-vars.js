customElements.define('workflow-vars', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `loading...`
        const resources = await import('../../js/resources.js')
        await resources.default()
        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        const { idToken, localId: uid, token } = JSON.parse(localStorage.getItem('auth'))
        const { taskName, id: taskId } = JSON.parse(localStorage.getItem('task'))
        const { selectedRepo, workflowKey } = JSON.parse(localStorage.getItem('workflow'))

        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
        document.getElementById('workflow-breadcrumb').innerText = `Workflow(${selectedRepo})`
        this.uid = uid

        this.innerHTML = `
      
        <div>
        <h5>Workflow Inputs:</h5>
        </div>
        <div id="var-container" class="row">Loading..</div>`


        const repoInputs = await window.firebase().ref(`inputs/workspaces/${workspaceName}/repos/${selectedRepo}`).get()

        
        const workflowVars = await window.firebase().ref(`vars/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/vars`).get()
        if (workflowVars) {
            
            const mergedInputs = { ...repoInputs, ...workflowVars }
            for (let m in mergedInputs) {
                if (mergedInputs[m].value === undefined) {

                    mergedInputs[m].value = ''
                }
            }
            for (let m in workflowVars) {
                if (repoInputs[m] === undefined) {

                    delete mergedInputs[m]
                }
            }

            this.render({ mergedInputConfig: mergedInputs })

        } else {
            for (let rv in repoInputs) {
                repoInputs[rv].value = ''
            }
            
            this.render({ mergedInputConfig: repoInputs })
        }


    }

    render({ mergedInputConfig }) {
        
        document.getElementById('var-container').innerHTML = ''
        for (let key in mergedInputConfig) {
            const value = mergedInputConfig[key]['value']
            const inputName = mergedInputConfig[key]['inputName']
            

            document.getElementById('var-container').insertAdjacentHTML('beforeend', ` <div class="mb-3"><label for="${key}" class="form-label">${inputName}:</label><input type="text" value="${value}" placeholder="${inputName}" class="form-control m-1" id="${inputName}">  </div>`)

            document.getElementById(inputName).addEventListener('input', (e) => {
                const { id, value } = e.target

                const workflowConfiguration = localStorage.getItem('workflowConfiguration') && JSON.parse(localStorage.getItem('workflowConfiguration'))
                let updatedVars = {}
                if (workflowConfiguration && workflowConfiguration.vars) {
                    updatedVars = workflowConfiguration.vars
                    if (workflowConfiguration.vars[key]) {
                        updatedVars[key].value = value
                        localStorage.setItem('workflowConfiguration', JSON.stringify({ vars: updatedVars }))
                    } else {
                        updatedVars[key] = {}
                        
                        updatedVars[key].inputName = inputName
                        updatedVars[key].value = value

                        localStorage.setItem('workflowConfiguration', JSON.stringify({ vars: updatedVars }))
                    }
                } else {
                    localStorage.setItem('workflowConfiguration', JSON.stringify({ vars: { [key]: { inputName, value, } } }))
                }
            })
        }
        document.getElementById('var-container').insertAdjacentHTML('beforeend', `  <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3" id="save-wf-vars">Save</button>
      </div>`
        )
        document.getElementById('save-wf-vars').addEventListener('click', async (e) => {

            const { vars: workflowVars } = localStorage.getItem('workflowConfiguration') && JSON.parse(localStorage.getItem('workflowConfiguration'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            const { id: taskId } = JSON.parse(localStorage.getItem('task'))
            const { workflowKey } = JSON.parse(localStorage.getItem('workflow'))
            await window.firebase().ref(`vars/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/vars`).update(workflowVars)
            window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
        })
    }
})