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
        localStorage.getItem('inputEditor') ? JSON.parse(localStorage.getItem('inputEditor')) : localStorage.setItem('inputEditor', JSON.stringify({ repoName: '', inputName: '', inputKey: '', repos: [], inputs: [] }))

        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        //local owners repos
        const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
        const repos = await response.json()

        localStorage.setItem('repos', JSON.stringify(repos))

        debugger
        window.FB_DATABASE.ref(`inputRepos/workspaces/${workspaceName}/repos`).get((error, result) => {
            debugger;
            if (!error) {
                const inputRepos = result && Object.entries(result).map(r=>r[0])

                debugger;

                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                debugger;
                this.render({ inputEditor, inputRepos: inputRepos !== null ? inputRepos : [] })

            } else {

                debugger;

            }

        })

    }

    render({ inputEditor, inputRepos }) {
        debugger;
        const { inputName } = inputEditor
        this.innerHTML = `Inputs Configuration
        <div class="row">
        <div class="col-10">
        <select id="repos" class="form-control">
        <option value="">Select Repo</option>
        </select>
        </div>
      <div class="col-2">
      <button class="btn btn-secondary" id="add-workflow-btn">Add Repo</button>
      </div>
        </div>
        <div class="accordion" id="accordionForRepos">
        </div>
        `
        if(inputRepos.length>0){
            inputRepos.forEach((repoName,i)=>{
                let open =false
                document.getElementById('accordionForRepos').insertAdjacentHTML('beforeend',`  
                <div class="accordion-item">
                <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse-${i}" aria-expanded="true" aria-controls="panelsStayOpen-collapse-${i}" id="panelsStayOpen-collapse-${i}-btn">
                    ${repoName}
                  </button>
                </h2>
                <div id="panelsStayOpen-collapse-${i}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                  <div class="accordion-body">
                  <div class="row">
                  <div class="col-10">
                    <input type="text" class="form-control"  id="input-name-${i}"/>
                  </div>
                <div class="col-2">
                <button class="btn btn-secondary" id="add-input-btn-${i}">Add Input Name</button>
                </div>
                  </div>
                  </div>
                </div>
              </div>`)

              document.getElementById(`add-input-btn-${i}`).addEventListener('click',(e)=>{
                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const inputName=  document.getElementById(`input-name-${i}`).value
                  window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos/${repoName}`).push({inputName}, (error,result) => {
                    debugger;
                    if (!error) {
                      //  const inputRepos = result && Object.entries(result).map(r=>r[0])
        
                    
        
                    } else {
        
                        debugger;
        
                    }
        
                })

              })
              document.getElementById(`panelsStayOpen-collapse-${i}-btn`).addEventListener('click',(e)=>{
                  e.preventDefault()
                open = !open

                if(open){
                    console.log('open....',open)
                    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                    window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos/${repoName}`).get((error, result) => {
                        debugger;
                        if (!error) {
                          //  const inputRepos = result && Object.entries(result).map(r=>r[0])
            
                        
            
                        } else {
            
                            debugger;
            
                        }
            
                    })
                }

            })//end foreach

            })

          
        }
        document.getElementById('add-workflow-btn').addEventListener('click', (e) => {
            const { inputName, repoName } = JSON.parse(localStorage.getItem('inputEditor'))
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            window.FB_DATABASE.ref(`inputRepos/workspaces/${workspaceName}/repos/${repoName}`).set("", (error, result) => {
                const { name: inputKey } = result
                const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: '', inputName: '', inputs: [...inputEditor.inputs, { inputName, inputKey, repoName }] }))
            })
        })

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

        // document.getElementById(`update-input_btn`).addEventListener('click', (e) => {
        //     const { inputName, repoName, inputKey } = JSON.parse(localStorage.getItem('inputEditor'))
        //     const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        //     window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos/${repoName}/${inputKey}`).update({ inputName }, (error, result) => {
        //         const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
        //         localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: '', inputName: '', inputKey: '', editVar: false }))
        //         location.reload()
        //     })
        // })

        if (false) {
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
                        e.preventDefault()
                        debugger;
                        const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
                        localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName, inputName, inputKey, editVar: true }))

                        document.getElementById('repos').innerHTML = ''
                        document.getElementById('repos').insertAdjacentHTML('afterbegin', `<option value="${repoName}" selected>${repoName}</option>`)
                        document.getElementById('repos').setAttribute('disabled', true)
                        document.getElementById('input-name').value = inputName
                        document.getElementById('update-input_btn').removeAttribute('disabled')
                        debugger;

                    })

                    document.getElementById(`${inputKey}-remove-btn`).addEventListener('click', (e) => {
                        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                        window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos/${repoName}/${inputKey}`).remove((error, result) => {
                            location.reload()
                        })
                    })

                }

            })
        }

        // document.getElementById('input-name').addEventListener('input', (e) => {
        //     const { value } = e.target


        //     const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
        //     localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, inputName: value }))
        // })



        // document.getElementById('add-input-btn').addEventListener('click', (e) => {
        //     const { inputName, repoName } = JSON.parse(localStorage.getItem('inputEditor'))
        //     const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))

        //     window.FB_DATABASE.ref(`inputs/workspaces/${workspaceName}/repos/${repoName}`).push({ inputName }, (error, result) => {
        //         const { name: inputKey } = result
        //         const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
        //         localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: '', inputName: '', inputs: [...inputEditor.inputs, { inputName, inputKey, repoName }] }))
        //         document.getElementById('var-table').insertAdjacentHTML('beforeend', `<tr id ="${repoName}-tr">
        //         <th scope="row"></th>
        //         <td>${repoName}</td>
        //         <td>${inputName}</td>
  
        //         <td><button class="btn btn-outline-secondary">Edit</button></td>
        //         <td><button class="btn btn-outline-secondary">Remove</button></td>
        //       </tr>`)

        //     })
        // })

    }
})



