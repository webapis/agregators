
customElements.define('workspace-run-logs', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        this.innerHTML = `loading...`
        const resources = await import('/js/resources.js')
        await resources.default()

        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))

        const { idToken, localId: uid } = JSON.parse(localStorage.getItem('auth'))
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('workspace-breadcrumb').innerText = `Workspace(${workspaceName})`

        window.FB_DATABASE.ref(`/workspaceLogs/${workspaceName}/logs`).on('value', (error, { data }) => {
           
            for (let log in data) {
            
                const last = data[log]['last']
                const start = data[log]['start']
                const success = data[log]['success']
                const failed = data[log]['failed']
                const totalTasks = data[log]['totalTasks']
                const totalWorkflows = data[log]['totalWorkflows']
                document.getElementById('accordion-container').insertAdjacentHTML('beforeend', `
                <workspace-accordion-item last="${last}" start="${start}" success="${success}" failed="${failed}" totalTasks="${totalTasks}" totalWorkflows="${totalWorkflows}" data-id="${log}-ws" runid="${log}">
                </workspace-accordion-item>`)
            }
        })
        this.innerHTML = `<div class="accordion" id="accordion-container"></div>`
    }
})

customElements.define('workspace-accordion-item', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
       
        const dataId = this.getAttribute('data-id')
        const last = new Date(parseInt(this.getAttribute('last')))
        const start = new Date(parseInt(this.getAttribute('start')))
        const success = this.getAttribute('success')
        const failed = this.getAttribute('failed')
        const totalTasks = this.getAttribute('totalTasks')
        const totalWorkflows = this.getAttribute('totalWorkflows')
        const runid = this.getAttribute('runid')
        const { hours, mins, seconds } = timespan(new Date(parseInt(this.getAttribute('last'))), new Date(parseInt(this.getAttribute('start'))))
        const duration = `${hours}:${mins}:${seconds}`

        const startTime = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
        const endTime = `${last.getHours()}:${last.getMinutes()}:${last.getSeconds()}`
        const date =`${start.getDate()}:${start.getMonth()+1}:${start.getFullYear()}`
        debugger;
        this.open = false

        this.innerHTML = `
        <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${dataId}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${dataId}" aria-expanded="true" aria-controls="collapse-${dataId}" id="ws-${dataId}-btn">
          <div class="row">
          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Date:</span>
          <span class="col-12 badge bg-secondary fw-normal">${date}</span>
          </div>
         
          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Start:</span>
          <span class="col-12 badge bg-secondary fw-normal">${startTime}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">End:</span>
          <span class="col-12 badge bg-secondary fw-normal">${endTime}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Duration:</span>
          <span class="col-12 badge bg-secondary fw-normal">${duration}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Total Tasks:</span>
          <span class="col-12 badge bg-secondary fw-normal">${totalTasks}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Total Workflows:</span>
          <span class="col-12 badge bg-secondary fw-normal">${totalWorkflows}</span>
          </div>
          
          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Success:</span>
          <span class="col-12 badge bg-secondary fw-normal">${success}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-warning text-dark fw-normal">Failed:</span>
          <span class="col-12 badge bg-secondary fw-normal">${failed !== 'undefined' ? failed : 0}</span>
          </div>

      
          </div>
          </button>
        </h2>
        <div id="collapse-${dataId}" class="accordion-collapse collapse" aria-labelledby="heading-${dataId}" data-bs-parent="#accordionExample">
          <div class="accordion-body" id="body-${runid}">
       
          </div>
        </div>
      </div>`

        document.getElementById(`ws-${dataId}-btn`).addEventListener('click', (e) => {
            this.open = !this.open

            if (this.open) {

                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const { idToken } = JSON.parse(localStorage.getItem('auth'))
                window.FB_DATABASE.ref(`/taskLogs/${workspaceName}/${runid}/tasks`).on('value', async (error, { data }) => {
                    debugger;
                    let taskPromises = []
                    for (let taskId in data) {

                        const end = data[taskId]['log']['end']
                        const start = data[taskId]['log']['start']
                        const failed = data[taskId]['log']['failed']
                        const success = data[taskId]['log']['success']
                        const total = data[taskId]['log']['total']

                        taskPromises.push((async () => {
                            const fetchUrl = `${window.projectUrl}/workspaces/${workspaceName}/tasks/${taskId}/.json?auth=${idToken}`
                            const getResponse = await fetch(fetchUrl, { method: 'GET' })

                            const task = await getResponse.json()

                            return { ...task, taskId, runid, end, start, failed, success, total }

                        })())

                    }//end for loop
                    const tasks = await Promise.all(taskPromises)

                    //  document.getElementById(`body-${runid}`).innerHTML=''
                    tasks.forEach((task, i) => {

                        const end = task['end']
                        const failed = task['failed']
                        const runOrder = task['runOrder']
                        const runSequence = task['runSequence']
                        const start = task['start']
                        const success = task['success']
                        const taskName = task['taskName']
                        const total = task['total']
                        const taskId = task['taskId']
                        const runid = this.getAttribute('runid')

                        document.getElementById(`body-${runid}`).insertAdjacentHTML('beforeend', `
                        <task-accordion-item taskName="${taskName}" runid="${runid}" taskId="${taskId}" runOrder="${runOrder}" runSequence="${runSequence}" total="${total}" success="${success}" failed="${failed}" start="${start}" end="${end}" data-id="${i}">
                        </task-accordion-item>`)
                    })
                })
            } else {
                // document.getElementById(`body-${runid}`).innerHTML=''
            }

        })
    }

})


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
        const { hours, mins, seconds } = timespan(end, start)
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
        <span class="col-12 badge  bg-success text-light m-1 fw-light">Run Order:</span>
        <span class="col-12 badge bg-secondary fw-normal">${runOrder}</span>
        </div>
        
        <div class="col row p-1">
        <span class="col-12 badge  bg-success text-light m-1 fw-light">Total:</span>
        <span class="col-12 badge bg-secondary fw-normal">${total}</span>
        </div>
       
        <div class="col row p-1">
        <span class="col-12 badge  bg-success text-light m-1 fw-light">Start:</span>
        <span class="col-12 badge bg-secondary fw-normal">${startTime}</span>
        </div>

        <div class="col row p-1">
        <span class="col-12 badge  bg-success text-light m-1 fw-light">End:</span>
        <span class="col-12 badge bg-secondary fw-normal">${endTime}</span>
        </div>
        
        <div class="col row p-1">
        <span class="col-12 badge  bg-success text-light m-1 fw-light">Duration:</span>
        <span class="col-12 badge bg-secondary fw-normal">${duration}</span>
        </div>

        <div class="col row p-1">
        <span class="col-12 badge  bg-success text-light m-1 fw-light">Success:</span>
        <span class="col-12 badge bg-secondary fw-normal">${success}</span>
        </div>
       
        <div class="col row p-1">
        <span class="col-12 badge  bg-success text-light m-1 fw-light">Failed:</span>
        <span class="col-12 badge bg-secondary fw-normal">${failed}</span>
        </div>
        <div class="col row p-1">
        <span class="col-12 badge  bg-success text-light m-1 fw-light">Run Sequence:</span>
        <span class="col-12 badge bg-secondary fw-normal">${runSequence}</span>
        </div>
   
          </div>
          </button>
        </h2>
        <div id="collapse-${taskId}-${runid}" class="accordion-collapse collapse" aria-labelledby="heading-${taskId}-${runid}" data-bs-parent="#accordionExample">
          <div class="accordion-body" id="body-wf-${taskId}-${runid}">
             

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


