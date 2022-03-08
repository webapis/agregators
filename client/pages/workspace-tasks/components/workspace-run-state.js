customElements.define('workspace-run-state', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        const { idToken } = JSON.parse(localStorage.getItem('auth'))
        const taskId = this.getAttribute('taskId')
        const objPath = `workspaces/${workspaceName}/lastLog`
        const fetchUrl = `${window.projectUrl}/${objPath}/.json?auth=${idToken}`

        var childaddedEvent = new EventSource(fetchUrl, {});
        childaddedEvent.onerror = (error) => {

        };
        childaddedEvent.addEventListener('put', (e) => {
                debugger;
                const state  = JSON.parse(e.data)
                this.render(state.data, workspaceName)
        })
        childaddedEvent.addEventListener('patch', (e) => {

            const { data } = JSON.parse(e.data)
         

            const start = data['start'] && new Date(parseInt(data['start']))
            const timestamp = data['start'] && data['start']
            const end = data['last'] && new Date(parseInt(data['last']))
            const success = data['success']
            const failed = data['failed']
           // const total = data['total']
            start !== undefined ? document.getElementById(`${workspaceName}-start-time`).innerHTML = `${window.formatTime(start)}` : ''
            start !== undefined ? document.getElementById(`${workspaceName}-date`).innerHTML = `${window.formatDate(start)}` : ''
            timestamp !== undefined ? document.getElementById(`${workspaceName}-timestamp`).innerHTML = timestamp : ''
           // end !== undefined ? document.getElementById(`${workspaceName}-end-time`).innerHTML = `${window.formatTime(end)}` : document.getElementById(`${workspaceName}-end-time`).innerHTML = `<div class="spinner-grow text-light spinner-grow-sm" role="status" id="side_state_spinner-${workspaceName}"><span class="visually-hidden">Loading...</span></div>`
            if(end !==undefined){
                debugger;
            }
            success !== undefined ? document.getElementById(`${workspaceName}-success`).innerHTML = success : document.getElementById(`${workspaceName}-failed`).innerHTML = 0
            failed !== undefined ? document.getElementById(`${workspaceName}-failed`).innerHTML = failed : document.getElementById(`${workspaceName}-failed`).innerHTML = 0
           // total !== undefined ? document.getElementById(`${workspaceName}-total`).innerHTML = total : ''
            const totalWorkFlows =document.getElementById(`${workspaceName}-total-workflows`).textContent ?parseInt( document.getElementById(`${workspaceName}-total-workflows`).textContent):0
            const totalSuccessFul= document.getElementById(`${workspaceName}-success`).textContent?parseInt( document.getElementById(`${workspaceName}-success`).textContent):0
            debugger;
            const totalFailed = document.getElementById(`${workspaceName}-failed`).textContent? parseInt(document.getElementById(`${workspaceName}-failed`).textContent):0
            debugger;
            if(totalWorkFlows>0 && totalWorkFlows === (totalSuccessFul+ totalFailed)){
                    document.getElementById(`${workspaceName}-end-time`).innerHTML = `${window.formatTime(end)}` 
                } else
                {
                    debugger;
                    document.getElementById(`${workspaceName}-end-time`).innerHTML = document.getElementById(`${workspaceName}-end-time`).innerHTML = `<div class="spinner-grow text-light spinner-grow-sm" role="status" id="side_state_spinner-${workspaceName}"><span class="visually-hidden">Loading...</span></div>`
                }

            if (end !== undefined) {
                this.timeInterval = null

                let starttimestamp = new Date(parseInt(document.getElementById(`${workspaceName}-timestamp`).textContent))

                const { hours, mins, seconds } = window.timespan(end, starttimestamp)
                const duration = `${hours}:${mins}:${seconds}`
                document.getElementById(`${workspaceName}-duration`).innerHTML = duration
            } else {
                // get previous duration



            }

            let timer = setInterval(function () {
                const sidespinner = document.getElementById(`side_state_spinner-${workspaceName}`)
                if (end === undefined && sidespinner !== null) {

                    let starttimestamp = new Date(parseInt(document.getElementById(`${workspaceName}-timestamp`).textContent))
                    let currentTime = new Date(Date.now())
                    const { hours, mins, seconds } = window.timespan(currentTime, starttimestamp)
                    const duration = `${hours}:${mins}:${seconds}`
                    document.getElementById(`${workspaceName}-duration`).innerHTML = duration
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
    render(data, workspaceName) {
 
        const success= (data&&data.success) ? data.success:0
        const failed =(data&&data.failed)? data.failed:0
        const totalTasks=(data&&data.totalTasks) ?data.totalTasks:0
        const totalWorkflows=(data&& data.totalWorkflows) ?data.totalWorkflows:0

        const start =data&& data.start&&  new Date(parseInt(data.start))
        const end = data&&data.last&& new Date(parseInt(data.last))
        let duration = "00:00:00";
        let startTime ="00:00:00";
        let endTime = "00:00:00";
        let date = "00.00.0000";

   
            if(end && start){
                const { hours, mins, seconds } = window.timespan(end, start)
                 duration = `${hours}:${mins}:${seconds}`
              
              
               
            }

            if(start){
                 startTime = `${window.formatTime(start)}`
                 date = `${window.formatDate(start)}`
            }
            if(end){
                 endTime = `${window.formatTime(end)}`
            }
      
    
        debugger;
        this.innerHTML = `
        <div class="row">
        <div class="col fw-normal text-center">Tasks</div>
        <div class="col fw-normal text-center">Workflows</div>
        <div class="col fw-normal text-center">Date</div>
        <div class="col fw-normal text-center">Start</div>
        <div class="col fw-normal text-center">End</div>
        <div class="col fw-normal text-center">Duration</div>
        <div class="col fw-normal text-center">Success</div>
        <div class="col fw-normal text-center">Failed</div>
        </div>
        <div class="row">
        <div class="col text-center"> <span class="badge bg-primary fw-light" id="${workspaceName}-total-tasks">${totalTasks}</span></div>
        <div class="col text-center">  <span class="badge bg-primary fw-light" id="${workspaceName}-total-workflows">${totalWorkflows}</span></div>
        <div class="col text-center"> <span class="badge bg-primary fw-light" id="${workspaceName}-date">${date}</span></div>
        <div class="col text-center"><span class="badge bg-primary fw-light" id="${workspaceName}-start-time">${startTime}</span></div>
        <div class="col text-center"><span class="badge bg-primary fw-light" id="${workspaceName}-end-time">${endTime}</span></div>
        <div class="col text-center"><span class="badge bg-primary fw-light" id="${workspaceName}-duration">${duration}</span></div>
        <div class="col text-center"><span class="badge bg-primary fw-light" id="${workspaceName}-success">${success}</span></div>
        <div class="col text-center"><span class="badge bg-primary fw-light" id="${workspaceName}-failed">${failed}</span></div>
        <span class="badge bg-primary rounded-pill fw-normal d-none" id="${workspaceName}-timestamp">${start}</span>
        </div>`
    }
})