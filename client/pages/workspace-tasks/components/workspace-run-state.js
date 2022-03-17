customElements.define('workspace-run-state', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        const { idToken } = JSON.parse(localStorage.getItem('auth'))

        const objPath = `workspaces/${workspaceName}/lastLog`
        const fetchUrl = `${window.projectUrl}/${objPath}/.json?auth=${idToken}`


        var childaddedEvent = new EventSource(fetchUrl, {});
        childaddedEvent.onerror = (error) => {

        };
        childaddedEvent.addEventListener('put', (e) => {

            const state = JSON.parse(e.data)

            this.runState = { start: '00:00:00', last: '00:00:00', duration: '00:00:00', date: '00.00.00', success: 0, failed: 0, totalTasks: 0, totalWorkflows: 0, ...state.data, timestamp: 0 }
            this.setState(state.data)
            this.render(workspaceName)
            if(this.runState.totalWorkflows===0){
                this.runStateTimer = setInterval(() => {

                    const { totalWorkflows, success, failed } = this.runState
                  //  if ((totalWorkflows > 0 && totalWorkflows > (success + failed))) {
    
                        let starttimestamp = new Date(parseInt(this.runState.timestamp))
    
                        let currentTime = new Date(Date.now())
    
                        const { hours, mins, seconds } = window.timespan(currentTime, starttimestamp)
                        const duration = `${hours}:${mins}:${seconds}`
                        
                        document.getElementById(`${workspaceName}-duration`).innerHTML = duration
                        
    
                    //}
    
    
                }, 1000)
            }
          
        })
        childaddedEvent.addEventListener('patch', (e) => {
            const { totalWorkflows, success, failed } = this.runState
            const { data } = JSON.parse(e.data)
            this.setState(data)
            this.render(workspaceName)

            let clearSelf = function (intfunct) {
                clearInterval(intfunct)
            }
            if (totalWorkflows > 0 && (totalWorkflows === (success + failed))) {
                debugger;
                clearSelf(this.runStateTimer)
            }

        })
    }

    setState(data) {
        this.runState = { ...this.runState, ...data }
        const runStateProps = this.runState
        for (let prop in data) {
            if (prop === 'start' || prop === 'last') {
                let date = new Date(parseInt(data[prop]))
                runStateProps[prop] = window.formatTime(date)

                if (prop === 'start') {
                    runStateProps['date'] = window.formatDate(date)
                    runStateProps['timestamp'] = data[prop]
                }
                if (prop === 'last') {
                    let starttimestamp = new Date(parseInt(data.start || this.runState.timestamp))

                    const { hours, mins, seconds } = window.timespan(date, starttimestamp)
                    const duration = `${hours}:${mins}:${seconds}`

                    runStateProps['duration'] = duration
                }
            } else if (prop === 'failed' || prop === 'success') {

                runStateProps[prop] = parseInt(data[prop])
            }
            else if (prop === 'totalTasks' || prop === 'totalWorkflows') {

                runStateProps[prop] = data[prop]
            }
        }
        this.runState = runStateProps


    }
    render(workspaceName) {
        const { start, last, date, duration, success, failed, totalTasks, totalWorkflows } = this.runState
        console.log(last.includes('00:00:00'))
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
        <div class="col fw-normal text-center">State</div>
        </div>
        <div class="row">
        <div class="col text-center"> <span class="badge bg-primary fw-light" id="${workspaceName}-totalTasks">${totalTasks}</span></div>
        <div class="col text-center">  <span class="badge bg-primary fw-light" id="${workspaceName}-totalWorkflows">${success + failed}/${totalWorkflows}</span></div>
        <div class="col text-center"> <span class="badge bg-primary fw-light" id="${workspaceName}-date">${date}</span></div>
        <div class="col text-center"><span class="badge bg-primary fw-light" id="${workspaceName}-start-time">${start}</span></div>
        <div class="col text-center"><span class="badge bg-primary fw-light" id="${workspaceName}-end-time">${last}</span></div>
        <div class="col text-center"><span class="badge bg-${totalWorkflows === (success + failed) ? 'success' : 'warning'} fw-light" id="${workspaceName}-duration">${duration}</span></div>
        <div class="col text-center"><span class="badge bg-primary fw-light" id="${workspaceName}-success">${success}</span></div>
        <div class="col text-center"><span class="badge bg-${failed > 0 ? 'warning' : 'primary'} fw-light" id="${workspaceName}-failed">${failed}</span></div>
        <span class="badge bg-primary rounded-pill fw-normal d-none" id="${workspaceName}-timestamp">${start}</span>
        <div class="col text-center">
        <span class="badge rounded-pill fw-normal">
        ${(totalWorkflows>0 && totalWorkflows>(success+failed) )?`<div class="spinner-grow text-success spinner-grow-sm" role="status" id="spinner-${workspaceName}"><span class="visually-hidden">Loading...</span></div>`:'vvvv'}
        </span>
       </div>
        </div>`
    }
})
