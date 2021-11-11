customElements.define('workflow-project-editor', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        const resources = await import('./resources.js')
        await resources.default()
        this.render()
    }

    render() {
        this.innerHTML = `<top-navigation></top-navigation>

        <div class="container">
        <h3>Workflow Project Editor:</h3>
        <div class="row">
        <div class="col-12">
        <div class="mb-3">
          <label for="projectNameInput" class="form-label">Project Name:</label>
          <input type="text" class="form-control" id="projectNameInput" placeholder="Enter Project Name">
        </div>
  
     
 
  
    
      </div>
      <div class="col-12 mt-2">
      <button type="button" class="btn btn-secondary">Save Project</button>
      </div>

        <project-tabs></project-tabs>
        </div>
        </div>
        <app-footer></app-footer>`
    }
})



customElements.define('project-tabs', class extends HTMLElement {
    constructor() {
        super()


    }

    connectedCallback() {
        const { selectedProjectTab } = window.pageStore.state
        this.render({ selectedTab: selectedProjectTab })
        window.pageStore.subscribe(window.actionTypes.PROJECT_EDITOR_TAB_CHANGED,state=>{
            const { selectedProjectTab } = state
            this.render({ selectedTab: selectedProjectTab })
        })
    }
    render({ selectedTab }) {
        this.innerHTML = `
        <div class="col-12 mt-2">
        <ul class="nav nav-tabs" id ="projects-editor-tabs">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#" id="project-workflows">Workflows</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" id="shared-by-keys">Share by keys</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" id="shared-by-email">Share by Email</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="#" id="transfer-ownership">Transfer ownership</a>
      </li>
      </ul>
      ${selectedTab === 'project-workflows' ? '<project-workflows-content></project-workflows-content>' : ''}
      ${selectedTab === 'shared-by-keys' ? '<shared-by-keys-content></shared-by-keys-content>' : ''}
      ${selectedTab === 'shared-by-email' ? '<shared-by-email-content></shared-by-email-content>' : ''}
      ${selectedTab === 'transfer-ownership' ? '<transfer-ownership-content></transfer-ownership-content>' : ''}
        </div>
        `

document.querySelectorAll('#projects-editor-tabs a').forEach(element=>{
    element.addEventListener('click', (e)=>{
        e.preventDefault()
        const {id}=e.target
        debugger;
        window.pageStore.dispatch({type:window.actionTypes.PROJECT_EDITOR_TAB_CHANGED,payload:id})

    })
})
    }
})



customElements.define('project-workflows-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>
        <workflow-searchbox class="m-4"></workflow-searchbox>
        <workflow-table></workflow-table>
        </div>`
    }
})


customElements.define('shared-by-keys-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>shared-by-keys</div>`
    }
})

customElements.define('shared-by-email-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>shared-by-email</div>`
    }
})
customElements.define('transfer-ownership-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>transfer-ownership-content</div>`
    }
})



customElements.define('workflow-searchbox', class extends HTMLElement{
    constructor(){
        super()
    }
    connectedCallback(){
        this.innerHTML=`
        <div class="row">
        <div class="col">
<input class="form-control mt-2" list="datalistOptions" id="exampleDataList" placeholder="Type to search for workflows...">
<datalist id="datalistOptions">
  <option value="San Francisco">
  <option value="New York">
  <option value="Seattle">
  <option value="Los Angeles">
  <option value="Chicago">
</datalist>
</div>
<div class="col">
<button class="btn btn-secondary mt-2">Add</button>
</div>
</div>
        `
    }
})

