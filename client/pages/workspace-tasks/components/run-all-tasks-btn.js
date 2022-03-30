customElements.define('run-all-tasks-btn', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
      
        this.innerHTML = ` <button class="btn btn-outline-success btn-sm" id="run-all-tasks-btn">Run </button>`
        document.getElementById(`run-all-tasks-btn`).addEventListener('click', async (e) => {
         
         //  document.getElementById('run-all-tasks-btn').setAttribute('disabled',true)
           
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            const { idToken, localId: uid, token, screenName: owner, email, refreshToken,timestamp,api_key } = JSON.parse(localStorage.getItem('auth'))
            const runid = Date.now()
            const start = runid
            const runNext = true
            const taskId = window.orderedTasks[0]['taskId']
            const runSequence = window.orderedTasks[0]['runSequence']
            const first = 'true'

            const fetchIncUrl = `inc/workspaces/${workspaceName}`
            debugger;
            const updateIncResponse = await window.firebase().ref(fetchIncUrl).update({ inc:{'.sv': { "increment": 1 }} })
            const {inc} = await updateIncResponse

            const wfrunid = inc
            debugger;
            const parameters = `${token}--xxx--${owner}--xxx--${idToken}--xxx--${email}--xxx--${uid}--xxx--${refreshToken}--xxx--${timestamp}--xxx--${window.projectUrl}--xxx--${workspaceName}--xxx--${runid}--xxx--${start}--xxx--${taskId}--xxx--${runNext}--xxx--${runSequence}--xxx--${first}--xxx--${wfrunid}--xxx--${api_key}`
            const body = JSON.stringify({ ref: 'main', inputs: { projectName: workspaceName, parameters } })
            const fetchUrl = `workspaces/${workspaceName}/lastLog`
            const updateWsLastLogStart = { start: { '.sv': 'timestamp' }, last: null }

            const updateLastLogResponse = await window.firebase().ref(fetchUrl).update(updateWsLastLogStart)

            if (workspaceName === 'local_ws_bdd' || workspaceName === 'local_pub_ws_bdd') {
                const response = await fetch('http://localhost:3001', { body, method: 'post' })
            } else {
                const response = await triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/workflow_runner/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
                const data = await response.ok()
                
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