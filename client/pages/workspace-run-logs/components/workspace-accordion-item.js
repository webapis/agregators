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
        const wsrunid = this.getAttribute('wsrunid')
        const { hours, mins, seconds } = timespan(new Date(parseInt(this.getAttribute('last'))), new Date(parseInt(this.getAttribute('start'))))
        const duration = `${hours}:${mins}:${seconds}`

        const startTime = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
        const endTime = `${last.getHours()}:${last.getMinutes()}:${last.getSeconds()}`
        const date =`${start.getDate()<10? '0'+start.getDate(): start.getDate()}.${start.getMonth()<10 ? '0'+ (start.getMonth()+1) :(start.getMonth()+1)}.${start.getFullYear()}`
        
        this.open = false

        this.innerHTML = `
        <div class="accordion-item">
        <h2 class="accordion-header" id="heading-${dataId}">
          <button class="accordion-button py-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${dataId}" aria-expanded="true" aria-controls="collapse-${dataId}" id="ws-${dataId}-btn">
          <div class="row">
          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Date:<br>(dd:mm:yyyy)</span>
          <span class="col-12 badge bg-secondary fw-normal">${date}</span>
          </div>
         
          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Start:<br>(hh:mm:ss)</span>
          <span class="col-12 badge bg-secondary fw-normal">${startTime}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">End:<br>(hh:mm:ss)</span>
          <span class="col-12 badge bg-secondary fw-normal">${endTime}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Duration:<br>(hh:mm:ss)</span>
          <span class="col-12 badge bg-secondary fw-normal">${duration}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Total <br>Tasks:</span>
          <span class="col-12 badge bg-secondary fw-normal">${totalTasks}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Total <br>Workflows:</span>
          <span class="col-12 badge bg-secondary fw-normal">${totalWorkflows}</span>
          </div>
          
          <div class="col row p-1">
          <span class="col-12 badge bg-info text-dark fw-normal">Success:<br>Workflows</span>
          <span class="col-12 badge bg-secondary fw-normal">${success}</span>
          </div>

          <div class="col row p-1">
          <span class="col-12 badge bg-warning text-dark fw-normal">Failed:<br>Workflows</span>
          <span class="col-12 badge bg-secondary fw-normal">${failed !== 'undefined' ? failed : 0}</span>
          </div>

      
          </div>
          </button>
        </h2>
        <div id="collapse-${dataId}" class="accordion-collapse collapse" aria-labelledby="heading-${dataId}" data-bs-parent="#accordionExample">
          <div class="accordion-body" id="body-${wsrunid}">
       <h7>Tasks run results:</h7>
          </div>
        </div>
      </div>`

        document.getElementById(`ws-${dataId}-btn`).addEventListener('click', async(e) => {
            this.open = !this.open

            if (this.open) {

                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const { idToken } = JSON.parse(localStorage.getItem('auth'))
    
                const taskLogRef=`/taskLogs/${workspaceName}/${wsrunid}/tasks`
                const taskLogObjects =await window.getLogObjects(taskLogRef)
                debugger;
          
                    let taskPromises = []
                    for (let taskId in taskLogObjects) {

                        const end = taskLogObjects[taskId]['log']['end']
                        const start = taskLogObjects[taskId]['log']['start']
                        const failed = taskLogObjects[taskId]['log']['failed']
                        const success = taskLogObjects[taskId]['log']['success']
                        const total = taskLogObjects[taskId]['log']['total']

                        taskPromises.push((async () => {
                            const fetchUrl = `${window.projectUrl}/workspaces/${workspaceName}/tasks/${taskId}/.json?auth=${idToken}`
                            const getResponse = await fetch(fetchUrl, { method: 'GET' })

                            const task = await getResponse.json()

                            return { ...task, taskId, wsrunid, end, start, failed, success, total }

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
                        const wsrunid = this.getAttribute('wsrunid')
                        if(document.getElementById(`${taskId}-${wsrunid}`)){
                            debugger;
                            const parent =document.getElementById(`${taskId}-${wsrunid}`).parentElement
                            parent.removeChild(document.getElementById(`${taskId}-${wsrunid}`))
                        }
                        document.getElementById(`body-${wsrunid}`).insertAdjacentHTML('beforeend', `
                        <task-accordion-item taskName="${taskName}" wsrunid="${wsrunid}" taskId="${taskId}" runOrder="${runOrder}" runSequence="${runSequence}" total="${total}" success="${success}" failed="${failed}" start="${start}" end="${end}" id="${taskId}-${wsrunid}">
                        </task-accordion-item>`)
                    })
             
            } else {
                // document.getElementById(`body-${runid}`).innerHTML=''
            }

        })
    }

})



