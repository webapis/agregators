customElements.define('workflow-list', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        const resources = await import('./resources.js')
        await resources.default()
        window.pageStore.dispatch({type:window.actionTypes.WORKFLOW_UPDATED})
        const { workflows, auth: { idToken, localId: uid, screenName } } = window.pageStore.state

        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.FB_DATABASE.ref(`workflows/${uid}`).on('value', (error, snap) => {
            const data = Object.entries(snap.data)
            debugger;
            window.pageStore.dispatch({ type: window.actionTypes.WORKFLOWS_FETCHED, payload: data })




        })
        this.render({ workflows })

        window.pageStore.subscribe(window.actionTypes.WORKFLOWS_FETCHED, state => {
            const { workflowList: { workflows } } = state
            this.render({ workflows })
        })
    }

    render({ workflows }) {

        this.innerHTML = `
        <top-navigation></top-navigation>
        <div class="container">
        <h3>Workflows:</h3>
        <div class="row" id ="workflows-container">
  
      
        </div>
        </div>
        <app-footer></app-footer>`

        workflows && workflows.forEach(wf => {
            const workflowName = wf[0]

            const screenName = wf[1]['screenName']
            const branchName = wf[1]['selectedBranch']
            const repoName = wf[1]['selectedRepo']
            const isPrivate = wf[1]['isPrivate']
            const workflowDescription = wf[1]['workflowDescription']
            const tokenFPR=wf[1]['tokenFPR']


            document.getElementById('workflows-container').insertAdjacentHTML('beforeend', `   <workflow-card class="col-3" workflow-name="${workflowName}" screen-name="${screenName}" branch-name="${branchName}" repo-name="${repoName}" is-private="${isPrivate}" workflow-description="${workflowDescription}" token-fpr=${tokenFPR}></workflow-card>`)
        })
        // document.getElementById('workflows-container')

    }
})


customElements.define('workflow-card', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const workflowName = this.getAttribute('workflow-name')
        const screenName = this.getAttribute('screen-name')
        const branchName = this.getAttribute('branch-name')
        const repoName = this.getAttribute('repo-name')
        const isPrivate = this.getAttribute('is-private')
        const workflowDescription = this.getAttribute('workflow-description')
        const tokenFPR =this.getAttribute('token-fpr')
        
        this.innerHTML = `
       
        
          <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Workflow Name</div>
           ${workflowName}
          </div>
      
        </li>
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">Git Repository</div>
     ${repoName}
    </div>

  </li>
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">Branch</div>
    ${branchName}
    </div>
  
  </li>
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">Private</div>
     ${isPrivate}
    </div>
  </li>
  <li class="list-group-item d-flex justify-content-between align-items-start">
  <div class="ms-2 me-auto">
    <div class="fw-bold">Owner</div>
   ${screenName}
  </div>
</li>
<li class="list-group-item d-flex justify-content-between align-items-start">
<div class="ms-2 me-auto">
  <div class="fw-bold">Description</div>
 ${workflowDescription}
</div>
</li>
<li class="list-group-item d-flex justify-content-between align-items-start">
<button class="btn btn-warning" id="edit-workflow-btn-${workflowName}">Edit</button>

</li>
</ul>    
    `
        document.getElementById(`edit-workflow-btn-${workflowName}`).addEventListener('click', (e) => {
          
            debugger;
            window.pageStore.dispatch({type:window.actionTypes.EDIT_WORKFLOW, payload:{workflowName,isPrivate,screenName,selectedBranch:branchName,selectedRepo:repoName,workflowDescription,tokenFPR}})
            window.location.replace('/workflow-editor.html')
            
        })
    }
})