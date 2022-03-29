

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
    
            const  state =  JSON.parse(e.data)
            this.runState = { start: '00:00:00', end: '00:00:00', duration: '00:00:00', date: '00.00.00', result:undefined,  ...state.data, timestamp: 0 }
            this.setState(state.data)
            this.render(taskId,workflowKey)
          
            if(this.runState.result===undefined){
              this.runStateTimer = setInterval(() => {

          
                      let starttimestamp = new Date(parseInt(this.runState.timestamp))
  
                      let currentTime = new Date(Date.now())
  
                      const { hours, mins, seconds } = window.timespan(currentTime, starttimestamp)
                      const duration = `${hours}:${mins}:${seconds}`
                        if( document.getElementById(`${taskId}-${workflowKey}-duration`)){
                            document.getElementById(`${taskId}-${workflowKey}-duration`).innerHTML = duration;
                        } 
                
                      
              
  
              }, 1000)
          }
        })
        childaddedEvent.addEventListener('patch',  (e)=> {
          const { result } = this.runState
          const { data } = JSON.parse(e.data)
          this.setState(data)
          this.render(workspaceName)

          let clearSelf = function (intfunct) {
              clearInterval(intfunct)
          }
          if (result) {
              
              clearSelf(this.runStateTimer)
          }
           
        })

     
    }
    setState(data) {
      this.runState = { ...this.runState, ...data }
      const runStateProps = this.runState
      for (let prop in data) {
          if (prop === 'start' || prop === 'end') {
              let date = new Date(parseInt(data[prop]))
              runStateProps[prop] = window.formatTime(date)

              if (prop === 'start') {
                  runStateProps['date'] = window.formatDate(date)
                  runStateProps['timestamp'] = data[prop]
              }
              if (prop === 'end') {
                  let starttimestamp = new Date(parseInt(data.start || this.runState.timestamp))

                  const { hours, mins, seconds } = window.timespan(date, starttimestamp)
                  const duration = `${hours}:${mins}:${seconds}`

                  runStateProps['duration'] = duration
              }
          } else if (prop === 'result' || prop === 'result') {

              runStateProps[prop] =data[prop]
          }
       
      }
      this.runState = runStateProps


  }
    render(taskId,workflowKey){
    
      const { start, end, duration,result } = this.runState
      
        this.innerHTML=`
        <div class="row">
        <div class="col-3 fw-normal text-center fw-normal">Start</div>
        <div class="col-3 fw-normal text-center fw-normal">End</div>
        <div class="col-3 fw-normal text-center fw-normal">Duration</div>
        <div class="col-3 fw-normal text-center fw-normal">Result</div>
        
        </div>
        <div class="row">
        <span class="col-3 badge rounded-pill bg-primary fw-light" id="${taskId}-${workflowKey}-start-time">${start}</span>
        <span class="col-3 badge rounded-pill bg-primary fw-light"id="${taskId}-${workflowKey}-end-time">${end}</span>
        <span class="col-3 badge rounded-pill bg-${result!==undefined?'primary':'warning'} fw-light"id="${taskId}-${workflowKey}-duration">${duration}</span>
       ${end !=='00:00:00'? `<span class="col-3 badge rounded-pill fw-light bg-${result==='success'?'success':'danger'}"id="${taskId}-${workflowKey}-result">${result}</span>`:`<span class="col-3 badge rounded-pill bg-primary fw-light">Pending...</span>`}

        <span class="badge bg-primary rounded-pill fw-normal d-none" id="${taskId}-${workflowKey}-timestamp">${start}</span>
        </div>`
    }
})


