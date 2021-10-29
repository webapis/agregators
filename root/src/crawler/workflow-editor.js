customElements.define('workflow-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {

    const resources = await import('./resources.js')
    await resources.default()
    const { workflowEditor: { workflowDescription, workflowName, tokenFPR, isPrivate, workflowOrder,workflowConfig }, auth: { idToken, localId: uid }, workspace: { workspaceSelected }, wfContainer: { selectedContainer }, workspaceTasks: { taskSelected } } = window.pageStore.state

    document.getElementById('task-breadcrumb').innerText = `Task(${taskSelected})`
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceSelected})`
    this.uid = uid
    debugger;
    this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
    this.render({ workflowDescription, workflowName, token: tokenFPR, isPrivate, workflowOrder,workflowConfig })

    window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED, state => {
      const { workflowEditor: { workflowDescription, workflowName, tokenFPR, isPrivate, workflowConfig } } = state
      this.render({ workflowDescription, workflowName, token: tokenFPR, isPrivate, workflowOrder, workflowConfig })
    })
    window.pageStore.subscribe(window.actionTypes.REPO_SELECTED, state => {
      const { workflowEditor: { workflowDescription, workflowName, tokenFPR, isPrivate, workflowOrder, workflowConfig } } = state
      this.render({ workflowDescription, workflowName, token: tokenFPR, isPrivate, workflowOrder, workflowConfig })
    })
  }
  render({ workflowDescription, workflowName, token, isPrivate, workflowOrder, workflowConfig }) {
debugger;
    this.innerHTML = `
        <div >
        <h3>Workflow Editor:</h3>
        <div class="row">
      <div class="col-12">
      <div class="mb-3">
        <label for="workflowNameInput" class="form-label">Workflow Name:</label>
        <input type="text" readonly class="form-control" id="workflowNameInput" name="workflowName"  value="${workflowName}"/>
      </div>
      <div class="mb-3">
      <label for="workflowNameInput" class="form-label">Workflow Order:</label>
      <input type="number" class="form-control input" id="workflowOrderInput" name="workflowOrder"  value="${workflowOrder}"/>
    </div>
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
      <div class="mb-3">
        <label for="workflowConfigFile" class="form-label">Workflow Config</label>
        <textarea class="form-control input" id="workflowConfig" name="workflowConfig" rows="3" readonly>${JSON.stringify(workflowConfig)}</textarea>
      </div>
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
      const { workflowEditor: { workflowDescription, selectedRepo, isPrivate, selectedBranch, workflowName, tokenFPR, workflowOrder,workflowConfig }, auth: { screenName }, workspace: { workspaceSelected }, workspaceTasks: { taskSelected } } = window.pageStore.state


      const update = { workflowDescription, selectedRepo, isPrivate, selectedBranch, tokenFPR, screenName, workflowOrder, workflowName,workflowConfig }
      debugger;
      this.FB_DATABASE.ref(`workspaces/${workspaceSelected}/tasks/${taskSelected}/workflows/${Date.now()}`).update(update, (error, data) => {
        window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_UPDATED })
        debugger;
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
    const { workflowEditor: { selectedRepo } } = window.pageStore.state
    this.render({ selectedRepo })

    window.pageStore.subscribe(window.actionTypes.REPO_SELECTED, state => {
      const { workflowEditor: { selectedRepo } } = state

      this.render({ selectedRepo })
    })

  }
  render({ selectedRepo }) {
    this.innerHTML = `<label for="repoDataList" class="form-label">Repos</label>
    <input class="form-control" list="repoDatalistOptions" id="repoDataList" placeholder="Type to search..." value="${selectedRepo}">
    <datalist id="repoDatalistOptions">
    
    </datalist>`
    window.pageStore.subscribe(window.actionTypes.USER_REPOS_FETCHED, state => {
      const { workflowEditor: { ownersRepos } } = state
      const datalist = document.getElementById('repoDatalistOptions')
      datalist.innerHTML = ''
      ownersRepos.forEach(repo => {
        const element = document.createElement('option')
        element.value = repo.name
        datalist.appendChild(element)
      })
    })

    document.getElementById('repoDataList').addEventListener('input', (e) => {

      console.log('e', e.inputType)
      if (e.inputType === undefined) {
        const { value } = e.target
        const { workflowEditor: { ownersRepos } } = window.pageStore.state
        const selectedRepository = ownersRepos.find(o => o.name === value)
        // const { private } = selectedRepo

        window.pageStore.dispatch({ type: window.actionTypes.REPO_SELECTED, payload: { selectedRepo: value, isPrivate: selectedRepository.private } })
      }

    })

    document.getElementById('repoDataList').addEventListener('focus', (e) => {

      const { auth: { token } } = window.pageStore.state
      this.getRepos({ token })

    })
  }
  async getRepos({ token }) {
    const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    const data = await response.json()
    window.pageStore.dispatch({ type: window.actionTypes.USER_REPOS_FETCHED, payload: data })
  }
})



customElements.define('repo-branches', class extends HTMLElement {
  constructor() {
    super()
  }
  async connectedCallback() {
    const { workflowEditor: { selectedBranch } } = window.pageStore.state

    this.render({ selectedBranch })

    window.pageStore.subscribe(window.actionTypes.BRANCH_SELECTED, state => {
      const { workflowEditor: { selectedBranch } } = state
      this.render({ selectedBranch })
    })

  }
  render({ selectedBranch }) {
    this.innerHTML = `<label for="branchDataList" class="form-label">Branches</label>
    <input class="form-control" list="branchDatalistOptions" id="branchDataList" placeholder="Type to search..." value=${selectedBranch}>
    <datalist id="branchDatalistOptions">
    
    </datalist>`
    window.pageStore.subscribe(window.actionTypes.REPOS_BRANCHES_FETCHED, state => {
      const { workflowEditor: { repoBranches } } = state
      const datalist = document.getElementById('branchDatalistOptions')
      datalist.innerHTML = ''
      repoBranches.forEach(repo => {
        const element = document.createElement('option')
        element.value = repo.name
        datalist.appendChild(element)
      })
    })

    document.getElementById('branchDataList').addEventListener('focus', () => {
      const { auth: { token, screenName }, workflowEditor: { selectedRepo } } = window.pageStore.state
      this.getBranches({ token, screenName, selectedRepo })
    })

    document.getElementById('branchDataList').addEventListener('input', async (e) => {
      const { auth: { token, screenName }, workflowEditor: { selectedRepo } } = window.pageStore.state
      console.log('e', e.inputType)
      const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/contents/workflow.config.json?ref=main`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
      const data = await response.json()
      const { content } = data
      debugger;
      const workflowConfig = JSON.parse(atob(content))

      debugger;
      if (e.inputType === undefined) {
        const { value } = e.target

        window.pageStore.dispatch({ type: window.actionTypes.BRANCH_SELECTED, payload: {branch:value,workflowConfig} })
      }

    })
  }
  async getBranches({ token, screenName, selectedRepo }) {

    const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    const data = await response.json()

    window.pageStore.dispatch({ type: window.actionTypes.REPOS_BRANCHES_FETCHED, payload: data })


  }
})