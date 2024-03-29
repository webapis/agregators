customElements.define('task-editor', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `loading...`
        const resources = await import('/js/resources.js')
        await resources.default()

        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))

        const { localId: uid } = JSON.parse(localStorage.getItem('auth'))
        this.uid = uid

        document.getElementById('workspace-breadcrumb').innerText = `Workspace(${workspaceName})`
        this.innerHTML = `

        <div>Add Task
        <input class="form-control" placeholder=" Task name" id="taskname"/>
        <button class="btn btn-primary" id="save-task-btn">Save Task</button>
        </div>`

        document.getElementById('save-task-btn').addEventListener('click', async (e) => {
            e.preventDefault()
            //   const {  title: workspaceName   } = JSON.parse(localStorage.getItem('workspace'))
            const taskName = document.getElementById('taskname').value

            const taskId = Date.now()
            const updateServerWorkSpace = { [`server/workspaces/${workspaceName}/tasks/${taskId}`]: { taskName, runOrder: '0', runSequence: 'sequential' } }
            const updateClientWorkSpace = {
                [`workspaces/${workspaceName}/tasks/${taskId}`]: {
                    taskName, runOrder: '0', runSequence: 'sequential'

                }
            }
            const data = await window.firebase().ref('/').update({
                ...updateServerWorkSpace,
                ...updateClientWorkSpace
            })
            
            if (data) {
                window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
            }
            


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