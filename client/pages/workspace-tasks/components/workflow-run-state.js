

customElements.define('workflow-run-state', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
  
        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        const { idToken } = JSON.parse(localStorage.getItem('auth'))
        const taskId = this.getAttribute('taskId')
        const workflowKey = this.getAttribute('workflowKey')
        const objPath = `workflows/workspaces/${workspaceName}/tasks/${taskId}/${workflowKey}/lastLog`
        const fetchUrl = `${window.projectUrl}/${objPath}/.json?auth=${idToken}`

                        
        let childaddedEvent = new EventSource(fetchUrl, {});
        childaddedEvent.onerror = function (error) {
           

        };

        childaddedEvent.addEventListener('put',  (e)=> {
            const { data } = JSON.parse(e.data)
           
            this.render(data, taskId,workflowKey)
        })
        childaddedEvent.addEventListener('patch',  (e)=> {
            
            const { data } = JSON.parse(e.data)

            const start = data['start'] && new Date(parseInt(data['start']))
            const timestamp = data['start'] && data['start']
            const end = data['end'] && new Date(parseInt(data['end']))
          
            const result = data['result']
            
            start !== undefined ? document.getElementById(`${taskId}-${workflowKey}-start-time`).innerHTML = `${window.formatTime(start)}` : ''

            end !== undefined ? document.getElementById(`${taskId}-${workflowKey}-end-time`).innerHTML = `${window.formatTime(end)}` : document.getElementById(`${taskId}-${workflowKey}-end-time`).innerHTML = `<div class="spinner-grow text-light spinner-grow-sm" role="status" id="side_state_spinner-${taskId}-${workflowKey}"><span class="visually-hidden">Loading...</span></div>`
       

            result !==undefined ?document.getElementById(`${taskId}-${workflowKey}-start-time`).innerHTML=result:''
            if (end !== undefined) {
              this.timeInterval = null
      
              let starttimestamp = new Date(parseInt(document.getElementById(`${taskId}-${workflowKey}-timestamp`).textContent))
      
              const { hours, mins, seconds } = window.timespan(end, starttimestamp)
              const duration = `${hours}:${mins}:${seconds}`
              document.getElementById(`${taskId}-duration`).innerHTML = duration
            } else {
              // get previous duration
      
      
      
            }

            let timer = setInterval(function () {
                const sidespinner =document.getElementById(`side_state_spinner-${taskId}-${workflowKey}`)

                if (end === undefined && sidespinner !==null) {
                
                  let starttimestamp = new Date(parseInt(document.getElementById(`${taskId}-${workflowKey}-timestamp`).textContent))
                  let currentTime = new Date(Date.now())
                  const { hours, mins, seconds } = window.timespan(currentTime, starttimestamp)
                  const duration = `${hours}:${mins}:${seconds}`
                  document.getElementById(`${taskId}-duration`).innerHTML = duration
                } else {
                  console.log('end', end)
                  clearSelf(timer)
                }
        
              }, 1000)
        
              let clearSelf = function (intfunct) {
                clearInterval(intfunct)
              }
        })

     
    }

    render(data,taskId,workflowKey){
        const { result } = data
        const start = new Date(parseInt(data.start))
        const end = new Date(parseInt(data.end))
        const { hours, mins, seconds } = window.timespan(end, start)
        const duration = `${hours}:${mins}:${seconds}`
        const startTime = `${window.formatTime(start)}`
        const endTime = `${window.formatTime(end)}`
        const date = `${window.formatDate(start)}`
        this.innerHTML=`
        <div class="row">
        <div class="col-3 fw-normal text-center fw-normal">Start</div>
        <div class="col-3 fw-normal text-center fw-normal">End</div>
        <div class="col-3 fw-normal text-center fw-normal">Duration</div>
        <div class="col-3 fw-normal text-center fw-normal">Result</div>
        </div>
        <div class="row">
        <span class="col-3 badge rounded-pill bg-primary fw-light" id="${taskId}-${workflowKey}-start-time">${startTime}</span>
        <span class="col-3 badge rounded-pill bg-primary fw-light"id="${taskId}-${workflowKey}-end-time">${endTime}</span>
        <span class="col-3 badge rounded-pill bg-primary fw-light"id="${taskId}-${workflowKey}-duration">${duration}</span>
        <span class="col-3 badge rounded-pill fw-light bg-${result==='success'?'success':'danger'}"id="${taskId}-${workflowKey}-result">${result}</span>

        <span class="badge bg-primary rounded-pill fw-normal d-none" id="${taskId}-${workflowKey}-timestamp">${data.start}</span>
        </div>`
    }
})