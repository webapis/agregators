
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
        const last = new Date(parseInt(this.getAttribute('last'))).toDateString()
        const start = new Date(parseInt(this.getAttribute('start'))).toDateString()
        const success = this.getAttribute('success')
        const failed = this.getAttribute('failed')
        const totalTasks = this.getAttribute('totalTasks')
        const totalWorkflows = this.getAttribute('totalWorkflows')
        const runid = this.getAttribute('runid')
        this.open = false

        this.innerHTML = `
        <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${dataId}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${dataId}" aria-expanded="true" aria-controls="collapse-${dataId}" id="ws-${dataId}-btn">
          <span class="badge bg-info text-dark fw-normal">start: <span class="badge bg-secondary fw-normal">${start}</span></span>
          <span class="badge bg-info text-dark m-1 fw-normal">last: <span class="badge bg-secondary fw-normal">${last}</span></span>
          <span class="badge bg-info text-dark m-1 fw-normal">totalTasks: <span class="badge bg-secondary fw-normal">${totalTasks}</span></span>
          <span class="badge bg-info text-dark m-1 fw-normal">totalWorkflows: <span class="badge bg-secondary fw-normal">${totalWorkflows}</span></span>
          <span class="badge bg-info text-dark m-1 fw-normal">success: <span class="badge bg-secondary fw-normal">${success}</span></span>
          <span class="badge bg-warning text-dark m-1 fw-normal">failed: <span class="badge bg-secondary fw-normal">${failed !== 'undefined' ? failed : 0}</span></span>
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

                            return { ...task,taskId,runid, end, start, failed, success, total }

                        })())
                   
                    }//end for loop
                    const tasks = await Promise.all(taskPromises)
                
                  //  document.getElementById(`body-${runid}`).innerHTML=''
                    tasks.forEach((task,i) => {
                  
                        const end = task['end']
                        const failed = task['failed']
                        const runOrder = task['runOrder']
                        const runSequence = task['runSequence']
                        const start = task['start']
                        const success = task['success']
                        const taskName = task['taskName']
                        const total = task['total']
                        const taskId=task['taskId']
                        const runid =this.getAttribute('runid')
                      
                        document.getElementById(`body-${runid}`).insertAdjacentHTML('beforeend', `
                        <task-accordion-item taskName="${taskName}" runid="${runid}" taskId="${taskId}" runOrder="${runOrder}" runSequence="${runSequence}" total="${total}" success="${success}" failed="${failed}" start="${start}" end="${end}" data-id="${i}">
                        </task-accordion-item>`)
                    })
                })
            } else{
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
        this.open=false
        const dataId = this.getAttribute('data-id')
        const taskName =this.getAttribute('taskName')
        const runOrder=this.getAttribute('runOrder')
        const runSequence=this.getAttribute('runSequence')
        const start =this.getAttribute('start')
        const end =this.getAttribute('end')
        const success=this.getAttribute('success')
        const failed =this.getAttribute('failed')
        const total= this.getAttribute('total')
        const taskId=this.getAttribute('taskId')
        const runid =this.getAttribute('runid')
        debugger;
        this.innerHTML = `
        <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${dataId}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${dataId}" aria-expanded="true" aria-controls="collapse-${dataId}" id="${dataId}-wf-btn">
          <span class="badge  text-dark m-1 fw-light">TaskName: <span class="badge bg-secondary fw-normal">${taskName}</span></span>
          <span class="badge  text-dark m-1 fw-light">Run Order: <span class="badge bg-secondary fw-normal">${runOrder}</span></span>
          <span class="badge  text-dark m-1 fw-light">Run Order: <span class="badge bg-secondary fw-normal">${runSequence}</span></span>
          <span class="badge  text-dark m-1 fw-light">Total: <span class="badge bg-secondary fw-normal">${total}</span></span>
          <span class="badge  text-dark m-1 fw-light">Start: <span class="badge bg-secondary fw-normal">${start}</span></span>
          <span class="badge  text-dark m-1 fw-light">End: <span class="badge bg-secondary fw-normal">${end}</span></span>
          <span class="badge  text-dark m-1 fw-light">Success: <span class="badge bg-secondary fw-normal">${success}</span></span>
          <span class="badge  text-dark m-1 fw-light">Failed: <span class="badge bg-secondary fw-normal">${failed}</span></span>
          </button>
        </h2>
        <div id="collapse-${dataId}" class="accordion-collapse collapse" aria-labelledby="heading-${dataId}" data-bs-parent="#accordionExample">
          <div class="accordion-body" id="body-wf-${taskId}">
             
          </div>
        </div>
      </div>`

      document.getElementById(`${dataId}-wf-btn`).addEventListener('click',(e)=>{
          this.open=!this.open
          if(this.open){
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

                        return { ...workflow,taskId,runid, end, start, result }

                    })())
               
                }//end for loop
                const workflows = await Promise.all(workPromises)
                workflows.forEach(wf=>{
                    debugger;
                            const end =wf['end']
                            const repoName=wf["repoName"]
                            const result=wf["result"]
                            const runid =wf['runid']
                            const screenName=wf["screenName"]
                            const selectedBranch=wf["selectedBranch"]
                            const start=wf['start']
                            const workflowDescription=wf['workflowDescription']

                           document.getElementById(`body-wf-${taskId}`).insertAdjacentHTML('beforeend', 
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
        const taskId=this.getAttribute
        const repoName=this.getAttribute('repoName')
        const selectedBranch=this.getAttribute('selectedBranch')
        const owner=this.getAttribute('owner')
        const start=this.getAttribute('start')
        const end=this.getAttribute('end')
        const result =this.getAttribute('result')
        const desc= this.getAttribute('workflowDescription')

        debugger;
        this.innerHTML =`
        <div>
        <span class="badge  text-dark m-1 fw-normal">RepoName: <span class="badge bg-secondary fw-normal" >${repoName}</span></span>
        <span class="badge  text-dark m-1 fw-normal">Selected Branch: <span class="badge bg-secondary fw-normal" >${selectedBranch}</span></span>
        <span class="badge  text-dark m-1 fw-normal">Owner: <span class="badge bg-secondary fw-normal" >${owner}</span></span>
        <span class="badge  text-dark m-1 fw-normal">Start: <span class="badge bg-secondary fw-normal" >${start}</span></span>
        <span class="badge  text-dark m-1 fw-normal">End: <span class="badge bg-secondary fw-normal" >${end}</span></span>
        <span class="badge  text-dark m-1 fw-normal">Result: <span class="badge bg-secondary fw-normal" >${result}</span></span>
        <span class="badge  text-dark m-1 fw-normal">Desc: <span class="badge bg-secondary fw-normal" >${desc}</span></span>
      </div>`


    }
})



