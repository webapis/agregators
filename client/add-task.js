customElements.define('add-task', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML=`loading...`
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `
    <signed-in-as></signed-in-as>
        <div>Add Task
        <input class="form-control" placeholder=" Task name" id="taskname"/>
    
        <button class="btn btn-primary" id="save-task-btn">Save Task</button>
        </div>`

        document.getElementById('save-task-btn').addEventListener('click', (e) => {
            e.preventDefault()
            const { workspace: { workspaceSelected: { title: workspaceName } } } = window.pageStore.state
            const taskName = document.getElementById('taskname').value
        
            const taskId = Date.now()
            const updateServerWorkSpace = { [`server/workspaces/${workspaceName}/tasks/${taskId}`]: { taskName } }
            const updateClientWorkSpace = {
                [`workspaces/${workspaceName}/tasks/${taskId}`]: {
                    taskName
                  
                }
            }
            this.FB_DATABASE.ref('/').update({
                ...updateServerWorkSpace,
                ...updateClientWorkSpace
            }, (error, data) => {
                debugger;   
                window.location.replace('/workspace-tasks.html')
            })
        })
    }
})


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}