customElements.define('workflow-list-items', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
    
        const repoName = this.getAttribute('repoName')
        const selectedBranch = this.getAttribute('selectedBranch')
        const owner = this.getAttribute('owner')
        const start =new Date(parseInt( this.getAttribute('start')))
        const end = new Date(parseInt( this.getAttribute('end')))
        const result = this.getAttribute('result')
        const desc = this.getAttribute('workflowDescription')
        const { hours, mins, seconds } = window.timespan(end, start)
        const duration = `${hours}:${mins}:${seconds}`
        const startTime = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`
        const endTime = `${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
        debugger;
        this.innerHTML = `
        <div class="row">

        <div class="col row px-1 mb-1">
      
        <span class="col-12 badge bg-secondary fw-normal" >${desc}</span>
        </div>
       
        <div class="col row px-1 mb-1">
      
        <span class="col-12 badge bg-secondary fw-normal" >${repoName}</span>
        </div>

       
        <div class="col row px-1 mb-1">
     
        <span class="col-12 badge bg-secondary fw-normal" >${selectedBranch}</span>
        </div>

       
        <div class="col row px-1 mb-1">
       
        <span class="col-12 badge bg-secondary fw-normal" >${owner}</span>
        </div>

        <div class="col row px-1 mb-1">
       
        <span class="col-12 badge bg-secondary fw-normal" >${startTime}</span>
        </div>

        <div class="col row px-1 mb-1">
     
        <span class="col-12 badge bg-secondary fw-normal" >${endTime}</span>
        </div>
       
        <div class="col row px-1 mb-1">
      
        <span class="col-12 badge bg-secondary fw-normal" >${duration}</span>
        </div>

        <div class="col row px-1 mb-1">
      
        <span class="col-12 badge bg-secondary fw-normal" >${result}</span>
        </div>
   
        <div class="col row px-1 mb-1">
       
        <span class="col-12 badge bg-secondary fw-normal" >${desc}</span>
        </div>
    
      </div>`


    }
})
