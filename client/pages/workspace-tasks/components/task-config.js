customElements.define('task-config', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const taskId = this.getAttribute('taskId')
        const title = this.getAttribute('title')
        const order = this.getAttribute('order') ? this.getAttribute('order') : 0
        const sequence = this.getAttribute('sequence') ? this.getAttribute('sequence') : 'sequential'

        this.innerHTML = `        
        <div class="border border-1 p-1 mb-1">
   
        <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Task</span>
         <input name="taskName" type="text" class="form-control task-input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" value="${title}" id="${taskId}-title" readonly>
        </div>
          <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Run order</span>
         <input name="runOrder" type="number" class="form-control task-input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" id="${taskId}-order" value="${order}" readonly>
            </div>

            <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Run sequence</span>
            <select name="runSequence" name="choice" class="form-control task-input" id="${taskId}-sequence" disabled>
            <option value="sequential" ${sequence === 'sequential' && 'selected'}>sequential</option>
            <option value="parallel" ${sequence === 'parallel' && 'selected'}>parallel</option>
            </select>
            </div>
            <div>
            <edit-task-btn id="${taskId}-task-editable-btn"></edit-task-btn>
            <delete-task-btn id ="${taskId}-delete-task-btn"></delete-task-btn>
             </div>
            </div>

`

        document.getElementById(`${taskId}-delete-task-btn`).addEventListener('click', (e) => {
            if (confirm(`Are you sure you want to delete ${title}?`)) {
                // Save it!
                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const updateServerWorkSpace = {
                    [`server/workspaces/${workspaceName}/tasks/${taskId}`]: null
                }
                const updateClientWorkSpace = {
                    [`workspaces/${workspaceName}/tasks/${taskId}`]:null
                }
                window.FB_DATABASE.ref('/').update({
                    ...updateServerWorkSpace,
                    ...updateClientWorkSpace
                }, (error, data) => {
                    debugger;
                    if (data) {
                        console.log('updated')
                        window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
                    }
                    debugger;

                })
              } else {
           
              }
        })



        document.getElementById(`${taskId}-task-editable-btn`).addEventListener('click', (e) => {


            const readonly = document.getElementById(`${taskId}-title`).readOnly


            if (readonly) {

                document.getElementById(`${taskId}-title`).removeAttribute('readonly')
                document.getElementById(`${taskId}-order`).removeAttribute('readonly')
                document.getElementById(`${taskId}-sequence`).removeAttribute('disabled')

            } else {

                document.getElementById(`${taskId}-title`).setAttribute('readonly', true)
                document.getElementById(`${taskId}-order`).setAttribute('readonly', true)
                document.getElementById(`${taskId}-sequence`).setAttribute('disabled', true)
                //save to database
                const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
                const taskName = document.getElementById(`${taskId}-title`).value
                const runOrder = document.getElementById(`${taskId}-order`).value
                const runSequence = document.getElementById(`${taskId}-sequence`).value

                const updateServerWorkSpace = {
                    [`server/workspaces/${workspaceName}/tasks/${taskId}`]: {
                        taskName, runOrder,
                        runSequence
                    }
                }
                const updateClientWorkSpace = {
                    [`workspaces/${workspaceName}/tasks/${taskId}`]: {
                        taskName,
                        runOrder,
                        runSequence

                    }
                }
                window.FB_DATABASE.ref('/').update({
                    ...updateServerWorkSpace,
                    ...updateClientWorkSpace
                }, (error, data) => {
                    debugger;
                    if (data) {
                        console.log('updated')
                        //window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
                    }
                    debugger;

                })
                debugger;
            }


        })
    }
})


customElements.define('edit-task-btn', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<button class="btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
</svg>
        </button>`
    }
})


customElements.define('delete-task-btn', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `<button class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg></button>`
    }
})