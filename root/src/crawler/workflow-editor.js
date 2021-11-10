customElements.define('workflow-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {

    const resources = await import('./resources.js')
    await resources.default()
    const { workflowEditor: { workflowDescription, workflowName, tokenFPR, isPrivate, workflowOrder, workflowConfig }, auth: { idToken, localId: uid,token }, workspace: { workspaceSelected: { title: workspaceName } }, wfContainer: { selectedContainer }, workspaceTasks: { taskSelected: { taskName } } } = window.pageStore.state

    document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
    this.uid = uid

    this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)


   

    this.render({ workflowDescription, workflowName, token: tokenFPR, isPrivate, workflowOrder, workflowConfig })

  
  }
  render({ workflowDescription, token, isPrivate, workflowOrder, workflowConfig }) {

    this.innerHTML = `
    <signed-in-as></signed-in-as>
        <div >
        <h3>Workflow Editor:</h3>
        <div class="row">
      <div class="col-12">
   <workflow-name></workflow-name>
 
      <div class="mb-3">
    
      <owners-repos></owners-repos>
    </div>
    <div class="mb-3">
    
    <repo-branches></repo-branches>
  </div>
  ${isPrivate ? `  <div class="mb-3">
  <label for="tokenFPR" class="form-label">Token For private repo</label>
  <input class="form-control input" id="tokenFPR" name="tokenFPR" value="${token}">
</div>`: ""}
      <div class="mb-3">
        <label for="workflowDescriptionTextarea" class="form-label">Workflow description</label>
        <textarea class="form-control input" id="workflowDescriptionTextarea" name="workflowDescription" rows="3">${workflowDescription}</textarea>
      </div>
 <workflow-config></workflow-config>
    </div>
    <div class="col-12 mt-2">
    <button type="button" class="btn btn-secondary" id="save-workflow-btn">Save Workflow</button>
    </div>
        </div>
        </div>
     `

    document.getElementById('tokenFPR') && document.getElementById('tokenFPR').addEventListener('input', (e) => {

      const { value } = e.target

      window.pageStore.dispatch({ type: window.actionTypes.TOKEN_FPR_CHANGED, payload: value })
    })

    this.querySelectorAll('.input').forEach(element => {
      element.addEventListener('input', (e) => {
        const { value, name } = e.target
        window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED, payload: { value, input: name } })

      })
    })

    document.getElementById('save-workflow-btn').addEventListener('click', (e) => {
      const { workflowEditor: { workflowDescription, selectedRepo, isPrivate, selectedBranch, workflowName, tokenFPR, workflowOrder, workflowConfig }, auth: { screenName }, workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { taskSelected: { taskName, id: taskId } } } = window.pageStore.state
      // { workflowDescription, selectedRepo, isPrivate, selectedBranch, tokenFPR, screenName, workflowOrder, workflowName,workflowConfig }
      const workflowId = Date.now()
      const workflowInitials = { [`workspaces/${workspaceName}/workflowInitials/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, workflowName } }
      const workflowProps = { [`workspaces/${workspaceName}/workflowProps/tasks/${taskId}/workflows/${workflowId}`]: { selectedRepo, isPrivate, selectedBranch, tokenFPR, screenName, workflowOrder } }
      const upadteworkflowConfigs = { [`workspaces/${workspaceName}/workflowConfigs/tasks/${taskId}/workflows/${workflowId}`]: { ...workflowConfig } }
      const updateServer = { [`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, selectedRepo, isPrivate, selectedBranch, tokenFPR, screenName, workflowOrder, workflowName, workflowConfig } }

      this.FB_DATABASE.ref(`/`).update({ ...workflowInitials, ...workflowProps, ...upadteworkflowConfigs, ...updateServer }, (error, data) => {
        window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_UPDATED })

        window.location.replace('/task-workflows.html')
      })
    })
  }
})



customElements.define('owners-repos', class extends HTMLElement {
  constructor() {
    super()
  }
  async connectedCallback() {
    const { auth: { token }, workflowEditor: { selectedRepo } } = window.pageStore.state
    const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    const ownersRepos = await response.json()
    debugger;
    window.pageStore.dispatch({ type: window.actionTypes.USER_REPOS_FETCHED, payload: ownersRepos })

    this.innerHTML = `<label for="repoDataList" class="form-label">Repos</label>
    <select id="repos" name="repoDataList" class="form-control">
    <option value="default">...Select repository</option>
    </select>`

    this.render({ownersRepos,selectedRepo})

    window.pageStore.subscribe( window.actionTypes.REPO_SELECTED,state=>{
      const {  workflowEditor: { selectedRepo,ownersRepos } } = state
      this.render({ownersRepos,selectedRepo})

    })
  }
  async render({ownersRepos,selectedRepo}) {

    const selector = document.getElementById('repos')

    ownersRepos&&  ownersRepos.forEach(repo => {

      selector.insertAdjacentHTML('beforeend', `<option ${selectedRepo === repo.name && 'selected'} value=${repo.name}>${repo.name}</option>`)
    })


    document.getElementById('repos').addEventListener('change', (e) => {

      console.log('e', e.inputType)
      if (e.inputType === undefined) {
        const { value } = e.target
        const { workflowEditor: { ownersRepos } } = window.pageStore.state
        const selectedRepository = ownersRepos.find(o => o.name === value)


        window.pageStore.dispatch({ type: window.actionTypes.REPO_SELECTED, payload: { selectedRepo: value, isPrivate: selectedRepository.private } })
      }

    })


  }

})



