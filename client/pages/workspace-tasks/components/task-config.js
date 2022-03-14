customElements.define('task-config', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const taskId = this.getAttribute('taskId')
        const title = this.getAttribute('title')
        const order = this.getAttribute('order') ? this.getAttribute('order') : 0
        const sequence = this.getAttribute('sequence') ? this.getAttribute('sequence') : 'sequential'
         this.editable=false
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
                    
                    if (data) {
                        console.log('updated')
                        window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
                    }
                    

                })
              } else {
           
              }
        })



        document.getElementById(`${taskId}-task-editable-btn`).addEventListener('click', (e) => {


          


            if (!this.editable) {
                
                document.getElementById(`${taskId}-title`).removeAttribute('readonly')
                document.getElementById(`${taskId}-order`).removeAttribute('readonly')
                document.getElementById(`${taskId}-sequence`).removeAttribute('disabled')
                this.editable=! this.editable

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
                    this.editable=! this.editable
                    
                    if (data) {
                        console.log('updated')
                        //window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
                    }
                    

                })
                
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
        <edit-icon></edit-icon>
        </button>`
    }
})


customElements.define('delete-task-btn', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `<button class="btn"><delete-icon></delete-icon></button>`
    }
})