customElements.define('add-task', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid }, workspace: { workspaceSelected } } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceSelected})`
        this.innerHTML = `<div>Add Task
        <input class="form-control" placeholder=" Task name" id="taskname"/>
        <input class="form-control" placeholder=" Task Order" id="taskorder" type="number"/>
        <button class="btn btn-primary" id="save-task-btn">Save Task</button>
        </div>`

        document.getElementById('save-task-btn').addEventListener('click', (e) => {
            e.preventDefault()
            const {  workspace: { workspaceSelected } } = window.pageStore.state
            const taskname = document.getElementById('taskname').value
            const taskorder = document.getElementById('taskorder').value
            this.FB_DATABASE.ref(`workspaces/${workspaceSelected}/tasks/`).update({ [taskname]
                : { taskorder } }, (error, data) => {
                debugger;
                window.location.replace('/workspace-tasks.html')
            })
        })
    }
})