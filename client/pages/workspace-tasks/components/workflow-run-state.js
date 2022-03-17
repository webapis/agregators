

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
              debugger;
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
      debugger;
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


/*


customElements.define('workflow-run-state', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
  
        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        const { idToken } = JSON.parse(localStorage.getItem('auth'))
        const taskId = this.getAttribute('taskId')
        const workflowKey = this.getAttribute('workflowKey')
        const objPath = `workflows/workspaces/${workspaceName}/tasks/${taskId}/${workflowKey}/endLog`
        const fetchUrl = `${window.projectUrl}/${objPath}/.json?auth=${idToken}`

                        
        let childaddedEvent = new EventSource(fetchUrl, {});
        childaddedEvent.onerror = function (error) {
           

        };

        childaddedEvent.addEventListener('put',  (e)=> {
    
            const  state =  JSON.parse(e.data)
           
            this.render(state.data, taskId,workflowKey)
          

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
          } else if (prop === 'failed' || prop === 'success') {

              runStateProps[prop] = parseInt(data[prop])
          }
          else if (prop === 'totalTasks' || prop === 'totalWorkflows') {

              runStateProps[prop] = data[prop]
          }
      }
      this.runState = runStateProps


  }
    render(data,taskId,workflowKey){
      //  const { result } = data
        const result =(data&&data.result)?data.result:0
        const start =data&& data.start&&  new Date(parseInt(data.start))
        const end = data&&data.end&& new Date(parseInt(data.end))
        let duration = "00:00:00"
        let startTime ="00:00:00"
        let endTime = "00:00:00"
        let date = "00.00.0000"
    
    
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

        <span class="badge bg-primary rounded-pill fw-normal d-none" id="${taskId}-${workflowKey}-timestamp">${start}</span>
        </div>`
    }
})
*/