customElements.define('repo-branches', class extends HTMLElement {
  constructor() {
    super()
  }
  async connectedCallback() {

    this.innerHTML = `<label for="repobranches" class="form-label">Branches</label>
   
    <select id="repobranches" name="branches" class="form-control">
    <option value="main">...Select branch</option>
    </select>`
    window.pageStore.subscribe(window.actionTypes.REPO_SELECTED, async state => {

      const { auth: { token, screenName }, workflowEditor: { selectedRepo,selectedBranch } } =window.pageStore.state
      
      const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
      const data = await response.json()
     debugger;
      this.render({ repoBranches:data,selectedBranch })
      window.pageStore.dispatch({ type: window.actionTypes.REPOS_BRANCHES_FETCHED, payload: data })


    })
   
      const { workflowEditor: { repoBranches,selectedBranch } } =window.pageStore. state

      this.render({ repoBranches,selectedBranch })

      window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED,()=>{

        const { workflowEditor: { repoBranches,selectedBranch } } =window.pageStore. state

        this.render({ repoBranches,selectedBranch })
      })
  } 

  render({ repoBranches,selectedBranch }) {

    const selector = document.getElementById('repobranches')    
    repoBranches&&   repoBranches.forEach(branch => {
      selector.innerHTML=`<option value="main">...Select branch</option>`
      selector.insertAdjacentHTML('beforeend', `<option ${selectedBranch === branch.name && 'selected'} value=${branch.name}>${branch.name}</option>`)
    })


  

    document.getElementById('repobranches').addEventListener('change', async (e) => {
      
      const { auth: { token, screenName }, workflowEditor: { selectedRepo } } = window.pageStore.state
      console.log('inputType', e.inputType)
 
      

      if (e.inputType === undefined) {
        const { value } = e.target
debugger;
        window.pageStore.dispatch({ type: window.actionTypes.BRANCH_SELECTED, payload: { branch: value } })
      }

    })
  }

})


customElements.define('workflow-name',class extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    const {workflowEditor:{workflowName}}=window.pageStore.state
    this.render({workflowName})

window.pageStore.subscribe(window.actionTypes.REPO_SELECTED,state=>{
  const {workflowEditor:{workflowName}}=state
  this.render({workflowName})
})

window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED,state=>{
  debugger;
  const {workflowEditor:{workflowName}}=state
  this.render({workflowName})
})
   

  }

  render({workflowName}){
    this.innerHTML=`   <div class="mb-3">
    <label for="workflowNameInput" class="form-label">Workflow Name:</label>
    <input type="text" readonly class="form-control" id="workflowNameInput" name="workflowName"  value="${workflowName}"/>
  </div>`
  }
})


customElements.define('workflow-config',class extends HTMLElement{
  constructor(){
    super()
  }

  connectedCallback(){
    const {workflowEditor:{workflowConfig}}=window.pageStore.state
    this.render({workflowConfig})

window.pageStore.subscribe(window.actionTypes.REPO_SELECTED,async ()=>{
  debugger;
  
  await this.getWebConfigs()
})

window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED,async ()=>{
  debugger;
await this.getWebConfigs()

})
window.pageStore.subscribe(window.actionTypes.WORKFLOW_CONFIG_FETCHED,state=>{
  debugger;
  const {workflowEditor:{workflowConfig}}=state
  
  this.render({workflowConfig})
})

  }

  render({workflowConfig}){
    this.innerHTML=   `  <div class="mb-3">
    <label for="workflowConfigFile" class="form-label">Workflow Config</label>
    <textarea class="form-control input" id="workflowConfig" name="workflowConfig" rows="3" readonly>${JSON.stringify(workflowConfig)}</textarea>
  </div>` 
  }

  async getWebConfigs(){
    const { auth: { token, screenName }, workflowEditor: { selectedRepo,selectedBranch } } = window.pageStore.state
    debugger;
    if( selectedRepo && selectedBranch ){

      const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/contents/workflow.config.json?ref=${selectedBranch}`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
      const data = await response.json()
      const { content } = data
      console.log('content',content)
      debugger;
      if(content){
        const workflowConfig = JSON.parse(atob(content))
        window.pageStore.dispatch({type:window.actionTypes.WORKFLOW_CONFIG_FETCHED,payload:workflowConfig})
      }
    
    }
   



   
  }
})