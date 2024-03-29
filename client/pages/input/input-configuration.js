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

    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
    //local owners repos
    const response = await fetch('https://api.github.com/user/repos', { method: 'get', headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
    const repos = await response.json()

    localStorage.setItem('repos', JSON.stringify(repos))

    
    const result = await window.firebase().ref(`inputRepos/workspaces/${workspaceName}/repos`).get()
    

    const inputRepos = result && Object.entries(result).map(r => r[0])
    
    const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
    
    this.render({ inputEditor, inputRepos: inputRepos !== null ? inputRepos : [] })





  }

  render({ inputEditor, inputRepos }) {
    

    this.innerHTML = `Inputs Configuration
        <div class="row">
        <div class="col-8">
        <select id="repos" class="form-control">
        <option value="">Select Repo</option>
        </select>
        </div>
      <div class="col-2">
      <button class="btn btn-outline-secondary" id="add-workflow-btn">Add Repo</button>
      </div>

        </div>
        <div class="accordion mt-1" id="accordionForRepos">
        </div>
        `
    if (inputRepos.length > 0) {
      inputRepos.forEach((repoName, i) => {
        insertAccordionItem(repoName, i)

      })


    }
    document.getElementById('add-workflow-btn').addEventListener('click', async (e) => {
      const { inputName, repoName } = JSON.parse(localStorage.getItem('inputEditor'))
      const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))

      await window.firebase().ref(`inputRepos/workspaces/${workspaceName}/repos/${repoName}`).set("")
      const inputEditor = JSON.parse(localStorage.getItem('inputEditor'))
      localStorage.setItem('inputEditor', JSON.stringify({ ...inputEditor, repoName: '', inputName: '', inputs: [...inputEditor.inputs, { inputName, repoName }] }))
      insertAccordionItem(repoName, repoName)
      //----------------------------------

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


  }
})



async function removeInput(repoName, inputKey) {
  const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
  await window.firebase().ref(`inputs/workspaces/${workspaceName}/repos/${repoName}/${inputKey}`).remove()
  const parent = document.getElementById(inputKey).parentNode
  parent.removeChild(document.getElementById(inputKey))

}


function insertAccordionItem(repoName, i) {
  let open = false
  document.getElementById('accordionForRepos').insertAdjacentHTML('beforeend', `  
    <div class="accordion-item" id="${i}-accordion-item">
    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse-${i}" aria-expanded="true" aria-controls="panelsStayOpen-collapse-${i}" id="panelsStayOpen-collapse-${i}-btn">
        ${repoName}
      </button>
    </h2>
    <div id="panelsStayOpen-collapse-${i}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
      <div class="accordion-body">

      <div class="row">

      <div class="col">
        <input type="text" class="form-control"  id="input-name-${i}"/>
      </div>

      <div class="col">
      <button class="btn btn-outline-secondary" id="add-input-btn-${i}">Add Input</button>
      </div>
      <div class="col d-flex justify-content-end m-0">
      <button class="btn btn-outline-danger"  id="remove-all-input-btn-${i}">Remove All</button>
      </div>
      </div>
        <div class="row mt-1">
        
        <div class="col">
        <ul class="list-group" id="inputlist-${i}">
        </ul>
        </div>
        
        </div>

      </div>
    </div>
  </div>`)
  
  document.getElementById(`remove-all-input-btn-${i}`).addEventListener('click', async (e) => {
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
    const inputName = document.getElementById(`input-name-${i}`).value
    
    const updateInputs = { [`inputs/workspaces/${workspaceName}/repos/${repoName}`]: null }
    const updateWorkflows = { [`inputRepos/workspaces/${workspaceName}/repos/${repoName}`]: null }
    await window.firebase().ref('/').update({ ...updateInputs, ...updateWorkflows })
    const parent = document.getElementById(`${i}-accordion-item`).parentNode
    parent.removeChild(document.getElementById(`${i}-accordion-item`))





  })

  document.getElementById(`add-input-btn-${i}`).addEventListener('click', async (e) => {
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
    const inputName = document.getElementById(`input-name-${i}`).value
    
    const result = await window.firebase().ref(`inputs/workspaces/${workspaceName}/repos/${repoName}`).push({ inputName })
    
    document.getElementById(`input-name-${i}`).value = ''

    const inputKey = result['name']

    
    document.getElementById(`inputlist-${i}`).insertAdjacentHTML('beforeend', ` <li class="list-group-item d-flex justify-content-between align-items-center" id="${inputKey}">
                ${inputName}
                <button class="btn btn-outline-danger btn-sm" id="${inputKey}-btn">Remove</button>
              </li>`)

    document.getElementById(`${inputKey}-btn`).addEventListener('click', (e) => {
      removeInput(repoName, inputKey)
    })

  })
  document.getElementById(`panelsStayOpen-collapse-${i}-btn`).addEventListener('click', async (e) => {
    e.preventDefault()
    open = !open

    if (open) {
      console.log('open....', open)
      const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
      const inputs = await window.firebase().ref(`inputs/workspaces/${workspaceName}/repos/${repoName}`).get()
      
      document.getElementById(`inputlist-${i}`).innerHTML = ''
      for (let inputKey in inputs) {
        const inputName = inputs[inputKey]['inputName']

        document.getElementById(`inputlist-${i}`).insertAdjacentHTML('beforeend', `  <li class="list-group-item d-flex justify-content-between align-items-center" id="${inputKey}">
                ${inputName}
                <button class="btn btn-outline-danger btn-sm" id="${inputKey}-btn">Remove</button>
              </li>`)

        document.getElementById(`${inputKey}-btn`).addEventListener('click', (e) => {
          removeInput(repoName, inputKey)
        })
      }




    }

  })//end foreach

}