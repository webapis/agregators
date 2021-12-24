customElements.define('workflow-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.innerHTML = `loading...`
    const resources = await import('./resources.js')
    await resources.default()
    const { workflowEditor: { workflowDescription }, auth: { idToken, localId: uid, token }, workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { taskSelected: { taskName } } } = window.pageStore.state

    document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
    this.uid = uid

    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)

    //fetch users repos
    const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    const ownersRepos = await response.json()

    window.pageStore.dispatch({ type: window.actionTypes.USER_REPOS_FETCHED, payload: ownersRepos })

    this.render({ workflowDescription })

  }
  render({ workflowDescription }) {

    this.innerHTML = `
  
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


  }
})




customElements.define('owners-repos', class extends HTMLElement {
  constructor() {
    super()
  }
  async connectedCallback() {
    const { workflowEditor: { selectedRepo, ownersRepos } } = window.pageStore.state


    this.innerHTML = `<label for="repoDataList" class="form-label">Repos</label>
    <select id="repos" name="repoDataList" class="form-control">
    <option value="default">...Select repository</option>
    </select>`

    this.render({ ownersRepos, selectedRepo })

    window.pageStore.subscribe(window.actionTypes.REPO_SELECTED, state => {
      const { workflowEditor: { selectedRepo, ownersRepos } } = state
      this.render({ ownersRepos, selectedRepo })

    })
  }
  async render({ ownersRepos, selectedRepo }) {

    const selector = document.getElementById('repos')

    ownersRepos && ownersRepos.forEach(repo => {

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

      const { auth: { token, screenName }, workflowEditor: { selectedRepo, selectedBranch } } = window.pageStore.state
      window.pageStore.dispatch({ type: window.actionTypes.REPOS_BRANCHES_PENDING })
      const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
      const data = await response.json()

      this.render({ repoBranches: data, selectedBranch })
      window.pageStore.dispatch({ type: window.actionTypes.REPOS_BRANCHES_FETCHED, payload: data })


    })
    window.pageStore.subscribe(window.actionTypes.REPOS_BRANCHES_PENDING, state => {
      const { workflowEditor: { repoBranches, selectedBranch, loading } } = state
      this.render({ repoBranches, selectedBranch, loading })
    })

    const { workflowEditor: { repoBranches, selectedBranch } } = window.pageStore.state

    this.render({ repoBranches, selectedBranch })

    window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED, () => {

      const { workflowEditor: { repoBranches, selectedBranch, loading } } = window.pageStore.state

      this.render({ repoBranches, selectedBranch, loading })
    })
  }

  render({ repoBranches, selectedBranch, loading }) {
    if (loading) {
      const selector = document.getElementById('repobranches')

      selector.innerHTML = `<option value="main">loading...</option>`


    } else {
      const selector = document.getElementById('repobranches')
      selector.innerHTML = `<option value="main">...Select branch</option>`
      repoBranches && repoBranches.forEach(branch => {
        debugger;

        selector.insertAdjacentHTML('beforeend', `<option ${selectedBranch === branch.name && 'selected'} value=${branch.name}>${branch.name}</option>`)

      })
    }





    document.getElementById('repobranches').addEventListener('change', async (e) => {

      const { auth: { token, screenName }, workflowEditor: { selectedRepo } } = window.pageStore.state
      console.log('inputType', e.inputType)



      if (e.inputType === undefined) {
        const { value } = e.target

        window.pageStore.dispatch({ type: window.actionTypes.BRANCH_SELECTED, payload: { branch: value } })
      }

    })
  }

})


customElements.define('workflow-name', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const { workflowEditor: { workflowName } } = window.pageStore.state
    this.render({ workflowName })

    window.pageStore.subscribe(window.actionTypes.REPO_SELECTED, state => {
      const { workflowEditor: { workflowName } } = state
      this.render({ workflowName })
    })

    window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED, state => {

      const { workflowEditor: { workflowName } } = state
      this.render({ workflowName })
    })


  }

  render({ workflowName }) {
    this.innerHTML = `   <div class="mb-3">
    <label for="workflowNameInput" class="form-label">Workflow Name:</label>
    <input type="text" readonly class="form-control" id="workflowNameInput" name="workflowName"  value="${workflowName}"/>
  </div>`
  }
})




customElements.define('save-workflow-btn', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {

    const { workflowEditor, auth: { idToken, localId: uid }, } = window.pageStore.state
    this.uid = uid

    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    this.render(workflowEditor)
    window.pageStore.subscribe(window.actionTypes.USER_REPOS_FETCHED, state => {
      const { workflowEditor } = state
      this.render(workflowEditor)
    })
    window.pageStore.subscribe(window.actionTypes.REPO_SELECTED, state => {
      const { workflowEditor } = state
      this.render(workflowEditor)
    })
    window.pageStore.subscribe(window.actionTypes.WORKFLOW_CONFIG_FETCHED, state => {
      const { workflowEditor } = state
      this.render(workflowEditor)
    })
    window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED, state => {
      const { workflowEditor } = state
      this.render(workflowEditor)
    })

    window.pageStore.subscribe(window.actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED, state => {
      const { workflowEditor } = state
      this.render(workflowEditor)
    })
  }

  render({ workflowName, workflowDescription, selectedRepo, selectedBranch, workflowKey }) {
    this.innerHTML = ` <button type="button" class="btn btn-secondary" id="save-workflow-btn" ${workflowName && workflowDescription && selectedRepo && selectedBranch ? '' : 'disabled'}>Save Workflow</button>`
    document.getElementById('save-workflow-btn').addEventListener('click', (e) => {
      const { workflowEditor: { workflowDescription, selectedRepo, isPrivate, selectedBranch, workflowName, tokenFPR }, auth: { screenName }, workspace: { workspaceSelected: { title: workspaceName } }, workspaceTasks: { taskSelected: { taskName, id: taskId } } } = window.pageStore.state

      const workflowId = workflowKey ? workflowKey : Date.now()
      const workflowInitials = { [`workspaces/${workspaceName}/workflowInitials/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, workflowName, repoName: selectedRepo } }
      const workflowProps = { [`workspaces/${workspaceName}/workflowProps/tasks/${taskId}/workflows/${workflowId}`]: { selectedRepo, isPrivate, selectedBranch, tokenFPR, screenName } }

      const updateServer = { [`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, selectedRepo, isPrivate, selectedBranch, tokenFPR, screenName, workflowName } }

      window.FB_DATABASE.ref(`/`).update({ ...workflowInitials, ...workflowProps, ...updateServer }, (error, data) => {
        if (data) {

          window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_UPDATED })

          window.location.replace('/task-workflows.html')
        }

      })
    })

  }

})