customElements.define('workflow-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.innerHTML = `loading...`
    const resources = await import('/js/resources.js')
    await resources.default()

    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
    const { idToken, localId: uid, token, screenName } = JSON.parse(localStorage.getItem('auth'))
    const { taskName, id: taskId } = JSON.parse(localStorage.getItem('task'))

    document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`



    const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    const repos = await response.json()
    this.repos = repos
    const workflow = JSON.parse(localStorage.getItem('workflow'))







    //fetch users repos

    this.render({ ...workflow })

  }
  render({ workflowDescription = '', selectedBranch, selectedRepo }) {

    this.innerHTML = `
  
        <div >
        <h3>Workflow Editor:</h3>
        <div class="row">
      <div class="col-12">
      <div class="mb-3">
     <select class="form-control" id="repos">
     <option value="">Select Repo</option>
     </select>
    </div>
    <div class="mb-3">
    <select class="form-control" id="branches">
    <option value="">Select Branch</option>
    </select>
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
    //Repo
    if (selectedRepo !== '') {
      document.getElementById('repos').insertAdjacentHTML('afterbegin', `<option value="${selectedRepo}" selected>${selectedRepo}</option>`)
    }
    document.getElementById('repos').addEventListener('focus', (e) => {
      document.getElementById('repos').innerHTML = ''
      document.getElementById('repos').insertAdjacentHTML('afterbegin', `<option value="" selected>Select Repo</option>`)
      if (selectedRepo !== '') {
        document.getElementById('repos').insertAdjacentHTML('afterbegin', `<option value="${selectedRepo}" selected>${selectedRepo}</option>`)
      }
      this.repos && this.repos.forEach(repo => {
        const { name } = repo
        if (name !== selectedRepo)
          document.getElementById('repos').insertAdjacentHTML('beforeend', `<option value="${name}">${name}</option>`)
      })

    })
    document.getElementById('repos').addEventListener('change', async (e) => {
      const { token, screenName } = JSON.parse(localStorage.getItem('auth'))
      const workflow = JSON.parse(localStorage.getItem('workflow'))
      const { value } = e.target
      localStorage.setItem('workflow', JSON.stringify({ ...workflow, selectedRepo: value }))

      const response = await fetch(`https://api.github.com/repos/${screenName}/${value}/branches`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })

      const branches = await response.json()
      localStorage.setItem("branches", JSON.stringify(branches))

    })
    //Branch

    if (selectedBranch !== '') {
      document.getElementById('branches').insertAdjacentHTML('afterbegin', `<option value="${selectedBranch}" selected>${selectedBranch}</option>`)
    }

    document.getElementById('branches').addEventListener('focus', (e) => {
      document.getElementById('branches').innerHTML = ''
      document.getElementById('branches').insertAdjacentHTML('afterbegin', `<option value="" selected>Select Branch</option>`)
      if (selectedBranch !== '') {
        document.getElementById('branches').insertAdjacentHTML('afterbegin', `<option value="${selectedBranch}" selected>${selectedBranch}</option>`)
      }
      const branches = JSON.parse(localStorage.getItem('branches'))
      branches && branches.forEach(branch => {
        const { name } = branch
        if (name !== selectedBranch)
          document.getElementById('branches').insertAdjacentHTML('beforeend', `<option value="${name}">${name}</option>`)
      })
    })

    document.getElementById('branches').addEventListener('change', async (e) => {

      const workflow = JSON.parse(localStorage.getItem('workflow'))
      const { value } = e.target
      localStorage.setItem('workflow', JSON.stringify({ ...workflow, selectedBranch: value }))



    })

    document.getElementById('workflowDescriptionTextarea').addEventListener('input', (e) => {
      const { value } = e.target

      const workflow = JSON.parse(localStorage.getItem('workflow'))
      localStorage.setItem('workflow', JSON.stringify({ ...workflow, workflowDescription: value }))

    })
  }
})







customElements.define('save-workflow-btn', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {

    const { idToken, localId: uid } = JSON.parse(localStorage.getItem('auth'))

    this.render()
  }

  render() {
    this.innerHTML = ` <button type="button" class="btn btn-secondary" id="save-workflow-btn" >Save Workflow</button>`
    document.getElementById('save-workflow-btn').addEventListener('click', async (e) => {
      const { screenName } = JSON.parse(localStorage.getItem('auth'))
      const { workflowDescription, selectedRepo, selectedBranch, workflowKey } = JSON.parse(localStorage.getItem('workflow'))
      const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
      const { id: taskId } = JSON.parse(localStorage.getItem('task'))

      const workflowId = workflowKey ? workflowKey : Date.now()

      const update = { [`workflows/workspaces/${workspaceName}/tasks/${taskId}/${workflowId}`]: { workflowDescription, repoName: selectedRepo, selectedBranch, screenName } }

      const data = await window.firebase().ref(`/`).update(update)
      window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
    })
  }
})







