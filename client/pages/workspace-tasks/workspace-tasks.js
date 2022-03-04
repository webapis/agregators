

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
        this.innerHTML = `loading...`
        const resources = await import('../../js/resources.js')
        await resources.default()
        await Promise.all([

            import('./components/config-workflow-icon.js'),
            import('./components/configure-tasks-btn.js'),
            import('./components/enable-workflows.js'),
            import('./components/fork-workflow-runner-btn.js'),
            import('./components/task-component.js'),
            import('./components/task-config.js'),
            import('./components/task-run-state.js'),
            import('./components/run-all-tasks-btn.js'),
            import('./js/triggerAction.js'),
        ])

        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        const { idToken, localId: uid, token, screenName } = JSON.parse(localStorage.getItem('auth'))

        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)


        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `
        <div id="container">Loading...</div>
        `
        //check if runner is previously forked
        const wfRunnerBranchUrl = `https://api.github.com/repos/${screenName}/workflow_runner/branches/main`
        const responseBranch = await fetch(wfRunnerBranchUrl, { headers: { Accept: "application/vnd.github.v3+json", authorization: `token ${token}` } })
        console.log('responseBranch', responseBranch)

        const forked = responseBranch.ok

        if (forked) {
            //upstream forked runner
            const fetchPath = `https://api.github.com/repos/${screenName}/workflow_runner/merge-upstream`

            const responseupst = await fetch(fetchPath, {
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


            if (workflowState.status === 200) {

                this.loadTasks({ workspaceName })
                //display workspace tasks
            } else {
                //enable runners workflow
                this.loadEnableWorkflow()
            }
        } else {


            //fork runner
            this.loadForkRunner()
        }

    }

    loadTasks({ workspaceName }) {
        document.getElementById('container').innerHTML = `
         <a class="btn btn-outline-secondary m-1" href="/pages/task-editor/task-editor.html" id="task-editor-btn">Add Task</a>
         <run-all-tasks-btn> </run-all-tasks-btn>
         <button class="btn btn-outline-danger">Abort </button>
         <a class="btn btn-outline-info" id="workflow-run-logs-btn" href="/pages/workspace-run-logs/workspace-run-logs.html">Logs</a>
         `

        window.FB_DATABASE.ref(`workspaces/${workspaceName}/tasks`).get((error, result) => {
            const tasks = result //&& Object.entries(result)
            const taskElement = document.createElement('div')
            document.getElementById('container').appendChild(taskElement)
            if (result) {

                taskElement.id = 'tasks'
                taskElement.classList.add('accordion')
                const orderByRunOrder = Object.entries(tasks).map(m => {
                    const taskId = m[0]
                    const taskProps = m[1]
                    return { taskId, ...taskProps }
                }).sort(function compare(a, b) {
                    if (a.runOrder < b.runOrder) {
                        return -1;
                    }
                    if (a.runOrder > b.runOrder) {
                        return 1;
                    }
                    return 0;
                }
                )
                window.orderedTasks = orderByRunOrder
              
                orderByRunOrder.forEach(task => {
                    const taskId = task['taskId']
                    const taskName = task['taskName']
                    const runOrder = task['runOrder']
                    const runSequence = task['runSequence']
                    
                    taskElement.insertAdjacentHTML('beforeend', ` <task-component id="${taskId}" name="${taskName}" order="${runOrder}" sequence="${runSequence}"></task-component>`)
               
                })

            } else {
                taskElement
                    .innerHTML = '0 Tasks found'

            }

        })

    }

    loadEnableWorkflow() {
        document.getElementById('container').innerHTML = ``
        document.getElementById('container').insertAdjacentHTML('afterbegin', `<enable-workflows></enable-workflows>`)
    }

    loadForkRunner() {
        document.getElementById('container').innerHTML = ``
        document.getElementById('container').insertAdjacentHTML('afterbegin', `  <fork-workflow-runner-btn></fork-workflow-runner-btn>`)
    }

})













function timespan(date2, date1) {


    var diff = date2.getTime() - date1.getTime();

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);

    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);

    console.log(days + " days, " + hours + " hours, " + mins + " minutes, " + seconds + " seconds");
    return { days, hours, mins, seconds }
}

window.timespan=timespan