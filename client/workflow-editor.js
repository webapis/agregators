customElements.define('workflow-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.innerHTML = `loading...`
    const resources = await import('./resources.js')
    await resources.default()

    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
    const { idToken, localId: uid, token,screenName } = JSON.parse(localStorage.getItem('auth'))
    const { taskName, id: taskId } = JSON.parse(localStorage.getItem('taskSelected'))
    const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))
    document.getElementById('task-breadcrumb').innerText = `Task(${taskName})`
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
    this.uid = uid

    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)

    //fetch users repos

    this.render({ ...workflowEditor })

  }
  render({ workflowDescription = '',selectedBranch,selectedRepo }) {

    this.innerHTML = `
  
        <div >
        <h3>Workflow Editor:</h3>
        <div class="row">
      <div class="col-12">
      <div class="mb-3">
      <list-dropdown id="repos"  label="Repositories" name="Repo"></list-dropdown>
    </div>
    <div class="mb-3">
    <list-dropdown id="branches"  label="Branches" name="Branch"></list-dropdown>
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
      window.pageStore.dispatch({ type: window.actionTypes.CLOSE_WORKFLOW_EDITOR })
      window.location.replace('/task-workflows.html')
    })


    document.getElementById('workflowDescriptionTextarea').addEventListener('input', (e) => {
      const { value } = e.target

      const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))
      localStorage.setItem('workflowEditor', JSON.stringify({ ...workflowEditor, workflowDescription: value }))

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
    const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))
   const id = this.getAttribute('id')
   const label = this.getAttribute('label')
   const name = this.getAttribute('name')
   this.innerHTML = `<label for="${id}" class="form-label">${label}:</label>
   <select id="${id}" name="${name}" class="form-control">
   <option value="default">...Loading</option>
   </select>`
   const selected =workflowEditor[`selected${name}`]
   if(selected){
     debugger;
    this.querySelector(`#${id}`).insertAdjacentHTML('beforeend', `<option  value=${selected} selected>${selected}</option>`)
   //} else{
   // await this.fetchData()
   }


   this.querySelector(`#${id}`).addEventListener('change', (e) => {

     if (e.inputType === undefined) {
       const { value, name } = e.target
   
       localStorage.setItem('workflowEditor', JSON.stringify({ ...workflowEditor, [`selected${name}`]: value }))
     }
   })

   this.querySelector(`#${id}`).addEventListener('focus', (e) => {
     debugger;
      this.fetchData()
   })
  }

 async fetchData (){
    const { token,screenName } = JSON.parse(localStorage.getItem('auth'))
    const {selectedRepo} = JSON.parse(localStorage.getItem('workflowEditor'))
    const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))
   const id = this.getAttribute('id')
   const sourceUrl = id==='repos' ?'https://api.github.com/user/repos':`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`
   const selector=this.querySelector(`#${id}`)
    selector.innerHTML='<option>Loading...</option'
   const response = await fetch(sourceUrl, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    debugger;
   const sourceData = await response.json()
   const compName = this.getAttribute('name')
   debugger;
   selector.innerHTML=''
   sourceData.forEach(data => {
    const selected =workflowEditor[`selected${compName}`]
    if (selected && selected !==data.name) {
    
      selector.insertAdjacentHTML('beforeend', `<option  value=${data.name}>${data.name}</option>`)
    } else{
      selector.insertAdjacentHTML('beforeend', `<option  value=${data.name} selected>${data.name}</option>`)
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
      const { workflowDescription, selectedRepo, selectedBranch, workflowKey } = JSON.parse(localStorage.getItem('workflowEditor'))
      const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
      const { id: taskId } = JSON.parse(localStorage.getItem('taskSelected'))

      const workflowId = workflowKey ? workflowKey : Date.now()
      const workflowInitials = { [`workspaces/${workspaceName}/workflowInitials/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, repoName: selectedRepo, selectedBranch } }
      const workflowProps = { [`workspaces/${workspaceName}/workflowProps/tasks/${taskId}/workflows/${workflowId}`]: { selectedRepo, selectedBranch, screenName } }
      const updateServer = { [`server/workspaces/${workspaceName}/tasks/${taskId}/workflows/${workflowId}`]: { workflowDescription, selectedRepo, selectedBranch, screenName } }

      window.FB_DATABASE.ref(`/`).update({ ...workflowInitials, ...workflowProps, ...updateServer }, (error, data) => {
        if (data) {
          window.location.replace('/task-workflows.html')
        }

      })
    })
  }
})






// customElements.define('owners-repos', class extends HTMLElement {
//   constructor() {
//     super()
//   }
//   async connectedCallback() {


//     this.innerHTML = `<label for="repoDataList" class="form-label">Repository:</label>
//     <select id="repos" name="repoDataList" class="form-control" autofocus>
//     <option value="default">...Select repository</option>
//     </select>`

//     this.render()


//   }
//   async render() {

//     const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))


//     if (workflowEditor && workflowEditor.selectedRepo) {
//       document.getElementById('repos').insertAdjacentHTML('afterbegin', `<option value="${workflowEditor.selectedRepo}" selected>${workflowEditor.selectedRepo}</option>`)
//     }
//     document.getElementById('repos').addEventListener('focus', async (e) => {
//       const { idToken, localId: uid, token } = JSON.parse(localStorage.getItem('auth'))
//       this.innerHTML = `<label for="repoDataList" class="form-label">Repository:</label>
//       <select id="repos" name="repoDataList" class="form-control" autofocus>
//       <option value="default">...Loading</option>
//       </select>`
//       const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })

//       const ownersRepos = await response.json()

//       document.getElementById('repos').innerHTML = ''
//       ownersRepos.forEach(repo => {
//         const { name } = repo
//         const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))

//         if (name !== workflowEditor.selectedRepo) {
//           document.getElementById('repos').insertAdjacentHTML('beforeend', `<option value="${name}">${name}</option>`)
//         }

//       })


//     })

//     document.getElementById('repos').addEventListener('change', (e) => {

//       console.log('e', e.inputType)
//       if (e.inputType === undefined) {
//         const { value } = e.target
//         const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))
//         localStorage.setItem('workflowEditor', JSON.stringify({ ...workflowEditor, selectedRepo: value }))



//       }

//     })


//   }

// })



// customElements.define('repo-branches', class extends HTMLElement {
//   constructor() {
//     super()
//   }
//   async connectedCallback() {

//     this.innerHTML = `<label for="repobranches" class="form-label">Branch:</label>
   
//     <select id="repobranches" name="branches" class="form-control">
//     <option value="main">...Select branch</option>
//     </select>`

//     this.render()
//   }

//   async render() {

//     const { token, screenName } = JSON.parse(localStorage.getItem('auth'))

//     const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))


//     const selector = document.getElementById('repobranches')

//     if (workflowEditor && workflowEditor.selectedBranch) {
//       selector.insertAdjacentHTML('beforeend', `<option  value="${workflowEditor.selectedBranch}" selected>${workflowEditor.selectedBranch}</option>`)
//     }


//     if (workflowEditor && workflowEditor.selectedRepo) {
//       const { selectedRepo, selectedBranch } = workflowEditor
//       const response = await fetch(`https://api.github.com/repos/${screenName}/${selectedRepo}/branches`, { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
//       const branches = await response.json()
   
//       branches.forEach(branch => {
//         const { name } = branch
//         if (name !== selectedBranch) {
//           selector.insertAdjacentHTML('beforeend', `<option  value=${branch.name}>${branch.name}</option>`)
//         }

//       })
//     }




//     document.getElementById('repobranches').addEventListener('change', async (e) => {
//       if (e.inputType === undefined) {
//         const { value } = e.target

//         const workflowEditor = JSON.parse(localStorage.getItem('workflowEditor'))
//         localStorage.setItem('workflowEditor', JSON.stringify({ ...workflowEditor, selectedBranch: value }))

//       }

//     })
//   }

// })
