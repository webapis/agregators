
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
      this.render(data, taskId)

    })
    childaddedEvent.addEventListener('patch', (e) => {

      const { data } = JSON.parse(e.data)

      const start = data['start'] && new Date(parseInt(data['start']))
      const timestamp = data['start'] && data['start']
      const end = data['end'] && new Date(parseInt(data['end']))
      const success = data['success']
      const failed = data['failed']
      const total = data['total']
      start !== undefined ? document.getElementById(`${taskId}-start-time`).innerHTML = `${window.formatTime(start)}` : ''
      start !== undefined ? document.getElementById(`${taskId}-date`).innerHTML = `${window.formatDate(start)}` : ''
      timestamp !== undefined ? document.getElementById(`${taskId}-timestamp`).innerHTML = timestamp : ''
      end !== undefined ? document.getElementById(`${taskId}-end-time`).innerHTML = `${window.formatTime(end)}` : document.getElementById(`${taskId}-end-time`).innerHTML = `<div class="spinner-grow text-light spinner-grow-sm" role="status" id="side_state_spinner-${taskId}"><span class="visually-hidden">Loading...</span></div>`

      success !== undefined ? document.getElementById(`${taskId}-success`).innerHTML = success : document.getElementById(`${taskId}-failed`).innerHTML = 0
      failed !== undefined ? document.getElementById(`${taskId}-failed`).innerHTML = failed : document.getElementById(`${taskId}-failed`).innerHTML = 0
      total !== undefined ? document.getElementById(`${taskId}-total`).innerHTML = total : ''
      if (end !== undefined) {
        this.timeInterval = null

        let starttimestamp = new Date(parseInt(document.getElementById(`${taskId}-timestamp`).textContent))

        const { hours, mins, seconds } = window.timespan(end, starttimestamp)
        const duration = `${hours}:${mins}:${seconds}`
        document.getElementById(`${taskId}-duration`).innerHTML = duration
      } else {
        // get previous duration



      }

      let timer = setInterval(function () {
        const sidespinner =document.getElementById(`side_state_spinner-${taskId}`)
        if (end === undefined && sidespinner !==null) {
        
          let starttimestamp = new Date(parseInt(document.getElementById(`${taskId}-timestamp`).textContent))
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

  render(data, taskId) {
    const { success, failed, total } = data
    const start = new Date(parseInt(data.start))
    const end = new Date(parseInt(data.end))
    const { hours, mins, seconds } = window.timespan(end, start)
    const duration = `${hours}:${mins}:${seconds}`
    const startTime = `${window.formatTime(start)}`
    const endTime = `${window.formatTime(end)}`
    const date = `${window.formatDate(start)}`

    this.innerHTML = `<div>
      <h7>Last Run:</h7>
      <div class="border border-0">
      <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">Date:(DD.MM.YYYY)</div>
      </div>
      <span class="badge bg-primary rounded-pill fw-normal" id="${taskId}-date">${date}</span>
      </li>

      <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">Start:(hh:mm:ss)</div>
     
      </div>
      <span class="badge bg-primary rounded-pill fw-normal" id="${taskId}-start-time">${startTime}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">End:(hh:mm:ss)</div>
      
      </div>
      <span class="badge bg-primary rounded-pill fw-normal" id="${taskId}-end-time">${endTime}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">Duration:(hh:mm:ss)</div>
     
      </div>
      <span class="badge bg-primary rounded-pill fw-normal" id="${taskId}-duration">${duration}</span>
    </li>

    <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-light">Success:</div>
    </div>
    <span class="badge bg-success rounded-pill fw-normal" id="${taskId}-success">${success}</span>
  </li>

  <li class="list-group-item d-flex justify-content-between align-items-start">
  <div class="ms-2 me-auto">
    <div class="fw-light">Failed:</div>
  </div>
  <span class="badge bg-warning rounded-pill fw-normal" id="${taskId}-failed">${failed}</span>
</li>

<li class="list-group-item d-flex justify-content-between align-items-start">
<div class="ms-2 me-auto">
  <div class="fw-light">Total:</div>
</div>
<span class="badge bg-primary rounded-pill fw-normal" id="${taskId}-total">${total}</span>
</li>

<li class="list-group-item d-flex justify-content-between align-items-start d-none">
<div class="ms-2 me-auto">
  <div class="fw-light">Start Timestamp:</div>
</div>
<span class="badge bg-primary rounded-pill fw-normal" id="${taskId}-timestamp">${data.start}</span>
</li>
      </div>
      </div>`
  }
})
