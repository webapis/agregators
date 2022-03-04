
customElements.define('task-run-state', class extends HTMLElement {
  constructor() {
    super()

  }

  connectedCallback() {
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
    const { idToken } = JSON.parse(localStorage.getItem('auth'))
    const taskId = this.getAttribute('taskId')
    const objPath = `workspaces/${workspaceName}/tasks/${taskId}/lastLog`
    const fetchUrl = `${window.projectUrl}/${objPath}/.json?auth=${idToken}`

    var childaddedEvent = new EventSource(fetchUrl, {});
    childaddedEvent.onerror = (error) => {

     
    };
    childaddedEvent.addEventListener('put', (e) => {
  
      const { data } = JSON.parse(e.data)
      this.render(data,taskId)
   
    })
    childaddedEvent.addEventListener('patch', (e) => {
   
      const { data } = JSON.parse(e.data)

      const start = data['start'] && new Date(parseInt(data['start']))
      const timestamp =data['start'] && data['start']
      const end = data['end'] && new Date(parseInt(data['end']))
      const success = data['success']
      const failed = data['failed']
      const total = data['total']
      start !== undefined ? document.getElementById(`${taskId}-start-time`).innerHTML = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}` : ''
      timestamp !== undefined ? document.getElementById(`${taskId}-timestamp`).innerHTML = timestamp : ''
      end !== undefined ? document.getElementById(`${taskId}-end-time`).innerHTML = `${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}` : document.getElementById(`${taskId}-end-time`).innerHTML='Pending...'
      
      success !== undefined ? document.getElementById(`${taskId}-success`).innerHTML = success : document.getElementById(`${taskId}-failed`).innerHTML=0
      failed !== undefined ? document.getElementById(`${taskId}-failed`).innerHTML = failed : document.getElementById(`${taskId}-failed`).innerHTML = 0
      total !== undefined ? document.getElementById(`${taskId}-total`).innerHTML = total :''
      if ( end !== undefined) {
        debugger;
        let starttimestamp=new Date(parseInt(document.getElementById(`${taskId}-timestamp`).textContent))
        debugger;
        const { hours, mins, seconds } = window.timespan(end, starttimestamp)
        const duration = `${hours}:${mins}:${seconds}`
        document.getElementById(`${taskId}-duration`).innerHTML = duration
      }

 
    })


  }

  render(data,taskId) {
    const { success, failed, total } = data
    const start = new Date(parseInt(data.start))
    const end = new Date(parseInt(data.end))
    const { hours, mins, seconds } = window.timespan(end, start)
    const duration = `${hours}:${mins}:${seconds}`
    const startTime = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
    const endTime = `${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
    const date = `${start.getDate() < 10 ? '0' + start.getDate() : start.getDate()}.${start.getMonth() < 10 ? '0' + (start.getMonth() + 1) : (start.getMonth() + 1)}.${start.getFullYear()}`

    this.innerHTML = `<div>
      <h7>Last Run:</h7>
      <div class="border border-0">
      <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">Date:(DD.MM.YYYY)</div>
      </div>
      <span class="badge bg-primary rounded-pill">${date}</span>
      </li>

      <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">Start:(hh:mm:ss)</div>
     
      </div>
      <span class="badge bg-primary rounded-pill" id="${taskId}-start-time">${startTime}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">End:(hh:mm:ss)</div>
      
      </div>
      <span class="badge bg-primary rounded-pill" id="${taskId}-end-time">${endTime}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">Duration:(hh:mm:ss)</div>
     
      </div>
      <span class="badge bg-primary rounded-pill" id="${taskId}-duration">${duration}</span>
    </li>

    <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-light">Success:</div>
    </div>
    <span class="badge bg-success rounded-pill" id="${taskId}-success">${success}</span>
  </li>

  <li class="list-group-item d-flex justify-content-between align-items-start">
  <div class="ms-2 me-auto">
    <div class="fw-light">Failed:</div>
  </div>
  <span class="badge bg-warning rounded-pill" id="${taskId}-failed">${failed}</span>
</li>

<li class="list-group-item d-flex justify-content-between align-items-start">
<div class="ms-2 me-auto">
  <div class="fw-light">Total:</div>
</div>
<span class="badge bg-primary rounded-pill" id="${taskId}-total">${total}</span>
</li>

<li class="list-group-item d-flex justify-content-between align-items-start">
<div class="ms-2 me-auto">
  <div class="fw-light">Start Timestamp:</div>
</div>
<span class="badge bg-primary rounded-pill" id="${taskId}-timestamp">${data.start}</span>
</li>
      </div>
      </div>`
  }
})
