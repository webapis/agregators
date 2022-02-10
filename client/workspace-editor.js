customElements.define('workspace-editor', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML =`loading...`
        const resources = await import('./resources.js')
        await resources.default()
        
        const {idToken, localId: uid} =JSON.parse(localStorage.getItem('auth'))
        const workspaceEditor =JSON.parse(localStorage.getItem('workspaceEditor'))
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        this.render({ workspaceEditor:workspaceEditor&&workspaceEditor })
    }

    render({ workspaceName='',accessLevel='', description=''}) {
        this.innerHTML = `
        <div class="container">
        <h3>New Workspace:</h3>
        <div class="row">
        <form class="row g-3">
        <div class="col-12">
            <label for="staticEmail2" >Workspace Name:</label>
            <input type="text"  class="form-control" id="workspace-name-input" name="workspaceName" value="${workspaceName}" placeholder="Enter workspace name">
        </div>


        <div class="col-12">
        <label for="accessLevel" class="">Access Level:</label>
        <select class="form-select" id="accessLevel" name="accessLevel">
        <option ${accessLevel === "" && 'selected'}>Choose...</option>
        <option value="public"  ${accessLevel === "public" && 'selected'}>public</option>
        <option value="private"  ${accessLevel === "private" && 'selected'}>private</option>
      
      </select>
    </div>
       <div class="col-12">
            <label for="description" >Description:</label>
            <textarea class="form-control" id="description" rows="3" name="description">${description}</textarea>
        </div>
        <div class="col-auto">
        <button  class="btn btn-primary mb-3" id="save-ws-name-btn">Save</button>
        </div>
        </form>
        </div>
        </div>
       `

        Array.from(document.getElementsByClassName('form-control')).forEach(element => {
            element.addEventListener('input', (e) => {
                const { value, name } = e.target
                const workspaceEditor =JSON.parse(localStorage.getItem('workspaceEditor'))
        
                localStorage.setItem('workspaceEditor', JSON.stringify({...workspaceEditor,[name]: value}))
            })
        })

        document.getElementById('accessLevel').addEventListener('change', (e) => {
            const { value, id } = e.target

            const workspaceEditor =JSON.parse(localStorage.getItem('workspaceEditor'))
      
            localStorage.setItem('workspaceEditor', JSON.stringify({...workspaceEditor,[id]: value}))
          
        })



        document.getElementById('save-ws-name-btn').addEventListener('click', (e) => {
            e.preventDefault()
            const  { workspaceName , accessLevel, description } = JSON.parse(localStorage.getItem('workspaceEditor')) 
            const { screenName, localId } = JSON.parse(localStorage.getItem('auth')) 
            let update = {}
            if (accessLevel === "private") {
                debugger;
                update = {[`private/${localId}/workspaces/${workspaceName}`]: { owner:screenName, description, accessLevel } }
            } else {
                debugger;
                update = { [`public/workspaces/${workspaceName}`]: { owner:screenName, description, accessLevel } }
            }

        
            debugger;
            window.FB_DATABASE.ref('/').update(update, (error, data) => {
                if(data){
                    window.location.replace('/workspaces-list.html')
                }
                debugger;
                
            })
            
        })
    }
})