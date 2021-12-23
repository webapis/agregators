

customElements.define('workspace-tasks', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        document.addEventListener('visibilitychange', function (event) {
            if (!document.hidden && document.getElementById('enable-workflow-link')) {
                location.reload()
            } 
        });
        this.innerHTML=`loading...`
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid, token, screenName }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)

        
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML=`  
        <div id="container">Loading...</div>
        `
        //check if runner is previously forked
        const wfRunnerBranchUrl = `https://api.github.com/repos/${screenName}/workflow_runner/branches/main`
        const responseDeleteABranch = await fetch(wfRunnerBranchUrl, { headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
        console.log('responseDeleteABranch',responseDeleteABranch)
        debugger;
        const forked = responseDeleteABranch.ok
        debugger;
        if(forked){
            //upstream forked runner
            const fetchPath = `https://api.github.com/repos/${screenName}/workflow_runner/merge-upstream`

            await fetch(fetchPath, {
                method: 'post',
                headers: {
                    authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({ branch: 'main' })
            })
            // check if runner's workflow is enabled
            const workflowUrl = `https://api.github.com/repos/${screenName}/workflow_runner/actions/workflows/aggregate.yml`
            const workflowState = await fetch(workflowUrl, { headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
            debugger;
         
            if(workflowState.status===200){

                this.loadTasks({workspaceName})
                //display workspace tasks

              

            } else{
                //enable runners workflow
                this.loadEnableWorkflow()
            }
        } else{
            
         debugger;
            //fork runner
            this.loadForkRunner()

            
        }



    }

    loadTasks({workspaceName}){
        document.getElementById('container').innerHTML=` <a class="btn btn-secondary m-1" href="/add-task.html" id="add-task-btn">Add Task</a>`
        const taskElement =document.createElement('div')
        document.getElementById('container').appendChild(taskElement)
        window.FB_DATABASE.ref(`workspaces/${workspaceName}/tasks`).get((error, result) => {
            
            if(result){
                
                const tasks = result && Object.entries(result)
    
          
                tasks &&     tasks.forEach(task => {
                  
                    taskElement.id='tasks'
                    const taskId = task[0]
                    const taskName = task[1]['taskName']
                    taskElement.innerHTML=''
                    taskElement.insertAdjacentHTML('beforeend', ` <a href="/task-workflows.html" class="list-group-item list-group-item-action" id="${taskId}" name="${taskName}">${taskName}</a>`)
                })
                Array.from(document.getElementsByClassName('list-group-item')).forEach(element => {
                    element.addEventListener('click', e => {
                        e.preventDefault()
                        const { id, name } = e.target
                        
                        window.pageStore.dispatch({ type: window.actionTypes.TASK_SELECTED, payload: { id, taskName: name } })
                        window.location.replace('./task-workflows.html')
                    })
                })
            } else{
          
                taskElement
                .innerHTML='0 Tasks found'
                
            }
       
         
        })

    }

    loadEnableWorkflow(){
        document.getElementById('container').innerHTML=``
        document.getElementById('container').insertAdjacentHTML('afterbegin',`<enable-workflows></enable-workflows>`)
    }

    loadForkRunner(){
        document.getElementById('container').innerHTML=``
        document.getElementById('container').insertAdjacentHTML('afterbegin',`  <fork-workflow-runner-btn></fork-workflow-runner-btn>`)
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


customElements.define('configure-tasks', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<a class="btn btn-outline-secondary" href="/auth-configuration.html" id="tasks-config-btn">
      Auth Config
       </a>
       <a class="btn btn-outline-secondary" href="/vars-configuration.html" id="vars-config-btn">
      Vars Config
       </a>
       `
    }
})


customElements.define('fork-workflow-runner-btn', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const { auth: { token } } = window.pageStore.state
  

        this.render({ token })
       
        
    }

    render({ token }) {
   
        this.innerHTML = `<button class="btn btn-secondary"  id="fork-runner-btn">Fork runner</button>`

        document.getElementById('fork-runner-btn').addEventListener('click', async () => {
            try {
             const forkResponse =   await fetch(`https://api.github.com/repos/webapis/workflow_runner/forks`, { method: 'post', headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' } })
             debugger;
                window.location.replace('/workspace-tasks.html')
            } catch (error) {


                
            }
       
            
        })
    }
})

customElements.define('enable-workflows', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const { auth: { screenName } } = window.pageStore.state
        this.innerHTML=`<a href="https://github.com/${screenName}/workflow_runner/actions"  target="_blank" id="enable-workflow-link">Enable Workflows</a>`
    }
})

