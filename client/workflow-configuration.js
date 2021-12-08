customElements.define('workflow-configuration', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML=`loading...`
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid }, workspace: { workspaceSelected:{title:workspaceName} }, workspaceTasks: { taskSelected:{taskName,id:taskId} }, taskWorkflows: { workflowSelected: { workflowName, workflowKey } } } = window.pageStore.state


        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
        document.getElementById('workflow-breadcrumb').innerText = `Configuration(${workflowName})`
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        this.innerHTML = `
        <signed-in-as></signed-in-as>
        <div>
        <h5>Workflow Enviroment Valiables:</h5>
        </div>
        <div id="var-container" class="row">Loading..</div>`

        this.FB_DATABASE.ref(`workspaces/${workspaceName}/workflowConfigs/tasks/${taskId}/workflows/${workflowKey}/vars`).get((error, result) => {
            if(result){
                const vars = Object.entries(result)
                document.getElementById('var-container').innerHTML=''
                debugger;
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
                    const updateServerWorkflowConfig ={[`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowKey}/workflowConfig/vars`]:update}
                    const updateClientWorkflowConfig ={[`workspaces/${workspaceName}/workflowConfigs/tasks/${taskId}/workflows/${workflowKey}/vars`]:update}
                    this.FB_DATABASE.ref('/').update({...updateServerWorkflowConfig,...updateClientWorkflowConfig},(error,data)=>{
                        window.location.replace('/task-workflows.html')
                        debugger;
                    })
                    debugger;
                })
            } else{
                document.getElementById('var-container').innerHTML='0 variables found'

            }
         
           
        })
    }
})