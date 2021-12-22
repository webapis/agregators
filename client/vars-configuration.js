customElements.define('vars-configuration', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `Loading...`
        const resources = await import('./resources.js')
        await resources.default()
        const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault } } = window.pageStore.state
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
        const ownersRepos = await response.json()

        window.pageStore.dispatch({ type: window.actionTypes.VAR_REPOS_FETCHED, payload: ownersRepos })
        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/varsConfig/repos/`).get((error, result) => {
            if (result) {
                const vars = Object.entries(result)
             
                
                window.pageStore.dispatch({ type: window.actionTypes.VARS_FETCHED, payload: vars })
            } else {

                
                window.pageStore.dispatch({ type: window.actionTypes.VARS_FETCHED, payload: [] })
            }

        })
        window.pageStore.subscribe(window.actionTypes.VAR_ADDED, state => {
            const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault, vars, selectedRepo,editVar } } = state
            this.render({ varName, varInputType, varDefault, vars, selectedRepo,editVar })
        })
        window.pageStore.subscribe(window.actionTypes.VARS_FETCHED, state => {
            const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault, vars, selectedRepo,editVar } } = state
            this.render({ varName, varInputType, varDefault, vars, selectedRepo,editVar })
        })
        window.pageStore.subscribe(window.actionTypes.EDIT_VAR_CLICKED, state => {
            const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault, vars, selectedRepo,editVar } } = state
            this.render({ varName, varInputType, varDefault, vars, selectedRepo,editVar })
        })
        window.pageStore.subscribe(window.actionTypes.VAR_UPDATED, state => {
            const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault, vars, selectedRepo,editVar } } = state
            debugger;
            this.render({ varName, varInputType, varDefault, vars, selectedRepo,editVar })
        })
        window.pageStore.subscribe(window.actionTypes.VAR_REMOVED, state => {
            const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault, vars, selectedRepo,editVar } } = state
            debugger;
            this.render({ varName, varInputType, varDefault, vars, selectedRepo,editVar })
        })
    }

    render({ varName, varInputType, varDefault, vars,editVar }) {
        this.innerHTML = `Vars Configuration
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Workflow</th>
      <th scope="col">Var Name</th>
      <th scope="col">Input Type</th>
      <th scope="col">Default Value</th>
      <th scope="col">Add</th>
      <th scope="col">Update</th>
    </tr>
    <tr>
    <th scope="col">#</th>
    <th scope="col"><github-repos></github-repos></th>
    <th scope="col"><input class="form-control" type="text" placeholder="Enter var name" id="var-name-input" value="${varName}"/></th>
    <th scope="col">
    <select class="form-select" aria-label="Example select with button addon" id="input-type-selector">
    <option  ${varInputType === '' && 'selected'}>Choose...</option>
    <option value="text"  ${varInputType === 'text' && 'selected'}>Text</option>
    <option value="list"  ${varInputType === 'list' && 'selected'}>List</option>
  
  </select>
    </th>
    <th scope="col"><input class="form-control" type="text" placeholder="Enter Default Value" id="var-default-value" value="${varDefault}"/></th>
    <th scope="col"><button class="btn btn-outline-secondary" id="add-var-btn" ${editVar && 'disabled'}>Add</button></th>
    <th scope="col"><button class="btn btn-outline-secondary" ${!editVar && 'disabled'} id="update-var-btn">Update</button></th>
  </tr>
  </thead>
  <tbody id="var-table">
 
  
  </tbody>
</table>
        `

        document.getElementById(`update-var-btn`).addEventListener('click', (e) => {
            
               const {  workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault, selectedRepo } } = window.pageStore.state
               window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/varsConfig/repos/${selectedRepo}`).update({ [varName]: { inputType: varInputType, defaultValue: varDefault } }, (error, result) => {
                   
              
                   window.pageStore.dispatch({ type: window.actionTypes.VAR_UPDATED, payload: [`${selectedRepo}`, { ...result }] })
               })
             })
        if (vars.length > 0) {
            vars.forEach(v => {
                const repoName = v[0]
                const props = Object.entries(v[1])
                const varName = props[0][0]
                const defaultValue = props[0][1]['defaultValue']
                const inputType = props[0][1]['inputType']
                
                document.getElementById('var-table').insertAdjacentHTML('beforeend', `<tr id ="${repoName}-tr">
                <th scope="row"></th>
                <td>${repoName}</td>
                <td>${varName}</td>
                <td>${inputType}</td>
                <td>${defaultValue}</td>
                <td><button class="btn btn-outline-secondary" id="${repoName}-edit-btn">Edit</button></td>
                <td><button class="btn btn-outline-secondary" id="${repoName}-remove-btn">Remove</button></td>
              </tr>`)

                document.getElementById(`${repoName}-edit-btn`).addEventListener('click', (e) => {
                    window.pageStore.dispatch({ type: window.actionTypes.EDIT_VAR_CLICKED, payload: { selectedRepo: repoName, varDefault: defaultValue, varName, varInputType: inputType } })
                })
                document.getElementById(`${repoName}-remove-btn`).addEventListener('click', (e) => {
                    debugger;
                    const {  workspace: { workspaceSelected: { title: workspaceName } }} = window.pageStore.state
                    window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/varsConfig/repos/${repoName}`).remove( (error, result) => {
                
                      debugger;
                        window.pageStore.dispatch({ type: window.actionTypes.VAR_REMOVED, payload: repoName })
                    })
                })
            })
        } else {
            document.getElementById('var-table').innerHTML = `No vars set`
        }

        document.getElementById('var-name-input').addEventListener('input', (e) => {
            const { value } = e.target

            window.pageStore.dispatch({ type: window.actionTypes.VAR_NAME_CHANGED, payload: value })
        })

        document.getElementById('input-type-selector').addEventListener('change', (e) => {
            const { value } = e.target
            window.pageStore.dispatch({ type: window.actionTypes.VAR_TYPE_CHANGED, payload: value })
        })

        document.getElementById('var-default-value').addEventListener('input', (e) => {
            const { value } = e.target
            window.pageStore.dispatch({ type: window.actionTypes.VAR_DEFAULT_CHANGED, payload: value })
        })

        document.getElementById('add-var-btn').addEventListener('click', (e) => {
            const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault, selectedRepo } } = window.pageStore.state
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/varsConfig/repos/${selectedRepo}`).update({ [varName]: { inputType: varInputType, defaultValue: varDefault } }, (error, result) => {
                
                document.getElementById('var-table').insertAdjacentHTML('beforeend', `<tr id ="${selectedRepo}-tr">
                <th scope="row"></th>
                <td>${selectedRepo}</td>
                <td>${varName}</td>
                <td>${varInputType}</td>
                <td>${varDefault}</td>
                <td><button class="btn btn-outline-secondary">Edit</button></td>
                <td><button class="btn btn-outline-secondary">Remove</button></td>
              </tr>`)
                window.pageStore.dispatch({ type: window.actionTypes.VAR_ADDED, payload: [`${selectedRepo}`, { ...result }] })
            })
        })
    }
})



customElements.define('github-repos', class extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        const { varConfiguration: { selectedRepo, ownersRepos } } = window.pageStore.state


        this.innerHTML = `
      <select id="repos" name="repoDataList" class="form-control">
      <option value="default">...Select repository</option>
      </select>`

        this.render({ ownersRepos, selectedRepo })

        window.pageStore.subscribe(window.actionTypes.VAR_REPO_SELECTED, state => {
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
                

                window.pageStore.dispatch({ type: window.actionTypes.VAR_REPO_SELECTED, payload: value })
            }

        })


    }

})