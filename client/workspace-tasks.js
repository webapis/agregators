

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
        document.getElementById('container').innerHTML=` <a class="btn btn-secondary m-1" href="/add-task.html" id="add-task-btn">Add Task</a> <configure-tasks></configure-tasks>`
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
        this.innerHTML = `      <a class="btn btn-outline-secondary" href="/tasks-configuration.html" id="tasks-config-btn">
       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
 <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
 <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
</svg>
       </a>`
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

