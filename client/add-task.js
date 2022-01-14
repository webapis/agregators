customElements.define('add-task', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML=`loading...`
        const resources = await import('./resources.js')
        await resources.default()

        const {  title: workspaceName   } = JSON.parse(localStorage.getItem('workspaceSelected'))
        const { idToken, localId: uid } =JSON.parse(localStorage.getItem('auth'))
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `

        <div>Add Task
        <input class="form-control" placeholder=" Task name" id="taskname"/>
    
        <button class="btn btn-primary" id="save-task-btn">Save Task</button>
        </div>`

        document.getElementById('save-task-btn').addEventListener('click', (e) => {
            e.preventDefault()
            const {  title: workspaceName   } = JSON.parse(localStorage.getItem('workspaceSelected'))
            const taskName = document.getElementById('taskname').value
        
            const taskId = Date.now()
            const updateServerWorkSpace = { [`server/workspaces/${workspaceName}/tasks/${taskId}`]: { taskName } }
            const updateClientWorkSpace = {
                [`workspaces/${workspaceName}/tasks/${taskId}`]: {
                    taskName
                  
                }
            }
            window.FB_DATABASE.ref('/').update({
                ...updateServerWorkSpace,
                ...updateClientWorkSpace
            }, (error, data) => {
                debugger;
                if(data){
                    window.location.replace('/workspace-tasks.html')
                }
                debugger;   
            
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