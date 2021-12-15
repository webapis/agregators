customElements.define('task-runner', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    this.innerHTML == `loading...`

    const resources = await import('./resources.js')
    await resources.default()

    const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
    this.uid = uid

    window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`


    // window.pageStore.subscribe(window.actionTypes.RUNNER_STARTED, state => {
    //     
    //     const { taskRunner: { [workspaceName]: { runState, runid } } } = state
    //     this.render({ workspaceName, runid })


    // })
    window.pageStore.subscribe(window.actionTypes.RUNNER_STARTED, async state => {

      const { taskRunner: { [workspaceName]: { runState, runid } }, auth: { idToken, localId, token, screenName: owner, email, refreshToken } } = state

      const parameters = `${token}--xxx--${owner}--xxx--${idToken}--xxx--${email}--xxx--${localId}--xxx--${refreshToken}--xxx--${'selectedContainer'}--xxx--${window.projectUrl}--xxx--${workspaceName}--xxx--${runid}`

      const body = JSON.stringify({ ref: 'main', inputs: { projectName: workspaceName, parameters } })

      if (workspaceName === 'local_ws_bdd') {

        const response = await fetch('http://localhost:3001', { body, method: 'post' })


      } else {

        await triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/workflow_runner/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
      }

    })
    // window.pageStore.subscribe(window.actionTypes.RUNNER_STARTED, state => {
    //     const { taskRunner: { [workspaceName]: { runState, runid } } } = state
    //     
    //     window.FB_DATABASE.ref(`runs/workspaces/${workspaceName}/${runid}`).on('value', (error, response) => {
    //         //6


    //         if (response && response.data) {

    //             const { data: { runState } } = response
    //             if (runState === 2) {

    //                 window.pageStore.dispatch({ type: window.actionTypes.RUNNER_COMPLETE, payload: { workspace: workspaceName, runState, runid } })
    //             }

    //         }
    //     })


    // })



    // window.pageStore.subscribe(window.actionTypes.RUNNER_COMPLETE, state => {
    //     const { workspace: { workspaceSelected: { title: workspaceName } } } = state

    //     const { taskRunner: { [workspaceName]: { runState, runid } } } = state

    //     this.render({ runState, runid })

    // })

    this.render({ workspaceName })
  }

  render({ workspaceName }) {
    this.innerHTML = `<div>
     
          <h5>Task runner for: <span class="text-muted text-uppercase"> ${workspaceName}</span></h5>
          <runner-button></runner-button>
          <spinner-button></spinner-button>
          <button class="btn btn-outline-danger" id="cancel-run-btn">Cancel</button>
         </div>
         <div class="container mt-2">
         <run-result></run-result>
   
         </div>
         `


  }
})


// customElements.define('runs-pagination', class extends HTMLElement {
//   constructor() {
//     super()
//   }
//   connectedCallback() {
//     this.innerHTML = `
//     <nav aria-label="Page navigation example">
//     <ul class="pagination">
//       <li class="page-item"><a class="page-link" href="#">Previous</a></li>
//       <li class="page-item"><a class="page-link" href="#">1</a></li>
//       <li class="page-item"><a class="page-link" href="#">2</a></li>
//       <li class="page-item"><a class="page-link" href="#">3</a></li>

//       <li class="page-item"><a class="page-link" href="#">Next</a></li>
//     </ul>
//     </nav>
//     `
//   }
// })


customElements.define('run-result', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {

    this.innerHTML = `
 <div id="table-scroller" style="overflow-y: scroll; height:200px;  display:block">
    <table class="table" class="bg-warning">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Start</th>
            <th scope="col">End</th>
            <th scope="col">Duration  </th>
            <th scope="col">State</th>
            <th scope="col">Log</th>
          </tr>
      
        </thead>
        <tbody id="body-container" >
       
        </tbody>
      </table>
      </div>
      `

    const tableScroller = document.getElementById('table-scroller')


    tableScroller.addEventListener('scroll', () => {
      if (tableScroller.offsetHeight + tableScroller.scrollTop >= tableScroller.scrollHeight) {
        console.log('scrolled to bottom')
        this.fetchNextRuns()
      }
    })

    window.pageStore.subscribe(window.actionTypes.RUNNER_STARTED, async state => {

      const { workspace: { workspaceSelected: { title: workspaceName } } } = state
      const { taskRunner: { [workspaceName]: { runState, runid } } } = state

      const startDate = runid
      const start = `${new Date(parseInt(startDate)).toLocaleDateString()} ${new Date(parseInt(startDate)).toLocaleTimeString()}`
      if (runid) {
        document.getElementById('body-container').insertAdjacentHTML('afterbegin', `<tr id="runid-${runid}">
              <th scope="row">1</th>
              <td>${start}</td>
              <td><span class="text-warning">Pending...</span></td>
              <td><span class="text-warning">Pending...</span></td>
              <td><div class="spinner-border spinner-border-sm text-warning" role="status"> <span class="visually-hidden">Loading...</span></td>
              <td><a href="#">Log</a></td>
            </tr>`)
        window.FB_DATABASE.ref(`runs/${workspaceName}/${runid}`).on('value', (error, result) => {
          if (result) {
            const data = result.data
            if (data.runState === 2 || data.runState === 3) {

              this.querySelectorAll(`#runid-${runid} td`)[1].textContent = `${new Date(parseInt(data.end)).toLocaleDateString()} ${new Date(parseInt(data.end)).toLocaleTimeString()}`
              this.querySelectorAll(`#runid-${runid} td`)[2].textContent = data.duration
              this.querySelectorAll(`#runid-${runid} td`)[3].innerHTML = data.runState === 2 ? `<span class="text-success">Ok</span>` : `<span class="text-danger">Error</span>`

            }
          }
        })
      }
    })

    window.pageStore.subscribe(window.actionTypes.RUNS_FETCHED, state => {

      const { taskRunner: { runs } } = state
      this.displayRuns({ runs })
    })

    await this.fetchRuns()




  }//connectedCallback

  async fetchRuns() {
    const { workspace: { workspaceSelected: { title: workspaceName } }, auth: { idToken } } = window.pageStore.state

    try {
      await window.updateIdToken()
      const fetchUrl = `${window.projectUrl}/runs/${workspaceName}.json?auth=${idToken}&orderBy="$key"&limitToLast=10`
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

      window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })

    }
  }//fetch runs

  displayRuns({ runs }) {
    runs.forEach((run, i) => {

      const key = run[0]
      const value = run[1]
      const runState = value.runState
      const start = `${new Date(parseInt(key)).toLocaleDateString()} ${new Date(parseInt(key)).toLocaleTimeString()}`
      const end = (runState === 2 || runState === 3) ? `${new Date(parseInt(value.end)).toLocaleDateString()} ${new Date(parseInt(value.end)).toLocaleTimeString()}` : `<span class="text-warning">Pending...</span>`
      const duration = (runState === 2 || runState === 3) ? value.duration : `<span class="text-warning">Pending...</span>`

      let runResult = runState === 1 ? '<div class="spinner-border spinner-border-sm text-warning" role="status"> <span class="visually-hidden">Loading...</span>' : runState === 2 ? `<span class="text-success">Ok</span>` : `<span class="text-danger">Error</span>`

      document.getElementById('body-container').insertAdjacentHTML('beforeend', `<tr id="runid-${key}">
        <th scope="row">${key}</th>
        <td>${start}</td>
        <td>${end}</td>
        <td>${duration}</td>
        <td>${runResult}</td>
        <td><a href="#">Log</a></td>

      </tr>`)

    })
  }//display runs

  async fetchNextRuns() {
    const { workspace: { workspaceSelected: { title: workspaceName } }, auth: { idToken }, taskRunner: { runs } } = window.pageStore.state
    const lastRun = runs[runs.length - 1]
    const runid =parseInt(lastRun[0])
    debugger;
    try {
      await window.updateIdToken()
      const fetchUrl = `${window.projectUrl}/runs/${workspaceName}.json?auth=${idToken}&orderBy="$key"&startAt="${runid}"&limitToLast=10`
      debugger;
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
debugger;
        window.pageStore.dispatch({ type: window.actionTypes.NEXT_RUNS_FETCHED, payload: runs })
        this.displayRuns({runs})

      }
    } catch (error) {
      const { message } = error
debugger;
      window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })

    }
  }//fetchNextRUns

})





