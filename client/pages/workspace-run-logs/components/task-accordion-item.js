
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
        const wsrunid = this.getAttribute('wsrunid')
        const { hours, mins, seconds } = window.timespan(end, start)
        const duration = `${hours}:${mins}:${seconds}`
        const startTime = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
        const endTime = `${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
    
        
        this.innerHTML = `
        <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${taskId}-${wsrunid}">
          <button class="accordion-button py-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${taskId}-${wsrunid}" aria-expanded="true" aria-controls="collapse-${taskId}-${wsrunid}" id="${taskId}-${wsrunid}-wf-btn">
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
        <div id="collapse-${taskId}-${wsrunid}" class="accordion-collapse collapse" aria-labelledby="heading-${taskId}-${wsrunid}" data-bs-parent="#accordionExample">
          <div class="accordion-body" id="body-wf-${taskId}-${wsrunid}">
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

        document.getElementById(`${taskId}-${wsrunid}-wf-btn`).addEventListener('click', async(e) => {
            this.open = !this.open
            if (this.open) {
                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const { idToken } = JSON.parse(localStorage.getItem('auth'))
                const workflowLogRef=`/workflowLogs/${workspaceName}/${wsrunid}/tasks/${taskId}/workflows`
                const workflowLogObjects =await window.getLogObjects(workflowLogRef)
          

                    let workPromises = []
                    for (let workflowKey in workflowLogObjects) {

                        const end = workflowLogObjects[workflowKey]['log']['end']
                        const start = workflowLogObjects[workflowKey]['log']['start']
                        const result = workflowLogObjects[workflowKey]['log']['result']


                        workPromises.push((async () => {
                            const fetchUrl = `${window.projectUrl}/workflows/workspaces/${workspaceName}/tasks/${taskId}/${workflowKey}/.json?auth=${idToken}`

                            const getResponse = await fetch(fetchUrl, { method: 'GET' })

                            const workflow = await getResponse.json()

                            return { ...workflow, taskId, wsrunid, end, start, result,workflowKey }

                        })())

                    }//end for loop
                    const workflows = await Promise.all(workPromises)
                    
                    
                    workflows.forEach(wf => {
                        const taskId =this.getAttribute('taskId')
                        const end = wf['end']
                        const repoName = wf["repoName"]
                        const result = wf["result"]
                        const wsrunid = wf['wsrunid']
                        const screenName = wf["screenName"]
                        const selectedBranch = wf["selectedBranch"]
                        const start = wf['start']
                        const workflowDescription = wf['workflowDescription']
                        const workflowKey=wf['workflowKey']
                        if(document.getElementById(`${workflowKey}-${taskId}-${wsrunid}`)){
                          
                          const parent =document.getElementById(`${workflowKey}-${taskId}-${wsrunid}`).parentElement
                          parent.removeChild(document.getElementById(`${workflowKey}-${taskId}-${wsrunid}`))
                      }
                        document.getElementById(`body-wf-${taskId}-${wsrunid}`).insertAdjacentHTML('beforeend',
                            `<workflow-list-items workflowKey="${workflowKey}" taskId="${taskId}" wsrunid="${wsrunid}" repoName="${repoName}" selectedBranch="${selectedBranch}" owner="${screenName}" start="${start}" end="${end}" result="${result}" workflowDescription="${workflowDescription}" id="${workflowKey}-${taskId}-${wsrunid}">
                 </workflow-list-items>`)
                        
                    })


                
            }

        })
    }
})
