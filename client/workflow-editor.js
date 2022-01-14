customElements.define('workflow-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.innerHTML = `loading...`
    const resources = await import('./resources.js')
    await resources.default()
   
   const {  title: workspaceName   } = JSON.parse(localStorage.getItem('workspaceSelected'))
        const { idToken, localId: uid,token } =JSON.parse(localStorage.getItem('auth'))
        const {taskName, id: taskId} = JSON.parse(localStorage.getItem('taskSelected'))
        const workflowEditor= JSON.parse(localStorage.getItem('workflowEditor'))
    document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
    this.uid = uid

    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)

    //fetch users repos




    this.render({ ...workflowEditor })

  }
  render({ workflowDescription='' }) {

    this.innerHTML = `
  
        <div >
        <h3>Workflow Editor:</h3>
        <div class="row">
      <div class="col-12">

 
      <div class="mb-3">
    
      <owners-repos></owners-repos>
    </div>
    <div class="mb-3">
    
    <repo-branches></repo-branches>
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
      window.pageStore.dispatch({ type: window.actionTypes.CLOSE_WORKFLOW_EDITOR })
      window.location.replace('/task-workflows.html')
    })


    this.querySelectorAll('.input').forEach(element => {
      element.addEventListener('input', (e) => {
        const { value, name } = e.target

        debugger;
        window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED, payload: { value, input: name } })

      })
    })


  }
})




customElements.define('owners-repos', class extends HTMLElement {
  constructor() {
    super()
  }
  async connectedCallback() {

  //  const  workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))
   

    this.innerHTML = `<label for="repoDataList" class="form-label">Repository:</label>
    <select id="repos" name="repoDataList" class="form-control">
    <option value="default">...Select repository</option>
    </select>`

    this.render()

  
  }
  async render() {

  
    const selectedRepo =localStorage.getItem('selectedRepo')
   
if(selectedRepo){
  document.getElementById('repos').insertAdjacentHTML('afterbegin',`<option value="${selectedRepo}" selected>${selectedRepo}</option>`)
}
    document.getElementById('repos').addEventListener('focus',async(e)=>{
      const { idToken, localId: uid,token } =JSON.parse(localStorage.getItem('auth'))
     
    

      const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })

      const ownersRepos = await response.json()
      document.getElementById('repos').innerHTML=''
      ownersRepos.forEach(repo=>{
        const {name}=repo
        const selectedRepo =localStorage.getItem('selectedRepo')
        if(name !==selectedRepo){
          document.getElementById('repos').insertAdjacentHTML('beforeend',`<option value="${name}">${name}</option>`)
        }
       

     
      })
   
    
    })

    document.getElementById('repos').addEventListener('change', (e) => {

      console.log('e', e.inputType)
      if (e.inputType === undefined) {
        const { value } = e.target
        localStorage.setItem('selectedRepo',value)
        window.location.reload()
       


       
      }

    })


  }

})



customElements.define('repo-branches', class extends HTMLElement {
  constructor() {
    super()
  }
  async connectedCallback() {

    this.innerHTML = `<label for="repobranches" class="form-label">Branch:</label>
   
    <select id="repobranches" name="branches" class="form-control">
    <option value="main">...Select branch</option>
    </select>`
    // const { auth: { token, screenName }, workflowEditor: { selectedRepo, selectedBranch } } = window.pageStore.state

    // if (selectedRepo.length > 0) {
    //   // const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    //   // const data = await response.json()
    //   // 
    //   // // this.render({ repoBranches: data, selectedBranch })
    //   // window.pageStore.dispatch({ type: window.actionTypes.REPOS_BRANCHES_FETCHED, payload: data })
    // }


    // window.pageStore.subscribe(window.actionTypes.REPO_SELECTED, async state => {

    //   const { auth: { token, screenName }, workflowEditor: { selectedRepo, selectedBranch } } = window.pageStore.state
    //   window.pageStore.dispatch({ type: window.actionTypes.REPOS_BRANCHES_PENDING })
    //   const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    //   const data = await response.json()

    //   //   this.render({ repoBranches: data, selectedBranch })
    //   window.pageStore.dispatch({ type: window.actionTypes.REPOS_BRANCHES_FETCHED, payload: data })


    // })
    // window.pageStore.subscribe(window.actionTypes.REPOS_BRANCHES_PENDING, state => {
    //   const { workflowEditor: { repoBranches, selectedBranch, loading } } = state
    //   this.render({ repoBranches, selectedBranch, loading })
    // })

    // window.pageStore.subscribe(window.actionTypes.REPOS_BRANCHES_FETCHED, state => {
    //   const { workflowEditor: { repoBranches, selectedBranch, loading } } = state
    //   this.render({ repoBranches, selectedBranch, loading })
    // })

    // window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED, () => {

    //   const { workflowEditor: { repoBranches, selectedBranch, loading } } = window.pageStore.state

    // })

    this.render()
  }

  async render() {
   // const { auth: { token, screenName }, workflowEditor: { repoBranches, selectedBranch, loading, selectedRepo } } = window.pageStore.state
    const {token,screenName}= JSON.parse(localStorage.getItem('auth'))
  
    const selectedRepo =localStorage.getItem('selectedRepo')
    const selector = document.getElementById('repobranches')
    const selectedBranch =localStorage.getItem('selectedBranch')
    if(selectedBranch){
      selector.insertAdjacentHTML('beforeend', `<option  value="${selectedBranch}" selected>${selectedBranch}</option>`)
    }
 

    if (selectedRepo) {
      const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
      const branches = await response.json()

      branches.forEach(branch=>{
        const {name}= branch
        if(name !==selectedBranch){
          selector.insertAdjacentHTML('beforeend', `<option  value=${branch.name}>${branch.name}</option>`)
        }
       
      })

debugger;
      //   this.render({ repoBranches: data, selectedBranch })
    //  window.pageStore.dispatch({ type: window.actionTypes.REPOS_BRANCHES_FETCHED, payload: data })
    }


    // if (repoBranches.length > 0 ) {

    //  repoBranches.forEach(branch => {


    //     selector.insertAdjacentHTML('beforeend', `<option  value=${branch.name}>${branch.name}</option>`)

    //   })

    // }

    // else if (selectedBranch) {

    //   selector.innerHTML = `<option  value=${selectedBranch} selected>${selectedBranch}</option>`

    // }

    document.getElementById('repobranches').addEventListener('change', async (e) => {

   

      if (e.inputType === undefined) {
        const { value } = e.target
        localStorage.setItem('selectedBranch',value)
      //  window.pageStore.dispatch({ type: window.actionTypes.BRANCH_SELECTED, payload: { branch: value } })
      }

    })
  }

})






customElements.define('save-workflow-btn', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {

    const workflowEditor  = JSON.parse(localStorage.getItem('workflowEditor'))
    const {idToken, localId: uid} = JSON.parse(localStorage.getItem('auth'))

    this.uid = uid

    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    this.render({...workflowEditor})
    // window.pageStore.subscribe(window.actionTypes.USER_REPOS_FETCHED, state => {
    //   const { workflowEditor } = state
    //   this.render(workflowEditor)
    // })
    // window.pageStore.subscribe(window.actionTypes.REPO_SELECTED, state => {
    //   const { workflowEditor } = state
    //   this.render(workflowEditor)
    // })
    // window.pageStore.subscribe(window.actionTypes.WORKFLOW_CONFIG_FETCHED, state => {
    //   const { workflowEditor } = state
    //   this.render(workflowEditor)
    // })
    // window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED, state => {
    //   const { workflowEditor } = state
    //   this.render(workflowEditor)
    // })

    // window.pageStore.subscribe(window.actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED, state => {
    //   const { workflowEditor } = state
    //   this.render(workflowEditor)
    // })
  }

  render({ workflowDescription='', selectedRepo='', selectedBranch='', workflowKey='' }) {
    this.innerHTML = ` <button type="button" class="btn btn-secondary" id="save-workflow-btn" ${workflowDescription && selectedRepo && selectedBranch ? '' : 'disabled'}>Save Workflow</button>`
    document.getElementById('save-workflow-btn').addEventListener('click', (e) => {
      const { workflowEditor: { workflowDescription, selectedRepo, selectedBranch }, auth: { screenName }, workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { taskSelected: { taskName, id: taskId } } } = window.pageStore.state

      const workflowId = workflowKey ? workflowKey : Date.now()
      const workflowInitials = { [`workspaces/${workspaceName}/workflowInitials/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, repoName: selectedRepo, selectedBranch } }
      const workflowProps = { [`workspaces/${workspaceName}/workflowProps/tasks/${taskId}/workflows/${workflowId}`]: { selectedRepo, selectedBranch, screenName } }

      const updateServer = { [`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, selectedRepo, selectedBranch, screenName } }

      window.FB_DATABASE.ref(`/`).update({ ...workflowInitials, ...workflowProps, ...updateServer }, (error, data) => {
        if (data) {

          window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_UPDATED })

          window.location.replace('/task-workflows.html')
        }

      })
    })

  }

})