// customElements.define('task-runner-command', class extends HTMLElement {
//     constructor() {
//         super()
//     }

//     async connectedCallback() {

//         const { workspace: { workspaceSelected: { title: workspaceName } }, auth: { idToken, localId } } = window.pageStore.state
//         const state = window.pageStore.state
//         this.uid = localId

//         if (state.taskRunner && state.taskRunner[workspaceName] && state.taskRunner[workspaceName].runState) {

//             this.render({ runState: state.taskRunner[workspaceName].runState })

//         } else {
//             //1

//             this.render({ runState: undefined, runid: undefined })
//         }




//     }

//     async render({ runState }) {
//         const { workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
//         //2


//         this.innerHTML = `<button class="btn btn-outline-dark" id="run-tasks-btn">${(runState === undefined || runState === 2) ? 'Run' : `<div class="spinner-border spinner-border-sm" role="status">
//         <span class="visually-hidden">Loading...</span>
//       </div>`}</button>`

//         document.getElementById('run-tasks-btn').addEventListener('click', async (e) => {
//             //3

//             e.preventDefault()
//             let update = {}
//             let runid = Date.now()

//             update = { [`runs/workspaces/${workspaceName}/${runid}`]: { runState: 1 } }

//             window.FB_DATABASE.ref('/').update(update, async (error, data) => {
//                 //4
//                 
//                 if (data) {
//                     
//                     window.pageStore.dispatch({ type: window.actionTypes.RUNNER_STARTED, payload: { workspace: workspaceName, runState: 1, runid } })

