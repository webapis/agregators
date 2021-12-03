customElements.define('workspace-editor', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        this.innerHTML = `loading...`
        const resources = await import('./resources.js')
        await resources.default()
        const { auth: { idToken, localId: uid }, workspaceEditor } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        this.render({ workspaceEditor })
    }

    render({ workspaceEditor }) {

        const { workspaceName, accessLevel, description } = workspaceEditor
        this.innerHTML = `
       <signed-in-as></signed-in-as>
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
    </div>${description && `  <div class="col-12">
    <label for="description" >Description:</label>
    <textarea class="form-control" id="description" rows="3" name="description">${description}</textarea>
</div>`}
     
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
                window.pageStore.dispatch({ type: window.actionTypes.WORKSPACE_EDITOR_INPUT_CHANGED, payload: { [name]: value } })
            })
        })

        document.getElementById('accessLevel').addEventListener('change', (e) => {
            const { value, id } = e.target
            window.pageStore.dispatch({ type: window.actionTypes.WORKSPACE_EDITOR_INPUT_CHANGED, payload: { [id]: value } })
            debugger;
        })

        document.getElementById('save-ws-name-btn').addEventListener('click', (e) => {
            e.preventDefault()
            const { workspaceEditor: { workspaceName, description, accessLevel }, auth: { screenName, localId } } = window.pageStore.state

            let update = {}
            if (accessLevel === "private") {
                debugger;
                update = { [`private/${localId}/workspaces/${workspaceName}`]: { owner: screenName, description, accessLevel } }
            } else {
                debugger;
                update = { [`public/workspaces/${workspaceName}`]: { owner: screenName, description, accessLevel } }
            }

            debugger;
            this.FB_DATABASE.ref('/').update(update, (error, data) => {
                debugger;
                window.location.replace('/workspaces-list.html')
            })

        })
    }
})