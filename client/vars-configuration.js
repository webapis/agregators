customElements.define('vars-configuration', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `Loading...`
        const resources = await import('./resources.js')
        await resources.default()
        const {  title: workspaceName   } = JSON.parse(localStorage.getItem('workspaceSelected'))
        const { idToken, localId: uid,token } =JSON.parse(localStorage.getItem('auth'))
   
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
        const ownersRepos = await response.json()

      //  window.pageStore.dispatch({ type: window.actionTypes.VAR_REPOS_FETCHED, payload: ownersRepos })
        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos`).get((error, result) => {
            if (result) {
                const vars = Object.entries(result)
                debugger;

             //   window.pageStore.dispatch({ type: window.actionTypes.VARS_FETCHED, payload: vars })
             this.render({ varEditor, vars })
                
            } else {


             //   window.pageStore.dispatch({ type: window.actionTypes.VARS_FETCHED, payload: [] })
            }

        })
        // window.pageStore.subscribe(window.actionTypes.VAR_ADDED, state => {
        //     const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varEditor, vars } } = state
        //     debugger;
        //     this.render({ varEditor, vars })
        // })
        // window.pageStore.subscribe(window.actionTypes.VARS_FETCHED, state => {
        //     const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varEditor, vars } } = state
        //     this.render({ varEditor, vars })
        // })
        // window.pageStore.subscribe(window.actionTypes.EDIT_VAR_CLICKED, state => {
        //     const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varEditor, vars } } = state
        //     this.render({ varEditor, vars })
        // })
        // window.pageStore.subscribe(window.actionTypes.VAR_UPDATED, state => {
        //     const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varEditor, vars } } = state
        //     debugger;
        //     this.render({ varEditor, vars })
        // })
        // window.pageStore.subscribe(window.actionTypes.VAR_REMOVED, state => {
        //     const { auth: { token, idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varEditor, vars } } = state
        //     debugger;
        //     this.render({ varEditor, vars })
        // })
    }

    render({ varEditor, vars }) {
        const { varName, inputType, defaultValue, editVar } = varEditor

        this.innerHTML = `Vars Configuration
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Repo Name </th>
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
    <option  ${inputType === '' && 'selected'}>Choose...</option>
    <option value="text"  ${inputType === 'text' && 'selected'}>Text</option>
    <option value="list"  ${inputType === 'list' && 'selected'}>List</option>
  
  </select>
    </th>
    <th scope="col"><input class="form-control" type="text" placeholder="Enter Default Value" id="var-default-value" value="${defaultValue}"/></th>
    <th scope="col"><button class="btn btn-outline-secondary" id="add-var-btn" ${editVar && 'disabled'}>Add</button></th>
    <th scope="col"><button class="btn btn-outline-secondary" ${!editVar && 'disabled'} id="update-var-btn">Update</button></th>
  </tr>
  </thead>
  <tbody id="var-table">
 
  
  </tbody>
</table>
        `

        document.getElementById(`update-var-btn`).addEventListener('click', (e) => {

            const {workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varEditor: { varName, inputType, defaultValue, repoName, varKey } } } = window.pageStore.state
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars/${varKey}`).update({ inputType, defaultValue, varName }, (error, result) => {
                window.pageStore.dispatch({ type: window.actionTypes.VAR_UPDATED, payload: { varName, inputType, defaultValue, varKey, repoName } })
            })
        })
        if (vars.length > 0) {
            vars.forEach(v => {
                debugger;
                const repoName = v[0]
                const props = Object.entries(v[1]['vars'])
                props.forEach(prop => {
                    debugger;
                    const varKey = prop[0]
                    const obj = prop[1]
                    debugger;

                    const defaultValue = obj['defaultValue']
                    const inputType = obj['inputType']
                    const varName = obj['varName']
                    debugger;
                    document.getElementById('var-table').insertAdjacentHTML('beforeend', `<tr id ="${varKey}-tr">
                    <th scope="row"></th>
                    <td>${repoName}</td>
                    <td>${varName}</td>
                    <td>${inputType}</td>
                    <td>${defaultValue}</td>
                    <td><button class="btn btn-outline-secondary" id="${varKey}-edit-btn">Edit</button></td>
                    <td><button class="btn btn-outline-secondary" id="${varKey}-remove-btn">Remove</button></td>
                  </tr>`)

                    document.getElementById(`${varKey}-edit-btn`).addEventListener('click', (e) => {
                        debugger;
                        window.pageStore.dispatch({ type: window.actionTypes.EDIT_VAR_CLICKED, payload: { repoName, defaultValue, varName, inputType, varKey } })
                    })
                    document.getElementById(`${varKey}-remove-btn`).addEventListener('click', (e) => {
                        debugger;
                        const { workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
                        debugger;
                        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars/${varKey}`).remove((error, result) => {

                            debugger;
                            window.pageStore.dispatch({ type: window.actionTypes.VAR_REMOVED, payload: { repoName, varKey } })
                        })
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
            const { workspace: { workspaceSelected: { title: workspaceName } }, varConfiguration: { varEditor: { varName, inputType, defaultValue, repoName } } } = window.pageStore.state
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars`).push({ varName, inputType, defaultValue }, (error, result) => {
                const { name: varKey } = result
                window.pageStore.dispatch({ type: window.actionTypes.VAR_ADDED, payload: { varName, inputType, defaultValue, varKey, repoName } })
          
                debugger;
                
                document.getElementById('var-table').insertAdjacentHTML('beforeend', `<tr id ="${repoName}-tr">
                <th scope="row"></th>
                <td>${repoName}</td>
                <td>${varName}</td>
                <td>${inputType}</td>
                <td>${defaultValue}</td>
                <td><button class="btn btn-outline-secondary">Edit</button></td>
                <td><button class="btn btn-outline-secondary">Remove</button></td>
              </tr>`)
              debugger;
           
            })
        })
    }
})



customElements.define('github-repos', class extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        const { varConfiguration: { varEditor: { repoName }, ownersRepos } } = window.pageStore.state


        this.innerHTML = `
      <select id="repos" name="repoDataList" class="form-control">
      <option value="default">...Select repository</option>
      </select>`

        this.render({ ownersRepos, repoName })

        window.pageStore.subscribe(window.actionTypes.VAR_REPO_SELECTED, state => {
            const { varConfiguration: { varEditor: { repoName }, ownersRepos } } = state
            this.render({ ownersRepos, repoName })
        })
    }
    async render({ ownersRepos, repoName }) {

        const selector = document.getElementById('repos')

        ownersRepos && ownersRepos.forEach(repo => {

            selector.insertAdjacentHTML('beforeend', `<option ${repoName === repo.name && 'selected'} value=${repo.name}>${repo.name}</option>`)
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