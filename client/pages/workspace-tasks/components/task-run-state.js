
customElements.define('task-run-state', class extends HTMLElement{
    constructor(){
        super()

    }

    connectedCallback(){
        this.innerHTML=`<div>
        <h7>Last Run:</h7>
        <div class="border border-0">
        <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-light">Start</div>
       
        </div>
        <span class="badge bg-primary rounded-pill">14</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-light">End</div>
        
        </div>
        <span class="badge bg-primary rounded-pill">14</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-light">Duration</div>
       
        </div>
        <span class="badge bg-primary rounded-pill">14</span>
      </li>

      <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-light">Result</div>
     
      </div>
      <span class="badge bg-success rounded-pill">Complete</span>
    </li>
        </div>
        </div>`
    }
})
