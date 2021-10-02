customElements.define('workspace-name', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()
        const { auth: { idToken, localId: uid } } = window.pageStore.state

        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.render()
    }

    render() {
        this.innerHTML = `
        <top-navigation></top-navigation>
        <div class="container">
        <h3>Workspace Name:</h3>
        <div class="row">
        <form class="row g-3">
        <div class="col-auto">
            <label for="staticEmail2" class="visually-hidden">Email</label>
            <input type="text"  class="form-control" id="workspace-name-input" value="" placeholder='Enter unique workspace name'>
        </div>

        <div class="col-auto">
        <button  class="btn btn-primary mb-3" id="save-ws-name-btn">Save</button>
        </div>
        </form>
        </div>
        </div>
       `

        document.getElementById('workspace-name-input').addEventListener('input', (e) => {
            const { value } = e.target
            window.pageStore.dispatch({ type: window.actionTypes.WORKSPACE_NAME_CHANGED, payload: value })
        })

        document.getElementById('save-ws-name-btn').addEventListener('click', (e) => {
            e.preventDefault()
            const { workspaceName, auth: { screenName, localId } } = window.pageStore.state

            this.FB_DATABASE.ref('/').update({ [`workspaces/${workspaceName}`]: { owner: screenName }, [`users/workspaces/${localId}/${workspaceName}`]: true}, (error, data) => {
                debugger;
                window.location.replace('/workspaces-list.html')
            })

        })
    }
})