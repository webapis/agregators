customElements.define('workflow-configuration', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid }, workspace: { workspaceSelected }, workspaceTasks: { taskSelected }, taskWorkflows: { workflowSelected: { workflowName, workflowKey } } } = window.pageStore.state


        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceSelected})`
        document.getElementById('task-breadcrumb').innerText = `Task(${taskSelected})`
        document.getElementById('workflow-breadcrumb').innerText = `Configuration(${workflowName})`
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.innerHTML = `
        <div>
        <h5>Workflow Enviroment Valiables:</h5>
        </div>
        <div id="var-container" class="row"></div>`

        this.FB_DATABASE.ref(`workspaces/${workspaceSelected}/tasks/${taskSelected}/workflows/${workflowKey}/workflowConfig/vars`).on('value', (error, result) => {
            const vars = Object.entries(result.data)
            vars.forEach(v => {
                const varName = v[0]
                const varValue = v[1]
                document.getElementById('var-container').insertAdjacentHTML('beforeend', ` <div class="mb-3 row">
              <label for="${varName}" class="col-sm-2 col-form-label">${varName}</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" id="${varName}" value="${varValue}"/>
              </div>
            </div>`)
               
            })

            document.getElementById('var-container').insertAdjacentHTML('beforeend', `
          <div class="col-12 d-flex justify-content-end pe-5">
          <button class="btn btn-secondary mb-3" id="save-vars-btn">Save</button>

        </div>`)

            document.getElementById('save-vars-btn').addEventListener('click',(e)=>{
                e.preventDefault()
                let update ={}
                vars.forEach(v=>{
                    let inputId =  v[0]
                
                    update ={...update,[inputId]:document.getElementById(inputId).value}  
                 
                })
                this.FB_DATABASE.ref(`workspaces/${workspaceSelected}/tasks/${taskSelected}/workflows/${workflowKey}/workflowConfig/vars`).update(update,(error,data)=>{
                    debugger;
                })
                debugger;
            })
           
        })
    }
})