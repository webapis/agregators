customElements.define('input-configuration', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `Loading...`
        const resources = await import('/js/resources.js')
        await resources.default()
        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        const { idToken, localId: uid, token } = JSON.parse(localStorage.getItem('auth'))
        //set initial state for inputEditor
        localStorage.getItem('inputEditor') ? JSON.parse(localStorage.getItem('inputEditor')) : localStorage.setItem('inputEditor', JSON.stringify({ repoName: '', inputName: '', inputKey: '', editVar: false, repos: [], inputs: [] }))

        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        //local owners repos
        const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
        const repos = await response.json()

        localStorage.setItem('repos', JSON.stringify(repos))
        

        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoInputs/repos`).get((error, result) => {

            if (!error) {
                const inputs = result && Object.entries(result)



                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                this.render({ inputEditor, inputs: inputs !== null ? inputs : [] })

            } else {



            }

        })

    }

    render({ inputEditor, inputs }) {
        const { inputName, inputType, defaultValue, editVar } = inputEditor

        this.innerHTML = `Inputs Configuration
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Repo Name </th>
      <th scope="col">Input Name</th>

      <th scope="col">Add</th>
      <th scope="col">Update</th>
    </tr>
    <tr>
    <th scope="col">#</th>
    <th scope="col"><select id="repos" class="form-control">
    <option value="">Select Repo</option>
    </select></th>
    <th scope="col"><input class="form-control" type="text" placeholder="Enter Input name" id="var-name-input" value="${inputName}"/></th>
    <th scope="col">

    </th>

    <th scope="col"><button class="btn btn-outline-secondary" id="add-var-btn" ${editVar && 'disabled'}>Add</button></th>
    <th scope="col"><button class="btn btn-outline-secondary" ${!editVar && 'disabled'} id="update-var-btn">Update</button></th>
  </tr>
  </thead>
  <tbody id="var-table">
 
  
  </tbody>
</table>
        `

        document.getElementById('repos').addEventListener('focus', (e) => {
            const { selectedRepo } = JSON.parse(localStorage.getItem('inputEditor'))
            document.getElementById('repos').innerHTML = ''
            document.getElementById('repos').insertAdjacentHTML('afterbegin', '<option value="">Selecte Repo</option>')
            const repos = JSON.parse(localStorage.getItem('repos'))
            repos.forEach(repo => {
                const { name } = repo
                if (name !== selectedRepo) {
                    document.getElementById('repos').insertAdjacentHTML('afterbegin', `<option value="${name}">${name}</option>`)
                }

            })
        })
        document.getElementById('repos').addEventListener('change', (e) => {
            const { value } = e.target
            const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
            localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, selectedRepo: value }))
        })
        document.getElementById(`update-var-btn`).addEventListener('click', (e) => {


            const { inputName, inputType, defaultValue, repoName, inputKey } = JSON.parse(localStorage.getItem('inputEditor'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars/${inputKey}`).update({ inputType, defaultValue, inputName }, (error, result) => {
                
                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: '', defaultValue: '', inputName: '', inputType: '', inputKey: '', editVar: false }))
                location.reload()

            })
        })
        if (inputs.length > 0) {
            inputs.forEach(v => {

                const repoName = v[0]
                const props = Object.entries(v[1]['inputs'])
                props.forEach(prop => {

                    const inputKey = prop[0]
                    const obj = prop[1]
                    const inputName = obj['inputName']

                    document.getElementById('var-table').insertAdjacentHTML('beforeend', `<tr id ="${inputKey}-tr">
                    <th scope="row"></th>
                    <td>${repoName}</td>
                    <td>${inputName}</td>
              
                    <td><button class="btn btn-outline-secondary" id="${inputKey}-edit-btn">Edit</button></td>
                    <td><button class="btn btn-outline-secondary" id="${inputKey}-remove-btn">Remove</button></td>
                  </tr>`)

                    document.getElementById(`${inputKey}-edit-btn`).addEventListener('click', (e) => {
                        const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                        localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName, inputName, inputKey, editVar: true }))
                        location.reload()

                    })
                    document.getElementById(`${inputKey}-remove-btn`).addEventListener('click', (e) => {

                        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))

                        window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoInputs/repos/${repoName}/inputs/${inputKey}`).remove((error, result) => {

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


            const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
            localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, inputName: value }))
        })



        document.getElementById('add-var-btn').addEventListener('click', (e) => {
            const { inputName, repoName } = JSON.parse(localStorage.getItem('inputEditor'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))

            window.FB_DATABASE.ref(`server/workspaces/${workspaceName}/repoVars/repos/${repoName}/vars`).push({ inputName }, (error, result) => {
                const { name: inputKey } = result
                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: '', inputName: '', vars: [...inputEditor.vars, { inputName, inputKey, repoName }] }))
                document.getElementById('var-table').insertAdjacentHTML('beforeend', `<tr id ="${repoName}-tr">
                <th scope="row"></th>
                <td>${repoName}</td>
                <td>${inputName}</td>
  
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
        const { repoName, ownersRepos } = JSON.parse(localStorage.getItem('inputEditor'))


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
                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: value }))
            }
        })
    }

})