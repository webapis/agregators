
customElements.define('task-component', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const id = this.getAttribute('id')
        const name = this.getAttribute('name')
        const order = this.getAttribute('order')
        const sequence = this.getAttribute('sequence')
        let open = false
        this.innerHTML = `
        <div class="accordion-item">
        <h2 class="accordion-header d-flex" id="panelsStayOpen-heading-${id}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-${id}" aria-expanded="true" aria-controls="panelsStayOpen-${id}">
           ${name}
          </button>
        </h2>
        
           <div id="panelsStayOpen-${id}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading-${id}">
          <div class="accordion-body" id="accordion-body-${id}">

 
        <div class="row">
          <div class="wf-container col-8 list-group"></div>
          <div class= "col-4" id="task-conf-container-${id}">
          <h7>Task Configurations:</h7>
          <div class="border border-1 p-2">
          <task-config taskId="${id}" title="${name}" order="${order}" sequence="${sequence}"></task-config>
          <div>
          <button class="btn btn-outline-secondary btn-sm" id="${id}-vars-btn">Vars</button>
          <button class="btn btn-outline-secondary btn-sm" id="add-workflow-btn-${id}">Add</button>
          <button class="btn btn-outline-success btn-sm" id="run-task-btn-${id}">Run</button>
          <button class="btn btn-outline-danger btn-sm">Abort</button>
          <button class="btn btn-outline-secondary btn-sm" id="${id}-logs-btn">Logs</button>
          
          </div>
     
          </div>
        
          </div>
          </div>
</div>
        </div>
        <div>
    `
        document.getElementById(`run-task-btn-${id}`).addEventListener('click', (e) => {
            e.preventDefault()

            localStorage.setItem('task', JSON.stringify({ id, taskName: name }))
            //window.location.replace('/pages/task-logs/task-logs.html')

        })


        document.getElementById(`${id}-logs-btn`).addEventListener('click', (e) => {
            e.preventDefault()


            localStorage.setItem('task', JSON.stringify({ id, taskName: name }))
            window.location.replace('/pages/task-logs/task-logs.html')

        })

        document.getElementById(`${id}-vars-btn`).addEventListener('click', (e) => {
            e.preventDefault()



            localStorage.setItem('task', JSON.stringify({ id, taskName: name }))
            window.location.replace('/pages/env-vars/task-scope-vars.html')

        })

        document.getElementById(`add-workflow-btn-${id}`).addEventListener('click', (e) => {
            e.preventDefault()


            localStorage.setItem('workflow', JSON.stringify({ selectedBranch: '', selectedRepo: '', workflowDescription: '', workflowKey: '' }))
            localStorage.setItem('task', JSON.stringify({ id, taskName: name, runOrder: order, runSequence: sequence }))
            window.location.replace('/pages/workflow-editor/workflow-editor.html')
        })
        document.getElementById(`panelsStayOpen-heading-${id}`).addEventListener('click', async (e) => {
            e.preventDefault()
            open = !open


            if (open) {

                const taskId = id
                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const fetchUrl = `workflows/workspaces/${workspaceName}/tasks/${taskId}`
                const getJsonData = await window.firebase().ref(fetchUrl).get()
               
                
                const workflows = getJsonData && Object.entries(getJsonData)

                
                const wfContainer = document.getElementById(`accordion-body-${id}`).querySelector('.wf-container')
                wfContainer.innerHTML = `<div class="row"><h7 class="col-12 text-end">Workflows:</h7>
                       <div class="row mb-1 pb-1">
                       <div class="col-2 fw-bold">Repo</div>
                       <div class="col-2 fw-bold">Branch</div>
                       <div class="col-2 fw-bold">Workflow</div>
                       <div class="col-1 fw-bold text-center">Controls</div>
                       <div class="col-5 fw-bold row">
                       <div class="text-center"> Workflows's Last Run State</div>
                       </div>
                       </div> 
                        <div>`

                workflows && workflows.forEach((wf, i) => {

                    const workflowKey = wf[0]
                    //   const workflowName = wf[1]['workflowName']
                    const workflowDescription = wf[1]['workflowDescription']
                    const repoName = wf[1]['repoName']
                    const selectedBranch = wf[1]['selectedBranch']


                    wfContainer.insertAdjacentHTML('beforeend', `<div class="row mb-1 border-bottom pb-1" id="${id}-${workflowKey}-wf">
                             <div class="col-2">${repoName}</div> 
                             <div class="col-2">${selectedBranch}</div> 
                             <div class="col-2" style="word-wrap:break-word;overflow:hidden;">${workflowDescription}</div> 
                             <div class ="buttons col-1 d-flex flex-column">
                             <button class="btn btn-outline-secondary btn-sm mb-1" id="${workflowKey}-workflow-config-btn">Vars</button>
                             <button class="btn btn-outline-warning btn-sm mb-1" id="${workflowKey}-workflow-editor-btn"><edit-icon></edit-icon></button>
                             <button class="btn btn-outline-danger btn-sm mb-1" id="${workflowKey}-workflow-delete-btn"><delete-icon></delete-icon></button>
                             </div>
                              <workflow-run-state class=col-5 workflowKey=${workflowKey} taskId="${taskId}"></workflow-run-state>                                                           
                                                                                             
                                                                                                </div>`)

                    document.getElementById(`${workflowKey}-workflow-delete-btn`).addEventListener('click', async (e) => {
                        e.preventDefault()
                        if (confirm(`Are you sure you want to delete $${repoName} this workflow ?`)) {
                            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                            const taskId = id

                            const update = { [`workflows/workspaces/${workspaceName}/tasks/${taskId}/${workflowKey}`]: null }

                            await window.firebase().ref(`/`).update(update)

                            console.log('workflow deleted')
                            const parent = document.getElementById(`${id}-${workflowKey}-wf`).parentElement
                            parent.removeChild(document.getElementById(`${id}-${workflowKey}-wf`))



                        }

                    })
                    document.getElementById(`${workflowKey}-workflow-config-btn`).addEventListener('click', (e) => {
                        e.preventDefault()

                        localStorage.setItem('workflow', JSON.stringify({ workflowKey, workflowDescription, selectedRepo: repoName, selectedBranch }))
                        localStorage.setItem('task', JSON.stringify({ taskName: name, runOrder: order, runSequence: sequence, id }))
                        window.location.replace('/pages/workflow-vars/workflow-vars.html')
                    })
                    document.getElementById(`${workflowKey}-workflow-editor-btn`).addEventListener('click', (e) => {
                        e.preventDefault()
                        try {
                            localStorage.setItem('workflow', JSON.stringify({ workflowKey, workflowDescription, selectedRepo: repoName, selectedBranch }))
                            localStorage.setItem('task', JSON.stringify({ taskName: name, runOrder: order, runSequence: sequence, id }))
                            localStorage.setItem('inputEditor', JSON.stringify({ selectedBranch: "", inputName: '', inputs: [] }))
                            window.location.replace('/pages/workflow-editor/workflow-editor.html')
                        } catch (error) {

                        }

                    })
                })

    



            }
        })
    }
})