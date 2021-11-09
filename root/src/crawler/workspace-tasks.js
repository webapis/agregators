

customElements.define('workspace-tasks', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid }, workspace: { workspaceSelected:{title:workspaceName} } } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `
        <signed-in-as></signed-in-as>
        <div class="d-flex justify-content-between">
      
        <a class="btn btn-secondary" href="/add-task.html" id="add-task-btn">Add Task</a>
        <div>
        <a class="btn btn-outline-secondary" href="/tasks-configuration.html" id="tasks-config-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
</svg>
        </a>
        <a class="btn btn-secondary" href="#" id="run-tasks-btn">Run Tasks</a>
        </div>
        </div>
        <p>Tasks:</p>
        <div id="tasks" class="list-group"></div>
        `
        debugger;
        this.FB_DATABASE.ref(`workspaces/${workspaceName}/tasks`).on('value', (error, result) => {
            debugger;
            const tasks = result.data && Object.entries(result.data)


            tasks.forEach(task => {
                debugger;
                const taskId = task[0]
                const taskName = task[1]['taskName']
                document.getElementById('tasks').insertAdjacentHTML('beforeend', ` <a href="/task-workflows.html" class="list-group-item list-group-item-action" id="${taskId}" name="${taskName}">${taskName}</a>`)
            })
            Array.from(document.getElementsByClassName('list-group-item')).forEach(element => {
                element.addEventListener('click', e => {
                    e.preventDefault()
                    const { id, name } = e.target
                    debugger;
                    window.pageStore.dispatch({ type: window.actionTypes.TASK_SELECTED, payload: { id, taskName: name } })
                    window.location.replace('./task-workflows.html')
                })
            })
            debugger;
        })
        document.getElementById('run-tasks-btn').addEventListener('click', async (e) => {
            e.preventDefault()

            const { auth: { token, screenName: owner, idToken, email, localId, refreshToken }, workspace: { workspaceSelected:{title} } } = window.pageStore.state
            const projectUrl = window.projectUrl
            //const selectedContainer=title
            const parameters = `${token}--xxx--${owner}--xxx--${idToken}--xxx--${email}--xxx--${localId}--xxx--${refreshToken}--xxx--${'selectedContainer'}--xxx--${projectUrl}--xxx--${title}`
            debugger;
            const body = JSON.stringify({ ref: 'main', inputs: { projectName: title, parameters } })
            if (title === 'local_test') {
                debugger;
                await fetch('http://localhost:3001', { body, method: 'post' })
            } else {
                debugger;
                await triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/workflow_runner/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
            }
            debugger;



            debugger;
        })


    }


})



async function triggerAction({ ticket, body, gh_action_url }) {
    debugger;

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
        debugger;
    }

}