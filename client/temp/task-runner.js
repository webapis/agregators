customElements.define('task-runner', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.innerHTML == `loading...`;
    window.runFetchComplete = false;

    const resources = await import('./resources.js')
    await resources.default()

 
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))


    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`







    this.render({ workspaceName })
  }

  render({ workspaceName }) {
    this.innerHTML = `<div>
     
          <h5>Task runner for: <span class="text-muted text-uppercase"> ${workspaceName}</span></h5>
          <runner-button></runner-button>
        
          <button class="btn btn-outline-danger" id="cancel-run-btn">Cancel</button>
         </div>
         <div class="container mt-2">
         <run-result></run-result>
   
         </div>
         `


  }
})


customElements.define('run-result', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {

    this.innerHTML = `
    <div class="container" class="bg-warning">
        <div class="row">
            <div scope="col" class="col-1 fw-bold">#</div>
            <div scope="col" class="col fw-bold">Start</div>
            <div scope="col" class="col fw-bold">End</div>
            <div scope="col" class="col fw-bold">Duration</div>
            <div scope="col" class="col fw-bold">State</div>
            <div scope="col" class="col fw-bold">Log</div>
        </div>
      
      </div>
 <div id="table-scroller" style="overflow-y: scroll; height:400px;" class="container">
  
     
        <div id="body-container" class="row">
       
        </div>
   
      </div>
      `

    const tableScroller = document.getElementById('table-scroller')


    tableScroller.addEventListener('scroll', () => {
      if (tableScroller.offsetHeight + tableScroller.scrollTop >= tableScroller.scrollHeight) {
        console.log('scrolled to bottom')
        if (window.runFetchComplete === false)

          this.fetchNextRuns()
      }
    })

  

    await this.fetchRuns()




  }//connectedCallback

  async fetchRuns() {
    // const { workspace: { workspaceSelected: { title: workspaceName } }, auth: { idToken } } = window.pageStore.state
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
    const { idToken } = JSON.parse(localStorage.getItem('auth'))
    try {

      const runLength = await this.fetchRunLength()

      const startAt = runLength - 10

      const fetchUrl = `${window.projectUrl}/runs/${workspaceName}.json?auth=${idToken}&orderBy="$key"&startAt="${startAt}"&endAt="${runLength}"`
      const getResponse = await fetch(fetchUrl, { method: 'GET' })
      const getJsonData = await getResponse.json()


      const error = getJsonData && getJsonData['error']

      if (error) {

        window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })
      } else {
        const runs = Object.entries(getJsonData).sort((a, b) => {
          const one = parseInt(a[0])
          const two = parseInt(b[0])
          return two - one
        });
        window.pageStore.dispatch({ type: window.actionTypes.RUNS_FETCHED, payload: runs })
      }
    } catch (error) {
      const { message } = error
      //  window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })

    }
  }//fetch runs

  displayRuns({ runs }) {
    runs.forEach((run, i) => {

      const key = run[0]
      const value = run[1]
      const runState = value.runState

      const start = `${new Date(parseInt(value.start)).toLocaleDateString()} ${new Date(parseInt(value.start)).toLocaleTimeString()}`
      const end = (runState === 2 || runState === 3) ? `${new Date(parseInt(value.end)).toLocaleDateString()} ${new Date(parseInt(value.end)).toLocaleTimeString()}` : `<span class="text-warning">Pending...</span>`
      const duration = (runState === 2 || runState === 3) ? value.duration : `<span class="text-warning">Pending...</span>`

      let runResult = runState === 1 ? '<div class="spinner-border spinner-border-sm text-warning" role="status"> <span class="visually-hidden">Loading...</span>' : runState === 2 ? `<span class="text-success">Ok</span>` : `<span class="text-danger">Error</span>`

      document.getElementById('body-container').insertAdjacentHTML('beforeend', `<div id="runid-${key}" class="col-12 row py-2 border border-bottom-0">
        <div scope="row" class="col-1">${key}</div>
        <div class="col">${start}</div>
        <div class="col">${end}</div>
        <div class="col">${duration}</div>
        <div class="col">${runResult}</div>
        <div class="col"><a href="${value.html_url}">Log</a></div>

      </div>`)

    })
  }//display runs

  async fetchNextRuns() {
    // const { workspace: { workspaceSelected: { title: workspaceName } }, auth: { idToken }, taskRunner: { runs } } = window.pageStore.state
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
    const { idToken } = JSON.parse(localStorage.getItem('auth'))
    const endAt = parseInt(runs[runs.length - 1][0]) - 1
    const runLength = await this.fetchRunLength()
    const startAt = runs.length + 10 >= runLength ? 1 : endAt - 10

      ;
    // const runid =parseInt(lastRun[0])

    try {
      if (startAt >= 1) {
        if (startAt === 1) {
          window.runFetchComplete = true
        }

   
        const fetchUrl = `${window.projectUrl}/runs/${workspaceName}.json?auth=${idToken}&orderBy="$key"&startAt="${startAt}"&endAt="${endAt}"`

        const getResponse = await fetch(fetchUrl, { method: 'GET' })
        const getJsonData = await getResponse.json()


        const error = getJsonData && getJsonData['error']

        if (error) {

          //  window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })


        } else {

          const runs = Object.entries(getJsonData).sort((a, b) => {
            const one = parseInt(a[0])
            const two = parseInt(b[0])

            return two - one
          });

          // window.pageStore.dispatch({ type: window.actionTypes.NEXT_RUNS_FETCHED, payload: runs })
          this.displayRuns({ runs })

        }
      }
    } catch (error) {
      const { message } = error

      // window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })

    }
  }//fetchNextRUns

  async fetchRunLength() {
    try {
      //const { workspace: { workspaceSelected: { title: workspaceName } }, auth: { idToken } } = window.pageStore.state
      const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
      const { idToken } = JSON.parse(localStorage.getItem('auth'))
      try {
    
        const fetchUrl = `${window.projectUrl}/runs/inc/${workspaceName}/incs.json?auth=${idToken}`
        const getResponse = await fetch(fetchUrl, { method: 'GET' })
        const getJsonData = await getResponse.json()


        const error = getJsonData && getJsonData['error']

        if (error) {
          //  window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })
        } else {

          return getJsonData
        }
      } catch (error) {
        const { message } = error
        window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })

      }
    } catch (error) {

    }
  }

})




customElements.define('runner-button', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {


    this.render({ running: '' })


  }

async  render({ running }) {
    
    this.innerHTML = `<button class="btn btn-outline-dark" id="run-tasks-btn" ${running && 'disabled'}>${running ? 'Running...' : 'Run'}</button>`

    document.getElementById('run-tasks-btn').addEventListener('click', async (e) => {
      
      //3
      e.preventDefault()
      const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
      const { idToken } = JSON.parse(localStorage.getItem('auth'))

      let update = {}



      try {

        const fetchUrl = `${window.projectUrl}/runs/inc/${workspaceName}/incs.json?auth=${idToken}`

        const updateIncResponse = await window.firebase().ref(fetchUrl).set({ '.sv': { 'increment': 1 } })
        const incrementedNumber = await updateIncResponse
        
        const error = incrementedNumber['error']
        if (error) {

        } else {
          let runid = incrementedNumber
          let start = Date.now()
          update = { [`runs/${workspaceName}/${runid}`]: { runState: 1, start } }

          await window.firebase().ref('/').update(update)
            //4
              
              localStorage.setItem('taskRunner', JSON.stringify({ [workspaceName]: { runState: 1, runid: incrementedNumber, start } }))
              this.runnerStarted()

            
          
        }

      } catch (error) {
        const { message } = error
        // window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
      }


    })
  }//render

  async runnerStarted() {
    const { title: workspaceName } = JSON.parse(localStorage.getItem('workspaceSelected'))
    const { idToken, localId: uid, screenName: owner, email, token, refreshToken } = JSON.parse(localStorage.getItem('auth'))
    const { [workspaceName]: { runid, start } } = JSON.parse(localStorage.getItem('taskRunner'))
    const parameters = `${token}--xxx--${owner}--xxx--${idToken}--xxx--${email}--xxx--${uid}--xxx--${refreshToken}--xxx--${'selectedContainer'}--xxx--${window.projectUrl}--xxx--${workspaceName}--xxx--${runid}--xxx--${start}`

    const body = JSON.stringify({ ref: 'main', inputs: { projectName: workspaceName, parameters } })
    
    if (workspaceName === 'local_ws_bdd' || workspaceName === 'local_pub_ws_bdd') {
      
      const response = await fetch('http://localhost:3001', { body, method: 'post' })

      
    } else {
      
      await triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/workflow_runner/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
    }
  }


})




async function triggerAction({ ticket, body, gh_action_url }) {
  

  try {
    const response = await fetch(gh_action_url, {
      method: 'post',
      headers: {
        authorization: `token ${ticket}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body
    })
    const data = await response.json()
  } catch (error) {
    
  }

}