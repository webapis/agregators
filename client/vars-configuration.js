customElements.define('vars-configuration', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `Loading...`
        const resources = await import('./resources.js')
        await resources.default()
        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
        const { idToken, localId: uid, token } = JSON.parse(localStorage.getItem('auth'))
        //set initial state for varEditor
        localStorage.getItem('varEditor') ? JSON.parse(localStorage.getItem('varEditor')) : localStorage.setItem('varEditor', JSON.stringify({ repoName: '', varName: '', inputType: '', defaultValue: '',varKey:'', editVar: false, ownersRepos: [],vars:[] }))

        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        //local owners repos
        const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
        const ownersRepos = await response.json()
        const varEditor = JSON.parse(localStorage.getItem('varEditor'))
        localStorage.setItem('varEditor',JSON.stringify({...varEditor,ownersRepos}))
        debugger;
     
        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos`).get((error, result) => {

            if (!error) {
                const vars = result && Object.entries(result)


               
                const varEditor = JSON.parse(localStorage.getItem('varEditor'))
                this.render({ varEditor, vars: vars !== null ? vars : [] })

            } else {


               
            }

        })
       
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

          
            const { varName, inputType, defaultValue, repoName,varKey }  =JSON.parse(localStorage.getItem('varEditor'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars/${varKey}`).update({ inputType, defaultValue, varName }, (error, result) => {
                debugger;
                const varEditor  =JSON.parse(localStorage.getItem('varEditor'))
                localStorage.setItem('varEditor', JSON.stringify({ ...varEditor, repoName:'', defaultValue:'', varName:'', inputType:'', varKey:'',editVar:false }))
                location.reload()
           
            })
        })
        if (vars.length > 0) {
            vars.forEach(v => {

                const repoName = v[0]
                const props = Object.entries(v[1]['vars'])
                props.forEach(prop => {

                    const varKey = prop[0]
                    const obj = prop[1]


                    const defaultValue = obj['defaultValue']
                    const inputType = obj['inputType']
                    const varName = obj['varName']

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
                        const varEditor = JSON.parse(localStorage.getItem('varEditor'))
                        localStorage.setItem('varEditor', JSON.stringify({ ...varEditor, repoName, defaultValue, varName, inputType, varKey,editVar:true }))
                        location.reload()
                     
                    })
                    document.getElementById(`${varKey}-remove-btn`).addEventListener('click', (e) => {

                        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))

                        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars/${varKey}`).remove((error, result) => {

                            location.reload()
                         
                        })
                    })


                })

            })
        } else {
            document.getElementById('var-table').innerHTML = `No vars set`
        }

        document.getElementById('var-name-input').addEventListener('input', (e) => {
            const { value } = e.target

         
          const varEditor = JSON.parse(localStorage.getItem('varEditor'))
          localStorage.setItem('varEditor', JSON.stringify({ ...varEditor, varName: value }))
        })

        document.getElementById('input-type-selector').addEventListener('change', (e) => {
            const { value } = e.target
         
            const varEditor = JSON.parse(localStorage.getItem('varEditor'))
            localStorage.setItem('varEditor', JSON.stringify({ ...varEditor, inputType: value }))
        })

        document.getElementById('var-default-value').addEventListener('input', (e) => {
            const { value } = e.target
            const varEditor = JSON.parse(localStorage.getItem('varEditor'))
            localStorage.setItem('varEditor', JSON.stringify({ ...varEditor,    defaultValue: value }))
        })

        document.getElementById('add-var-btn').addEventListener('click', (e) => {
            const { varName, inputType, defaultValue, repoName }  =JSON.parse(localStorage.getItem('varEditor'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
            
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars`).push({ varName, inputType, defaultValue }, (error, result) => {
                const { name: varKey } = result
                const varEditor = JSON.parse(localStorage.getItem('varEditor'))
                localStorage.setItem('varEditor', JSON.stringify({ ...varEditor,repoName: '', varName: '', inputType: '', defaultValue: '', vars:[...varEditor.vars,{ varName, inputType, defaultValue, varKey, repoName }] }))
                document.getElementById('var-table').insertAdjacentHTML('beforeend', `<tr id ="${repoName}-tr">
                <th scope="row"></th>
                <td>${repoName}</td>
                <td>${varName}</td>
                <td>${inputType}</td>
                <td>${defaultValue}</td>
                <td><button class="btn btn-outline-secondary">Edit</button></td>
                <td><button class="btn btn-outline-secondary">Remove</button></td>
              </tr>`)


            })
        })
    }
})



customElements.define('github-repos', class extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        const { repoName, ownersRepos } = JSON.parse(localStorage.getItem('varEditor'))


        this.innerHTML = `
      <select id="repos" name="repoDataList" class="form-control">
      <option value="default">...Select repository</option>
      </select>`

        this.render({ ownersRepos, repoName })

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
                const varEditor = JSON.parse(localStorage.getItem('varEditor'))
                localStorage.setItem('varEditor', JSON.stringify({ ...varEditor, repoName: value }))
            }
        })
    }

})