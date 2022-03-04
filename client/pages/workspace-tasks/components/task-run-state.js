
customElements.define('task-run-state', class extends HTMLElement {
  constructor() {
    super()

  }

  connectedCallback() {
    const {title:workspaceName}=JSON.parse(localStorage.getItem('workspace'))
    const taskId =this.getAttribute('taskId')
  
    window.FB_DATABASE.ref(`workspaces/${workspaceName}/tasks/${taskId}/lastLog`).on('value',(error,{data})=>{

      debugger;
      this.render(data)
    })
   
  }

  render(data) {
    const {success,failed,total}=data
    const start =new Date(parseInt(data.start))
    const end =new Date(parseInt(data.end))
    const { hours, mins, seconds } = window.timespan(end, start)
    const duration = `${hours}:${mins}:${seconds}`
    const startTime = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
    const endTime = `${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
    const date =`${start.getDate()<10? '0'+start.getDate(): start.getDate()}.${start.getMonth()<10 ? '0'+ (start.getMonth()+1) :(start.getMonth()+1)}.${start.getFullYear()}`
        
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
      <span class="badge bg-primary rounded-pill">${startTime}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">End:(hh:mm:ss)</div>
      
      </div>
      <span class="badge bg-primary rounded-pill">${endTime}</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">Duration:(hh:mm:ss)</div>
     
      </div>
      <span class="badge bg-primary rounded-pill">${duration}</span>
    </li>

    <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-light">Success:</div>
    </div>
    <span class="badge bg-success rounded-pill">${success}</span>
  </li>

  <li class="list-group-item d-flex justify-content-between align-items-start">
  <div class="ms-2 me-auto">
    <div class="fw-light">Failed:</div>
  </div>
  <span class="badge bg-warning rounded-pill">${failed}</span>
</li>

<li class="list-group-item d-flex justify-content-between align-items-start">
<div class="ms-2 me-auto">
  <div class="fw-light">Total:</div>
</div>
<span class="badge bg-primary rounded-pill">${total}</span>
</li>
      </div>
      </div>`
  }
})
