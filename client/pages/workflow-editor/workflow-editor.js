customElements.define('workflow-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.innerHTML = `loading...`
    const resources = await import('/js/resources.js')
    await resources.default()

    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
    const { idToken, localId: uid, token,screenName } = JSON.parse(localStorage.getItem('auth'))
    const { taskName, id: taskId } = JSON.parse(localStorage.getItem('task'))
    const workflow = JSON.parse(localStorage.getItem('workflow'))
    document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
    this.uid = uid

    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)

    //fetch users repos

    this.render({ ...workflow })

  }
  render({ workflowDescription = '',selectedBranch,selectedRepo }) {

    this.innerHTML = `
  
        <div >
        <h3>Workflow Editor:</h3>
        <div class="row">
      <div class="col-12">
      <div class="mb-3">
      <list-dropdown data-id="repos" load="true"  label="Repositories" name="Repo"></list-dropdown>
    </div>
    <div class="mb-3">
    <list-dropdown load="false" data-id="branches"  label="Branches" name="Branch"></list-dropdown>
  </div>
  <div class="mb-3">
  
</div>
      <div class="mb-3">
        <label for="workflowDescriptionTextarea" class="form-label">Workflow description</label>
        <textarea class="form-control input" id="workflowDescriptionTextarea" name="workflowDescription" rows="3">${workflowDescription}</textarea>
      </div>
    </div>
    <div class="col-12 mt-2">
    <save-workflow-btn></save-workflow-btn>
    <button type="button" class="btn btn-secondary" id="close-workflow-editor-btn">Close</button>
    </div>
        </div>
        </div>
     `
    document.getElementById('close-workflow-editor-btn').addEventListener('click', () => {
   
      window.location.replace('/task-workflows.html')
    })


    document.getElementById('workflowDescriptionTextarea').addEventListener('input', (e) => {
      const { value } = e.target

      const workflow = JSON.parse(localStorage.getItem('workflow'))
      localStorage.setItem('workflow', JSON.stringify({ ...workflow, workflowDescription: value }))

    })
  }
})




customElements.define('list-dropdown', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.render()
  }

  async render(){
    const workflow = JSON.parse(localStorage.getItem('workflow'))
   const id = this.getAttribute('data-id')
   const label = this.getAttribute('label')
   const name = this.getAttribute('name')
   this.innerHTML = `<label for="${id}" class="form-label">${label}:</label>
   <select id="${id}" name="${name}" class="form-control">
   <option value="default">...Loading</option>
   </select>`
   const selected =workflow[`selected${name}`]
   const load =this.getAttribute('load')
   if(load==='true'){
     debugger;
    await this.fetchData()
   }

   


   document.getElementById(id).addEventListener('change', (e) => {
    const workflow = JSON.parse(localStorage.getItem('workflow'))
  
       const { value, name } = e.target
   debugger;
       localStorage.setItem('workflow', JSON.stringify({ ...workflow, [`selected${name}`]: value }))
     
   })

   document.getElementById(id).addEventListener('focus', (e) => {
     debugger;
     
      this.fetchData()
   })
  }

 async fetchData (){
    const { token,screenName } = JSON.parse(localStorage.getItem('auth'))
    const {selectedRepo} = JSON.parse(localStorage.getItem('workflow'))
    const workflow = JSON.parse(localStorage.getItem('workflow'))

   const id = this.getAttribute('data-id')
   const sourceUrl = id==='repos' ?'https://api.github.com/user/repos':`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`
   debugger;
   const selector= document.getElementById(id)

   const response = await fetch(sourceUrl, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    debugger;
   const sourceData = await response.json()
   const compName = this.getAttribute('name')
   debugger;
   selector.innerHTML=''
   
   sourceData.forEach(data => {
    const selected =workflow[`selected${compName}`]
    if (selected && selected !==data.name) {
    
      selector.insertAdjacentHTML('beforeend', `<option  value="${data.name}">${data.name}</option>`)
    } else{
      selector.insertAdjacentHTML('beforeend', `<option  value="${data.name}" selected>${data.name}</option>`)
      debugger;
    }
    
   })
 
  }
})



customElements.define('save-workflow-btn', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {

    const { idToken, localId: uid } = JSON.parse(localStorage.getItem('auth'))
    this.uid = uid
    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    this.render()
  }

  render() {
    this.innerHTML = ` <button type="button" class="btn btn-secondary" id="save-workflow-btn" >Save Workflow</button>`
    document.getElementById('save-workflow-btn').addEventListener('click', (e) => {
      const { screenName } = JSON.parse(localStorage.getItem('auth'))
      const { workflowDescription, selectedRepo, selectedBranch, workflowKey } = JSON.parse(localStorage.getItem('workflow'))
      const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
      const { id: taskId } = JSON.parse(localStorage.getItem('task'))

      const workflowId = workflowKey ? workflowKey : Date.now()
      const workflowInitials = { [`workspaces/${workspaceName}/workflowInitials/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, repoName: selectedRepo, selectedBranch } }
      const workflowProps = { [`workspaces/${workspaceName}/workflowProps/tasks/${taskId}/workflows/${workflowId}`]: { selectedRepo, selectedBranch, screenName } }
      const updateServer = { [`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, selectedRepo, selectedBranch, screenName } }

      window.FB_DATABASE.ref(`/`).update({ ...workflowInitials, ...workflowProps, ...updateServer }, (error, data) => {
        if (data) {
          window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
        }
      })
    })
  }
})







