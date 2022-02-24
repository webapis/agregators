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

        debugger
        window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos`).get((error, result) => {
            debugger;
            if (!error) {
                const workflows = result && Object.entries(result)

                debugger;

                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                debugger;
                this.render({ inputEditor, workflows: workflows !== null ? workflows : [] })

            } else {

                debugger;

            }

        })

    }

    render({ inputEditor, workflows }) {
        const { inputName, editVar } = inputEditor

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
    <th scope="col"><input class="form-control" type="text" placeholder="Enter Input name" id="input-name" value="${inputName}"/></th>
 

    <th scope="col"><button class="btn btn-outline-secondary" id="add-input-btn" ${editVar && 'disabled'}>Add</button></th>
    <th scope="col"><button class="btn btn-outline-secondary" disabled id="update-input_btn">Update</button></th>
  </tr>
  </thead>
  <tbody id="var-table">
 
  
  </tbody>
</table>
        `

        document.getElementById('repos').addEventListener('focus', (e) => {
            const { repoName } = JSON.parse(localStorage.getItem('inputEditor'))
            document.getElementById('repos').innerHTML = ''
            document.getElementById('repos').insertAdjacentHTML('afterbegin', '<option value="">Selecte Repo</option>')
            const repos = JSON.parse(localStorage.getItem('repos'))

            repos.forEach(repo => {
                const { name } = repo
                if (name !== repoName) {
                    document.getElementById('repos').insertAdjacentHTML('afterbegin', `<option value="${name}">${name}</option>`)
                }

            })
        })
        document.getElementById('repos').addEventListener('change', (e) => {
            const { value } = e.target
            const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
            localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: value }))
        })
        document.getElementById(`update-input_btn`).addEventListener('click', (e) => {
            const { inputName, repoName, inputKey } = JSON.parse(localStorage.getItem('inputEditor'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos/${repoName}/${inputKey}`).update({ inputName }, (error, result) => {
                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: '', inputName: '', inputKey: '', editVar: false }))
                location.reload()
            })
        })
        if (workflows.length > 0) {
            workflows.forEach(workflow => {
                debugger;
                const repoName = workflow[0]
                const inputs = workflow[1]
                for (let inputKey in inputs) {
                    const inputName = inputs[inputKey]['inputName']
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

                        document.getElementById('repos').innerHTML = ''
                        document.getElementById('repos').insertAdjacentHTML('afterbegin', `<option value="${repoName}" selected>${repoName}</option>`)
                        document.getElementById('input-name').value=inputName
                        document.getElementById('update-input_btn').removeAttribute('disabled')
                        
                    })

                    document.getElementById(`${inputKey}-remove-btn`).addEventListener('click', (e) => {
                        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                        window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos/${repoName}/${inputKey}`).remove((error, result) => {
                            location.reload()
                        })
                    })

                }

            })
        } else {
            document.getElementById('var-table').innerHTML = `No inputs set`
        }

        document.getElementById('input-name').addEventListener('input', (e) => {
            const { value } = e.target


            const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
            localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, inputName: value }))
        })



        document.getElementById('add-input-btn').addEventListener('click', (e) => {
            const { inputName, repoName } = JSON.parse(localStorage.getItem('inputEditor'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))

            window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos/${repoName}`).push({ inputName }, (error, result) => {
                const { name: inputKey } = result
                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: '', inputName: '', inputs: [...inputEditor.inputs, { inputName, inputKey, repoName }] }))
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