customElements.define('workflow-list-items', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const dataId = this.getAttribute('data-id')
        const taskId = this.getAttribute
        const repoName = this.getAttribute('repoName')
        const selectedBranch = this.getAttribute('selectedBranch')
        const owner = this.getAttribute('owner')
        const start =new Date(parseInt( this.getAttribute('start')))
        const end = new Date(parseInt( this.getAttribute('end')))
        const result = this.getAttribute('result')
        const desc = this.getAttribute('workflowDescription')
        const { hours, mins, seconds } = timespan(end, start)
        const duration = `${hours}:${mins}:${seconds}`
        const startTime = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
        const endTime = `${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
        debugger;
        this.innerHTML = `
        <div class="row">

        <div class="col row px-1 mb-1">
      
        <span class="col-12 badge bg-secondary fw-normal" >${desc}</span>
        </div>
       
        <div class="col row px-1 mb-1">
      
        <span class="col-12 badge bg-secondary fw-normal" >${repoName}</span>
        </div>

       
        <div class="col row px-1 mb-1">
     
        <span class="col-12 badge bg-secondary fw-normal" >${selectedBranch}</span>
        </div>

       
        <div class="col row px-1 mb-1">
       
        <span class="col-12 badge bg-secondary fw-normal" >${owner}</span>
        </div>

        <div class="col row px-1 mb-1">
       
        <span class="col-12 badge bg-secondary fw-normal" >${startTime}</span>
        </div>

        <div class="col row px-1 mb-1">
     
        <span class="col-12 badge bg-secondary fw-normal" >${endTime}</span>
        </div>
       
        <div class="col row px-1 mb-1">
      
        <span class="col-12 badge bg-secondary fw-normal" >${duration}</span>
        </div>

        <div class="col row px-1 mb-1">
      
        <span class="col-12 badge bg-secondary fw-normal" >${result}</span>
        </div>
   
        <div class="col row px-1 mb-1">
       
        <span class="col-12 badge bg-secondary fw-normal" >${desc}</span>
        </div>
    
      </div>`


    }
})



function timespan(date2, date1) {


    var diff = date2.getTime() - date1.getTime();

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);

    console.log(days + " days, " + hours + " hours, " + mins + " minutes, " + seconds + " seconds");
    return { days, hours, mins, seconds }
}