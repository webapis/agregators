customElements.define('run-all-tasks-btn',class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        this.innerHTML=` <button class="btn btn-outline-success" id="run-all-tasks-btn">Run </button>`
        document.getElementById(`run-all-tasks-btn`).addEventListener('click', async (e) => {

            // const { taskRunner: { [workspaceName]: { runState, runid, start } }, auth: { idToken, localId, token, screenName: owner, email, refreshToken } } = state
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            const { idToken, localId: uid, token, screenName: owner, email, refreshToken } = JSON.parse(localStorage.getItem('auth'))
            const runid = Date.now()
            const start = runid
            const runNext = true
            const taskId = window.orderedTasks[0]['taskId']
            const runSequence =window.orderedTasks[0]['runSequence']
            const first ='true'
            const wfrunid =runid
            
            const parameters = `${token}--xxx--${owner}--xxx--${idToken}--xxx--${email}--xxx--${uid}--xxx--${refreshToken}--xxx--${'selectedContainer'}--xxx--${window.projectUrl}--xxx--${workspaceName}--xxx--${runid}--xxx--${start}--xxx--${taskId}--xxx--${runNext}--xxx--${runSequence}--xxx--${first}--xxx--${wfrunid}`

            const body = JSON.stringify({ ref: 'main', inputs: { projectName: workspaceName, parameters } })

            if (workspaceName === 'local_ws_bdd' || workspaceName === 'local_pub_ws_bdd') {
                const response = await fetch('http://localhost:3001', { body, method: 'post' })
            } else {
                await triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/workflow_runner/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
            }
            const fetchUrl =`${window.projectUrl}/.json?auth=${idToken}`
            const updateWsLastLogStart ={[`workspaces/${workspaceName}/lastLog/start`]:{ '.sv': 'timestamp' }}
            const updateIncResponse = await fetch(fetchUrl, { method: 'PATCH', body: JSON.stringify(updateWsLastLogStart) })
          debugger;
        })
    }
})