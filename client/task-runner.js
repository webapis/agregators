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



    // const start = new Date(runid).toLocaleDateString('en-US')
    // if (runid) {
    //     document.querySelector('run-result tbody').insertAdjacentHTML('beforeend', `<tr id="${runid}">
    //     <th scope="row">1</th>
    //     <td>${start}</td>
    //     <td >Otto</td>
    //     <td>Otto</td>
    //     <td><div class="spinner-border spinner-border-sm" role="status"> <span class="visually-hidden">Loading...</span></td>
    //     <td><a href="#">Log</a></td>
    //   </tr>`)
    //     window.FB_DATABASE.ref(`runs/workspaces/${workspaceName}/${runid}`).on('value', (error, result) => {
    //         if (result) {
    //             const data = result.data
    //             if (data) {
    //                 //    document.getElementById(runid)
    //             }


    //         }
    //     })

    // }



  }
})


customElements.define('run-result', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = `<table class="table">
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
        <tbody id="body-container">
       
        </tbody>
      </table>`
    const { workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
    window.FB_DATABASE.ref(`runs/workspaces/${workspaceName}`).get((error, result) => {

      if (result) {
        const runs = Object.entries(result)
        runs.forEach((run) => {
          const key = run[0]
          const value = run[1]
          const runState = value.runState
          const start = `${new Date(parseInt(key)).toLocaleDateString()} ${new Date(parseInt(key)).toLocaleTimeString()}`
          const end = (runState === 2 || runState === 3) ? `${new Date(parseInt(value.end)).toLocaleDateString()} ${new Date(parseInt(key)).toLocaleTimeString()}`: `<span class="text-warning">Pending...</span>`
          const duration = (runState === 2 || runState === 3) ? value.duration : `<span class="text-warning">Pending...</span>`
        
          let runResult = runState === 1 ? '<div class="spinner-border spinner-border-sm text-warning" role="status"> <span class="visually-hidden">Loading...</span>' : runState === 2 ? `<span class="text-success">Ok</span>` : `<span class="text-danger">Error</span>`

          document.getElementById('body-container').insertAdjacentHTML('beforeend', `<tr id="runid-${key}">
            <th scope="row">1</th>
            <td>${start}</td>
            <td>${end}</td>
            <td>${duration}</td>
            <td>${runResult}</td>
            <td><a href="#">Log</a></td>

          </tr>`)
          debugger;
          window.FB_DATABASE.ref(`runs/workspaces/${workspaceName}/${key}`).on('value', (error, result) => {
            if (result) {
              const data = result.data
              if (data.runState === 2 || data.runState === 3) {
                debugger;
                this.querySelectorAll(`#runid-${runid} td`)[1].textContent = new Date(data.end).toLocaleDateString('en-US')
                this.querySelectorAll(`#runid-${runid} td`)[2].textContent = data.duration
                this.querySelectorAll(`#runid-${runid} td`)[3].innerHTML = data.runState === 2 ? `<span class="text-success">Ok</span>` : `<span class="text-danger">Error</span>`
                debugger;
              }
            }
          })
        })

      }
    })



    window.pageStore.subscribe(window.actionTypes.RUNNER_STARTED, async state => {

      const { workspace: { workspaceSelected: { title: workspaceName } } } = state
      const { taskRunner: { [workspaceName]: { runState, runid } } } = state

      const start =  `${new Date(parseInt(runid)).toLocaleDateString()} ${new Date(parseInt(runid)).toLocaleTimeString()}`
      if (runid) {
        document.getElementById('body-container').insertAdjacentHTML('afterbegin', `<tr id="runid-${runid}">
            <th scope="row">1</th>
            <td>${start}</td>
            <td><span class="text-warning">Pending...</span></td>
            <td><span class="text-warning">Pending...</span></td>
            <td><div class="spinner-border spinner-border-sm text-warning" role="status"> <span class="visually-hidden">Loading...</span></td>
            <td><a href="#">Log</a></td>
          </tr>`)
        window.FB_DATABASE.ref(`runs/workspaces/${workspaceName}/${runid}`).on('value', (error, result) => {
          if (result) {
            const data = result.data
            if (data.runState === 2 || data.runState === 3) {
              debugger;
              this.querySelectorAll(`#runid-${runid} td`)[1].textContent = `${new Date(parseInt(data.end)).toLocaleDateString()} ${new Date(parseInt(data.end)).toLocaleTimeString()}`
              this.querySelectorAll(`#runid-${runid} td`)[2].textContent = data.duration
              this.querySelectorAll(`#runid-${runid} td`)[3].innerHTML = data.runState === 2 ? `<span class="text-success">Ok</span>` : `<span class="text-danger">Error</span>`
              debugger;
            }
          }
        })
      }
    })
  }
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

      const { workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
      let update = {}
      let runid = Date.now()

      update = { [`runs/workspaces/${workspaceName}/${runid}`]: { runState: 1 } }

      window.FB_DATABASE.ref('/').update(update, async (error, data) => {
        //4
        debugger;
        if (data) {
          debugger;
          window.pageStore.dispatch({ type: window.actionTypes.RUNNER_STARTED, payload: { workspace: workspaceName, runState: 1, runid } })

        }
      })


    })
  }
})