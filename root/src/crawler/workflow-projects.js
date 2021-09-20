customElements.define('workflow-projects', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
        const resources = await import('./resources.js')
        await resources.default()
      this.render()
    }

    render(){
        this.innerHTML=`        <top-navigation></top-navigation>

        <div class="container">
        <h3>Workflow Projects:</h3>
        <div class="row">
        <project-searchbox-by-key></project-searchbox-by-key>
        </div>
        </div>
        <app-footer></app-footer>`
    }
})

customElements.define('project-searchbox-by-key',class extends HTMLElement{
    constructor(){
        super()
    }
    connectedCallback(){
        this.innerHTML=`<div>
        <div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Enter shared project key" aria-label="Recipient's username" aria-describedby="button-addon2">
  <button class="btn btn-outline-secondary" type="button" id="button-addon2">Find</button>
</div>
        </div>`
    }
})