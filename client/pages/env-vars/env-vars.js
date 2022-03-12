customElements.define('env-vars', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `loading...`
        const resources = await import('../../js/resources.js')
        await resources.default()

        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))

        const { idToken, localId: uid, token, screenName } = JSON.parse(localStorage.getItem('auth'))
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)

        this.uid = uid

        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
      
        
        
        document.getElementById('workspace-breadcrumb').innerText = `Workspace(${workspaceName})`
 
        const scope = this.getAttribute('scope')
        this.innerHTML = `<div> ${scope} Scope Vars
        <div class="row">
        <div class="col">
      
        </div>
        <div class="col">
       
        </div>
        <div class="col">
       
        </div>
        </div>
        </div>
        <div class="row">
        <div class="col">
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Var Name</th>
      <th scope="col">Var Value</th>
      <th scope="col">Actions</th>
    </tr>
    <tr>
    <th scope="col">
    <input class="form-control" readonly id="var-key-input"/>
    </th>
    <th scope="col">
    <input class="form-control" placeholder="Enter Var Name" id="var-name-input"/>
    </th>
    <th scope="col">
    <input class="form-control" placeholder="Enter Var Value" id="var-value-input"/>
    </th>
    <th scope="col">
    <button class="btn btn-outline-secondary" id="add-var-btn"> Add</button>
    </th>
    <th scope="col">
    <button class="btn btn-outline-secondary" id="update-var-btn"> Update</button>
    </th>
  </tr>
  </thead>
  <tbody id="var-container">

  </tbody>
</table>
        </div>
        </div>
        `

        document.getElementById('update-var-btn').addEventListener('click', (e) => {
            const varKey = document.getElementById('var-key-input').value
            const varName = document.getElementById('var-name-input').value
            const varValue = document.getElementById('var-value-input').value
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            const refPath = this.getAttribute('scope') === 'workspace' ? `server/workspaces/${workspaceName}/vars/${varKey}` : `server/workspaces/${workspaceName}/tasks/${this.getAttribute('taskId')}/vars/${varKey}`
            window.FB_DATABASE.ref(refPath).update({ varName, varValue }, (error, result) => {

                document.getElementById(`${varKey}-var-name`).innerHTML = varName
                document.getElementById(`${varKey}-var-value`).innerHTML = varValue


                document.getElementById('var-key-input').value = ""
                document.getElementById('var-name-input').value = ""
                document.getElementById('var-value-input').value = ""
            })
        })

        document.getElementById("add-var-btn").addEventListener('click', (e) => {

            const varName = document.getElementById('var-name-input').value
            const varValue = document.getElementById('var-value-input').value
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            const refPath = this.getAttribute('scope') === 'workspace' ? `server/workspaces/${workspaceName}/vars` : `server/workspaces/${workspaceName}/tasks/${this.getAttribute('taskId')}/vars`
            window.FB_DATABASE.ref(refPath).push({ varName, varValue }, (error, result) => {
                const { name: inputKey } = result
                document.getElementById('var-container').insertAdjacentHTML('beforeend', `  
                <tr id="${inputKey}-table-raw">
                <th scope="row">1</th>
                <td id="${inputKey}-var-name">${varName}</td>
                <td id="${inputKey}-var-value">${varValue}</td>
                <td>
                <button class="btn  btn-outline-warning" id="${inputKey}-edit-var-btn">Edit</button>
                </td>
                <td>
                <button class="btn  btn-outline-danger" id="${inputKey}-remove-var-btn">Remove</button>
                </td>
              </tr>
                `)
                document.getElementById('var-key-input').value = ''
                document.getElementById('var-name-input').value = ''
                document.getElementById('var-value-input').value = ''
                document.getElementById(`${inputKey}-edit-var-btn`).addEventListener('click', (e) => {
                    e.preventDefault()
                    console.log('edit var btn clicked')

                    document.getElementById('var-key-input').value = inputKey
                    document.getElementById('var-name-input').value = varName
                    document.getElementById('var-value-input').value = varValue

                })
                const removeRefPath = this.getAttribute('scope') === 'workspace' ? `server/workspaces/${workspaceName}/vars/${inputKey}` : `server/workspaces/${workspaceName}/tasks/${this.getAttribute('taskId')}/vars/${inputKey}`
                document.getElementById(`${inputKey}-remove-var-btn`).addEventListener('click', (e) => {
                    removeVar(removeRefPath,`${inputKey}-table-raw`)
                    //----------------------------------------------------------------------------------------------------
    
                })
            })//

         
        })


        //const { idToken, localId: uid, token, screenName } = JSON.parse(localStorage.getItem('auth'))
        const refPath = this.getAttribute('scope') === 'workspace' ? `server/workspaces/${workspaceName}/vars` : `server/workspaces/${workspaceName}/tasks/${this.getAttribute('taskId')}/vars`
     debugger;
 
     debugger;
        window.FB_DATABASE.ref(refPath).get((error, vars) => {
            debugger;
            if(vars){

            
            for (let v in vars) {
                debugger;
                console.log('v',v)
                const varName = vars[v]['varName']
                const varValue = vars[v]['varValue']
                debugger;
                document.getElementById('var-container').insertAdjacentHTML('beforeend', `  
            <tr id="${v}-table-raw">
            <th scope="row">${v}</th>
            <td id="${v}-var-name">${varName}</td>
            <td id="${v}-var-value">${varValue}</td>
            <td>
            <button class="btn  btn-outline-warning" id="${v}-edit-var-btn">Edit</button>
            </td>
            <td>
            <button class="btn  btn-outline-danger" id="${v}-remove-var-btn">Remove</button>
            </td>
          </tr>
            `)
                document.getElementById(`${v}-edit-var-btn`).addEventListener('click', (e) => {
                    e.preventDefault()
                    console.log('edit var btn clicked')

                    document.getElementById('var-key-input').value = v
                    document.getElementById('var-name-input').value = varName
                    document.getElementById('var-value-input').value = varValue

                })
                const removeRefPath = this.getAttribute('scope') === 'workspace' ? `server/workspaces/${workspaceName}/vars/${v}` : `server/workspaces/${workspaceName}/tasks/${this.getAttribute('taskId')}/vars/${v}`
                document.getElementById(`${v}-remove-var-btn`).addEventListener('click', (e) => {
                    removeVar(removeRefPath,`${v}-table-raw`)
                    //----------------------------------------------------------------------------------------------------
                })

            }//for

        }
            

        })

    }//



})


function removeVar(refPath,id) {
    window.FB_DATABASE.ref(refPath).remove((error, vars) => {

            const parent =document.getElementById(id).parentNode
            parent.removeChild(document.getElementById(id))

        

    })
}