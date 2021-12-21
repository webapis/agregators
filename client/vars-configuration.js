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
            const vars =Object.entries(result)
            debugger;
          window.pageStore.dispatch({type:window.actionTypes.VARS_FETCHED,payload:vars})
        })
        window.pageStore.subscribe(window.actionTypes.VAR_ADDED,state=>{
            const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault,vars,selectedRepo } } = state
            this.render({ varName, varInputType, varDefault,vars,selectedRepo })
        })
        window.pageStore.subscribe(window.actionTypes.VARS_FETCHED,state=>{
            const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varName, varInputType, varDefault,vars,selectedRepo } } = state
            this.render({ varName, varInputType, varDefault,vars,selectedRepo })
        })
       
    }

    render({ varName, varInputType, varDefault,vars }) {
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
    <th scope="col"><button class="btn btn-outline-secondary" id="add-var-btn">Add</button></th>
    <th scope="col"><button class="btn btn-outline-secondary">Update</button></th>
  </tr>
  </thead>
  <tbody id="var-table">
 
  
  </tbody>
</table>
        `
        vars.forEach(v=>{
            const repoName =v[0]
            const props =Object.entries( v[1])
            const varName =props[0][0]
            const defaultValue=props[0][1]['defaultValue']
            const inputType=props[0][1]['inputType']
            debugger;
            document.getElementById('var-table').insertAdjacentHTML('beforeend',`<tr id ="${repoName}-tr">
            <th scope="row"></th>
            <td>${repoName}</td>
            <td>${varName}</td>
            <td>${inputType}</td>
            <td>${defaultValue}</td>
            <td><button class="btn btn-outline-secondary">Edit</button></td>
            <td><button class="btn btn-outline-secondary">Remove</button></td>
          </tr>`)
        })
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
                debugger;
                document.getElementById('var-table').insertAdjacentHTML('beforeend',`<tr id ="${selectedRepo}-tr">
                <th scope="row"></th>
                <td>${selectedRepo}</td>
                <td>${varName}</td>
                <td>${varInputType}</td>
                <td>${varDefault}</td>
                <td><button class="btn btn-outline-secondary">Edit</button></td>
                <td><button class="btn btn-outline-secondary">Remove</button></td>
              </tr>`)
              window.pageStore.dispatch({type:window.actionTypes.VAR_ADDED})
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
                debugger;

                window.pageStore.dispatch({ type: window.actionTypes.VAR_REPO_SELECTED, payload: value })
            }

        })


    }

})