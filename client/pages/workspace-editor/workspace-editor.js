customElements.define('workspace-editor', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `loading...`
        const resources = await import('/js/resources.js')
        await resources.default()

        const {localId: uid } = JSON.parse(localStorage.getItem('auth'))

        const workspace = JSON.parse(localStorage.getItem('workspace'))

        this.uid = uid
      
        
        document.getElementById('workspace-breadcrumb').innerText = workspace.title !== '' ? `Update Workspace(${workspace.title})` : 'New Workspace'
        this.render(workspace)
    }

    render({ title, accessLevel, description }) {
        this.innerHTML = `
        <div class="container">
        <h3>New Workspace:</h3>
        <div class="row">
   
        <form class="row g-3">
        <div class="col-12">
            <label for="staticEmail2" >Workspace Name:</label>
            <input type="text"  class="form-control" id="workspace-name-input" name="title" value="${title}" placeholder="Enter workspace name" ${title != '' && 'readonly'}>
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
                const workspace = JSON.parse(localStorage.getItem('workspace'))

                localStorage.setItem('workspace', JSON.stringify({ ...workspace, [name]: value }))
            })
        })

        document.getElementById('accessLevel').addEventListener('change', (e) => {
            const { value, id } = e.target

            const workspace = JSON.parse(localStorage.getItem('workspace'))

            localStorage.setItem('workspace', JSON.stringify({ ...workspace, [id]: value }))

        })



        document.getElementById('save-ws-name-btn').addEventListener('click', async (e) => {
            e.preventDefault()
            const { title, accessLevel, description } = JSON.parse(localStorage.getItem('workspace'))
            const { screenName, localId } = JSON.parse(localStorage.getItem('auth'))
            let update = {}
            if (accessLevel === "private") {
                
                update = { [`private/${localId}/workspaces/${title}`]: { owner: screenName, description, accessLevel }, [`public/workspaces/${title}`]: null }
            } else {
                
                update = { [`public/workspaces/${title}`]: { owner: screenName, description, accessLevel }, [`private/${localId}/workspaces/${title}`]: null }
            }


            
            const data = await window.firebase().ref('/').update(update)
            
            if (data) {
                window.location.replace('../workspaces-list/workspaces-list.html')
            }
            
        })
    }
})