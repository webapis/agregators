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

            const { data } = JSON.parse(e.data)
            this.render(data, workspaceName)

        })
        // childaddedEvent.addEventListener('patch', (e) => {

        //     const { data } = JSON.parse(e.data)

        //     const start = data['start'] && new Date(parseInt(data['start']))
        //     const timestamp = data['start'] && data['start']
        //     const end = data['end'] && new Date(parseInt(data['end']))
        //     const success = data['success']
        //     const failed = data['failed']
        //     const total = data['total']
        //     start !== undefined ? document.getElementById(`${taskId}-start-time`).innerHTML = `${window.formatTime(start)}` : ''
        //     start !== undefined ? document.getElementById(`${taskId}-date`).innerHTML = `${window.formatDate(start)}` : ''
        //     timestamp !== undefined ? document.getElementById(`${taskId}-timestamp`).innerHTML = timestamp : ''
        //     end !== undefined ? document.getElementById(`${taskId}-end-time`).innerHTML = `${window.formatTime(end)}` : document.getElementById(`${taskId}-end-time`).innerHTML = `<div class="spinner-grow text-light spinner-grow-sm" role="status" id="side_state_spinner-${taskId}"><span class="visually-hidden">Loading...</span></div>`

        //     success !== undefined ? document.getElementById(`${taskId}-success`).innerHTML = success : document.getElementById(`${taskId}-failed`).innerHTML = 0
        //     failed !== undefined ? document.getElementById(`${taskId}-failed`).innerHTML = failed : document.getElementById(`${taskId}-failed`).innerHTML = 0
        //     total !== undefined ? document.getElementById(`${taskId}-total`).innerHTML = total : ''
        //     if (end !== undefined) {
        //         this.timeInterval = null

        //         let starttimestamp = new Date(parseInt(document.getElementById(`${taskId}-timestamp`).textContent))

        //         const { hours, mins, seconds } = window.timespan(end, starttimestamp)
        //         const duration = `${hours}:${mins}:${seconds}`
        //         document.getElementById(`${taskId}-duration`).innerHTML = duration
        //     } else {
        //         // get previous duration



        //     }

        //     let timer = setInterval(function () {
        //         const sidespinner = document.getElementById(`side_state_spinner-${taskId}`)
        //         if (end === undefined && sidespinner !== null) {

        //             let starttimestamp = new Date(parseInt(document.getElementById(`${taskId}-timestamp`).textContent))
        //             let currentTime = new Date(Date.now())
        //             const { hours, mins, seconds } = window.timespan(currentTime, starttimestamp)
        //             const duration = `${hours}:${mins}:${seconds}`
        //             document.getElementById(`${taskId}-duration`).innerHTML = duration
        //         } else {
        //             console.log('end', end)
        //             clearSelf(timer)
        //         }

        //     }, 1000)

        //     let clearSelf = function (intfunct) {
        //         clearInterval(intfunct)
        //     }
        // })
    }
    render(data, workspaceName) {
        const { success, failed, totalTasks,totalWorkflows } = data
        const start = new Date(parseInt(data.start))
        const end = new Date(parseInt(data.last))

        const { hours, mins, seconds } = window.timespan(end, start)
        const duration = `${hours}:${mins}:${seconds}`
        const startTime = `${window.formatTime(start)}`
        const endTime = `${window.formatTime(end)}`
        const date = `${window.formatDate(start)}`
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
        <div class="col text-center" id="${workspaceName}-total-tasks"> <span class="badge bg-primary fw-light">${totalTasks}</span></div>
        <div class="col text-center" id="${workspaceName}-total-workflows">  <span class="badge bg-primary fw-light">${totalWorkflows}</span></div>
        <div class="col text-center" id="${workspaceName}-date"> <span class="badge bg-primary fw-light">${date}</span></div>
        <div class="col text-center" id="${workspaceName}-start"><span class="badge bg-primary fw-light">${startTime}</span></div>
        <div class="col text-center" id="${workspaceName}-end"><span class="badge bg-primary fw-light">${endTime}</span></div>
        <div class="col text-center" id="${workspaceName}-duration"><span class="badge bg-primary fw-light">${duration}</span></div>
        <div class="col text-center" id="${workspaceName}-success"><span class="badge bg-primary fw-light">${success}</span></div>
        <div class="col text-center" id="${workspaceName}-failed"><span class="badge bg-primary fw-light">${failed}</span></div>
        </div>`
    }
})