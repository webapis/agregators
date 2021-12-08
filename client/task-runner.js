customElements.define('task-runner', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML == `loading...`
        debugger;
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
        this.uid = uid
     
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
//    
        this.innerHTML = `<div>
       
         <h5>Task runner for: <span class="text-muted text-uppercase"> ${workspaceName}</span></h5>
         <task-runner-command></task-runner-command>
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

    connectedCallback() {
        this.innerHTML = `<table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Start</th>
            <th scope="col">End</th>
            <th scope="col">Duration</th>
            <th scope="col">State</th>
            <th scope="col">Detail View</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td><a href="#">Show Detail</a></td>
          </tr>
       
        </tbody>
      </table>`
    }
})



customElements.define('task-runner-command', class extends HTMLElement {
    constructor() {
        super()
    }

   async connectedCallback() {
  
        const { workspace: { workspaceSelected: { title: workspaceName } }, auth: {  idToken,  localId} } = window.pageStore.state
        const state =window.pageStore.state
         this.uid = localId
    
      
        if(state.taskRunner && state.taskRunner[workspaceName] && state.taskRunner[workspaceName].runState){

            this.render({ runState: state.taskRunner[workspaceName].runState })
debugger;
            
        } else{
            //1
            debugger;
            this.render({ runState:undefined,runid:undefined})
        }
      

        window.pageStore.subscribe(window.actionTypes.RUNNER_STARTED, async(state) => {
            //5
            debugger;
            const { auth: { token, screenName: owner, idToken, email, localId, refreshToken }, workspace: { workspaceSelected: { title: workspaceName } } } =state
            const projectUrl = window.projectUrl
            const { taskRunner: { [workspaceName]: { runState,runid } } } = state
            debugger;
            this.render({ runState,runid })

            const parameters = `${token}--xxx--${owner}--xxx--${idToken}--xxx--${email}--xxx--${localId}--xxx--${refreshToken}--xxx--${'selectedContainer'}--xxx--${projectUrl}--xxx--${workspaceName}--xxx--${runid}`

            const body = JSON.stringify({ ref: 'main', inputs: { projectName: workspaceName, parameters } })
            if (workspaceName === 'local_ws_bdd') {
            
                await fetch('http://localhost:3001', { body, method: 'post' })
            } else {

                await triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/workflow_runner/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
            }

            window.FB_DATABASE.ref(`runs/workspaces/${workspaceName}/${runid}`).on('value',(error,response)=>{
                //6
        
                debugger;
                if(response &&response.data){
                    debugger;
                    const {data:{runState}}=response
                    if(runState===2){
                        debugger;
                        window.pageStore.dispatch({ type: window.actionTypes.RUNNER_COMPLETE, payload: { workspace: workspaceName, runState,runid } })
                    }
                 
                }
            })
        })
        window.pageStore.subscribe(window.actionTypes.RUNNER_COMPLETE, state => {
            const { workspace: { workspaceSelected: { title: workspaceName } } } =state
       
            const { taskRunner: { [workspaceName]: { runState,runid } } } = state
            debugger;
            this.render({ runState,runid})

        })

    }

  async  render({ runState }) {
    const { workspace: { workspaceSelected: { title: workspaceName } } } =window.pageStore.state
    //2
    debugger;   
   
        this.innerHTML = `<button class="btn btn-outline-dark" id="run-tasks-btn">${(runState===undefined || runState===2) ? 'Run':`<div class="spinner-border spinner-border-sm" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`}</button>`

        document.getElementById('run-tasks-btn').addEventListener('click', async (e) => {
            //3
            debugger;
            e.preventDefault()
            let update = {}
            let runid = Date.now()
            debugger;
            update = { [`runs/workspaces/${workspaceName}/${runid}`]: { runState: 1 } }
            debugger;
            window.FB_DATABASE.ref('/').update(update, async (error, data) => {
               //4
               debugger;
                if (data) {
                    debugger;
                    window.pageStore.dispatch({ type: window.actionTypes.RUNNER_STARTED, payload: { workspace: workspaceName, runState: 1,runid } })
                 
                } 
            })


        })

       
    }
})