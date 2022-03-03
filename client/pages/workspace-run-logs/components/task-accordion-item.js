
customElements.define('task-accordion-item', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.open = false
        const dataId = this.getAttribute('data-id')
        const taskName = this.getAttribute('taskName')
        const runOrder = this.getAttribute('runOrder')
        const runSequence = this.getAttribute('runSequence')
        const start =new Date(parseInt( this.getAttribute('start')))
        const end = new Date(parseInt( this.getAttribute('end')))
        const success = this.getAttribute('success')
        const failed = this.getAttribute('failed')
        const total = this.getAttribute('total')
        const taskId = this.getAttribute('taskId')
        const runid = this.getAttribute('runid')
        const { hours, mins, seconds } = window.timespan(end, start)
        const duration = `${hours}:${mins}:${seconds}`
        const startTime = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
        const endTime = `${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
    
        debugger;
        this.innerHTML = `
        <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${taskId}-${runid}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${taskId}-${runid}" aria-expanded="true" aria-controls="collapse-${taskId}-${runid}" id="${taskId}-${runid}-wf-btn">
        <div class="row">

        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">TaskName:</span>
        <span class="col-12 badge bg-secondary fw-normal">${taskName}</span>
        </div>

        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">Run Order:</span>
        <span class="col-12 badge bg-secondary fw-normal">${runOrder}</span>
        </div>
        
        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">Total:</span>
        <span class="col-12 badge bg-secondary fw-normal">${total}</span>
        </div>
       
        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">Start:</span>
        <span class="col-12 badge bg-secondary fw-normal">${startTime}</span>
        </div>

        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">End:</span>
        <span class="col-12 badge bg-secondary fw-normal">${endTime}</span>
        </div>
        
        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">Duration:</span>
        <span class="col-12 badge bg-secondary fw-normal">${duration}</span>
        </div>

        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">Success:</span>
        <span class="col-12 badge bg-secondary fw-normal">${success}</span>
        </div>
       
        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">Failed:</span>
        <span class="col-12 badge bg-secondary fw-normal">${failed}</span>
        </div>
        <div class="col row p-1">
        <span class="col-12 badge bg-success text-light m-1 fw-light">Run Sequence:</span>
        <span class="col-12 badge bg-secondary fw-normal">${runSequence}</span>
        </div>
   
          </div>
          </button>
        </h2>
        <div id="collapse-${taskId}-${runid}" class="accordion-collapse collapse" aria-labelledby="heading-${taskId}-${runid}" data-bs-parent="#accordionExample">
          <div class="accordion-body" id="body-wf-${taskId}-${runid}">
             <h7>Workflows run result:</h7>

          <div class="row">

          <div class="col row px-1">
          <span class="col-12 badge bg-primary  text-light m-1 fw-normal">Workflow Name: </span>
         
          </div>
         
          <div class="col row px-1">
          <span class="col-12 badge  bg-primary  text-light m-1 fw-normal">RepoName: </span>
        
          </div>
  
         
          <div class="col row px-1">
          <span class="col-12 badge  bg-primary  text-light m-1 fw-normal">Selected Branch: </span>
         
          </div>
  
         
          <div class="col row px-1">
          <span class="col-12 badge  bg-primary  text-light m-1 fw-normal">Owner: </span>
        
          </div>
  
          <div class="col row px-1">
          <span class="col-12 badge  bg-primary  text-light m-1 fw-normal">Start: </span>
    
          </div>
  
          <div class="col row px-1">
          <span class="col-12 badge  bg-primary  text-light m-1 fw-normal">End: </span>
         
          </div>
         
          <div class="col row px-1">
          <span class="col-12 badge  bg-primary  text-light m-1 fw-normal">Duration: </span>
       
          </div>
  
          <div class="col row px-1">
          <span class="col-12 badge  bg-primary  text-light m-1 fw-normal">Result: </span>
        
          </div>
     
          <div class="col row px-1">
          <span class="col-12 badge  bg-primary  text-light m-1 fw-normal">Desc: </span>
          
          </div>
      
        </div>


          </div>
        </div>
      </div>`

        document.getElementById(`${taskId}-${runid}-wf-btn`).addEventListener('click', (e) => {
            this.open = !this.open
            if (this.open) {
                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const { idToken } = JSON.parse(localStorage.getItem('auth'))
                window.FB_DATABASE.ref(`/workflowLogs/${workspaceName}/${runid}/tasks/${taskId}/workflows`).on('value', async (error, { data }) => {

                    let workPromises = []
                    for (let workflowKey in data) {

                        const end = data[workflowKey]['log']['end']
                        const start = data[workflowKey]['log']['start']
                        const result = data[workflowKey]['log']['result']



                        workPromises.push((async () => {
                            const fetchUrl = `${window.projectUrl}/workflows/workspaces/${workspaceName}/tasks/${taskId}/${workflowKey}/.json?auth=${idToken}`

                            const getResponse = await fetch(fetchUrl, { method: 'GET' })

                            const workflow = await getResponse.json()

                            return { ...workflow, taskId, runid, end, start, result }

                        })())

                    }//end for loop
                    const workflows = await Promise.all(workPromises)
                    workflows.forEach(wf => {
                        debugger;
                        const end = wf['end']
                        const repoName = wf["repoName"]
                        const result = wf["result"]
                        const runid = wf['runid']
                        const screenName = wf["screenName"]
                        const selectedBranch = wf["selectedBranch"]
                        const start = wf['start']
                        const workflowDescription = wf['workflowDescription']

                        document.getElementById(`body-wf-${taskId}-${runid}`).insertAdjacentHTML('beforeend',
                            `<workflow-list-items repoName="${repoName}" selectedBranch="${selectedBranch}" owner="${screenName}" start="${start}" end="${end}" result="${result}" workflowDescription="${workflowDescription}">
                 </workflow-list-items>`)
                        debugger;
                    })


                })
            }

        })
    }
})
