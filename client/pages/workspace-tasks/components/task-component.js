
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
          <div class= "col-4">
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
         <task-run-state></task-run-state>
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
        document.getElementById(`panelsStayOpen-heading-${id}`).addEventListener('click', e => {
            e.preventDefault()
            open = !open


            if (open) {


                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const taskId=id
                window.FB_DATABASE.ref(`workflows/workspaces/${workspaceName}/tasks/${taskId}`).get((error, result) => {
                    if (result) {
debugger;
                        const workflows = result && Object.entries(result)
                        debugger;
                        const wfContainer = document.getElementById(`accordion-body-${id}`).querySelector('.wf-container')
                        wfContainer.innerHTML = '<div class="row"><h7 class="col-9">Workflows:</h7><h7 class="col-3 text-end">Workflow configurations:</h7><div>'

                        workflows && workflows.forEach((wf, i) => {
                            debugger;
                            const workflowKey = wf[0]
                            //   const workflowName = wf[1]['workflowName']
                            const workflowDescription = wf[1]['workflowDescription']
                            const repoName = wf[1]['repoName']
                            const selectedBranch = wf[1]['selectedBranch']


                            wfContainer.insertAdjacentHTML('beforeend', `<div class="d-flex justify-content-between list-group-item" id="${id}-${workflowKey}-wf">
                            <h7>${i}. <span class="fw-bolder">Repo: </span>${repoName}, <span class="fw-bolder">Branch: </span>${selectedBranch},<span class="fw-bolder">Desc: </span>${workflowDescription}</h7>
                                                                                                <div class ="buttons">
                                                                                                <button class="btn btn-outline-secondary btn-sm" id="${workflowKey}-workflow-config-btn">Vars</button>
                                                                                                <button class="btn btn-outline-warning btn-sm" id="${workflowKey}-workflow-editor-btn">Edit</button>
                                                                                                <button class="btn btn-outline-danger btn-sm" id="${workflowKey}-workflow-delete-btn">Delete</button>
                                                                                                <button class="btn"><div class="spinner-grow text-success" role="status">
                                                                                                <span class="visually-hidden">Loading...</span>
                                                                                              </div></button>
                                                                                                </div>
                                                                                                </div>`)

                            document.getElementById(`${workflowKey}-workflow-delete-btn`).addEventListener('click', (e) => {
                                e.preventDefault()
                                if (confirm(`Are you sure you want to delete $${repoName} this workflow ?`)) {
                                    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                                    const taskId = id
                    
                                    const update = { [`workflows/workspaces/${workspaceName}/tasks/${taskId}`]: null }

                                    window.FB_DATABASE.ref(`/`).update(update, (error, data) => {
                                        if (data) {
                                            console.log('workflow deleted')
                                            const parent = document.getElementById(`${id}-${workflowKey}-wf`).parentElement
                                            parent.removeChild(document.getElementById(`${id}-${workflowKey}-wf`))

                                        }
                                    })
                                }

                            })
                            document.getElementById(`${workflowKey}-workflow-config-btn`).addEventListener('click', (e) => {
                                e.preventDefault()
                                localStorage.setItem('workflow', JSON.stringify({ workflowKey, workflowDescription, selectedRepo: repoName, selectedBranch }))

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

                    } else {


                    }
                })
            }
        })
    }
})