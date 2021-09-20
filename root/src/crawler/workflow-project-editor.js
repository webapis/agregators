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

customElements.define('workflow-table', class extends HTMLElement{
    constructor(){
        super()
    }
    connectedCallback(){
        this.innerHTML=`<div">
      <div class="row border-bottom fw-bold mb-2">
            <div class="col">#</div>
            <div class="col">Workflow</div>
            <div class="col">Configuration</div>
            <div class="col">Remove</div>
      </div>
     <project-workflow-table-row></project-workflow-table-row>
     <project-workflow-table-row></project-workflow-table-row>
      </div>`
    }
})

customElements.define('project-workflow-table-row', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        this.innerHTML=`
       <div class="row border-bottom">
        <div class="col">1</div>
        <div class="col">Mark</div>
        <div class="col">
        <button class="btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
      </svg>
      </button>
      </div>
        <div class="col">
        <button class="btn btn-warning">Remove</button>
        </div>
   </div>
        `
    }
})