//                 }
//             })


//         })


//     }
// })


customElements.define('spinner-button', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = `<button class="btn btn-outline-dark" id="run-tasks-btn"><div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div></button>`
  }
})

customElements.define('runner-button', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    // const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
    // this.uid = uid

    //  window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
    this.render()
  }

  render() {
    this.innerHTML = `<button class="btn btn-outline-dark" id="run-tasks-btn">Run</button>`

    document.getElementById('run-tasks-btn').addEventListener('click', async (e) => {
      //3
      e.preventDefault()

      const { workspace: { workspaceSelected: { title: workspaceName } }, auth: { idToken, localId: uid } } = window.pageStore.state
      let update = {}
     


      try {
        await window.updateIdToken()
        const fetchUrl = `${window.projectUrl}/runs/incs.json?auth=${idToken}`
        
        const updateIncResponse = await fetch(fetchUrl, { method: 'PUT', body: JSON.stringify({'.sv': {'increment':100}}) })
        const incrementedNumber = await updateIncResponse.json()
     debugger;
        const error =incrementedNumber['error']
        if(error){
            
            window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: error })
          
        } else{
          let runid = incrementedNumber
          let start =Date.now()
          update = { [`runs/${workspaceName}/${runid}`]: { runState: 1, start } }
          debugger;
          window.FB_DATABASE.ref('/').update(update, async (error, data) => {
            //4
  
            if (data) {
    
              window.pageStore.dispatch({ type: window.actionTypes.RUNNER_STARTED, payload: { workspace: workspaceName, runState: 1, runid:incrementedNumber,start } })
    
            }
          })
        }

    } catch (error) {
        const {message}=error
        window.pageStore.dispatch({ type: window.actionTypes.CLIENT_ERROR, payload: message })
    }

    

    
     
     






    })
  }
})