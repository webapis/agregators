customElements.define('workflow-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {

    const resources = await import('./resources.js')
    await resources.default()

    const { workflowEditor: { workflowDescription, workflowName, workflowRepo }, auth: { idToken, localId: uid } } = window.pageStore.state

    this.uid = uid
    this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
    this.render({ workflowDescription, workflowName, workflowRepo })


  }
  render({ workflowDescription, workflowName, workflowRepo }) {
    this.innerHTML = ` 
        
        
        <top-navigation></top-navigation>

        <div class="container">
        <h3>Workflow Editor:</h3>
        <div class="row">
      <div class="col-12">
      <div class="mb-3">
        <label for="workflowNameInput" class="form-label">Workflow Name:</label>
        <input type="text" class="form-control input" id="workflowNameInput" name="workflowName" placeholder="Enter Workflow Name" value="${workflowName}"/>
      </div>
      <div class="mb-3">
      <label for="workflowRepoInput" class="form-label">Workflow repo:</label>
      <input type="text" class="form-control input" id="workflowRepoInput" name="workflowRepo" placeholder="Enter Workflow Repo Url" value="${workflowRepo}"/>
    </div>
      <div class="mb-3">
        <label for="workflowDescriptionTextarea" class="form-label">Workflow description</label>
        <textarea class="form-control input" id="workflowDescriptionTextarea" name="workflowDescription" rows="3">${workflowDescription}</textarea>
      </div>

    </div>
    <div class="col-12 mt-2">
    <button type="button" class="btn btn-secondary" id="save-workflow-btn">Save Workflow</button>
    </div>
        </div>
        </div>
        <app-footer></app-footer>`

    this.querySelectorAll('.input').forEach(element => {
      element.addEventListener('input', (e) => {

        const { value, name } = e.target

        window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED, payload: { value, input: name } })

      })
    })

    document.getElementById('save-workflow-btn').addEventListener('click', (e) => {
      const { workflowEditor: { workflowDescription, workflowName, workflowRepo, id }, auth: { screenName } } = window.pageStore.state

      if (!id) {
        this.FB_DATABASE.ref('workflows').push({ workflowDescription, workflowName, workflowRepo, visibility: 'private', owner: screenName }, (error, data) => {
          const { name } = data
          window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED, payload: { value: name, input: 'id' } })
          window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED, payload: { value: screenName, input: 'owner' } })
          window.pageStore.dispatch({ type: window.actionTypes.WORKFLOW_EDITOR_INPUT_CHANGED, payload: { value: 'private', input: 'visibility' } })
        })

      } else {
        debugger;
      }
    })
  }
})