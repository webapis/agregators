customElements.define('run-all-tasks-btn', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = ` <button class="btn btn-outline-success" id="run-all-tasks-btn">Run </button>`
        document.getElementById(`run-all-tasks-btn`).addEventListener('click', async (e) => {

            // const { taskRunner: { [workspaceName]: { runState, runid, start } }, auth: { idToken, localId, token, screenName: owner, email, refreshToken } } = state
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            const { idToken, localId: uid, token, screenName: owner, email, refreshToken } = JSON.parse(localStorage.getItem('auth'))
            const runid = Date.now()
            const start = runid
            const runNext = true
            const taskId = window.orderedTasks[0]['taskId']
            const runSequence = window.orderedTasks[0]['runSequence']
            const first = 'true'
            const wfrunid = runid

            const parameters = `${token}--xxx--${owner}--xxx--${idToken}--xxx--${email}--xxx--${uid}--xxx--${refreshToken}--xxx--${'selectedContainer'}--xxx--${window.projectUrl}--xxx--${workspaceName}--xxx--${runid}--xxx--${start}--xxx--${taskId}--xxx--${runNext}--xxx--${runSequence}--xxx--${first}--xxx--${wfrunid}`

            const body = JSON.stringify({ ref: 'main', inputs: { projectName: workspaceName, parameters } })
            const fetchUrl = `${window.projectUrl}/workspaces/${workspaceName}/lastLog/.json?auth=${idToken}`
            const updateWsLastLogStart =  { start:{'.sv': 'timestamp' },last:null}
           // const updateWsLastLogLast = { [`workspaces/${workspaceName}/lastLog/last`]: null }
           // const updateWsLastLogState = { [`workspaces/${workspaceName}/lastLog/state`]: { step: 1, message: 'User initialized run' } }
            const updateIncResponse = await fetch(fetchUrl, { method: 'PUT', body: JSON.stringify(updateWsLastLogStart) })


            if (workspaceName === 'local_ws_bdd' || workspaceName === 'local_pub_ws_bdd') {
                const response = await fetch('http://localhost:3001', { body, method: 'post' })
            } else {

                await triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/workflow_runner/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })

            }

        })
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