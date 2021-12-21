customElements.define('google-oauth-config', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()
        const { auth: { idToken, localId: uid,googleOauth }, workspace: { workspaceSelected: { title: workspaceName } }, googleAuthConfig } = window.pageStore.state
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`

        this.render({ googleAuthConfig,googleOauth })
    }

    render({ googleAuthConfig,googleOauth }) {
        const { scopes } = googleAuthConfig
        this.innerHTML = `<div>
        <h5>Google OAuth Config</h5>
        <div class="mb-3">
        <label for="google-scopes-input" class="form-label">Google oauth scopes:</label>
        <textarea class="form-control" id="google-scopes-input" rows="3">${scopes}</textarea>
        </div>
        <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-3" id="save-scopes-btn">Save</button>
        <button type="submit" class="btn btn-primary mb-3"id="authenticate-btn" ${googleOauth && 'disabled'}>${googleOauth? 'Authenticated':'Authenticate'}</button>
        <button type="submit" class="btn btn-primary mb-3" id="revoke-scopes-btn">Revoke</button>
        </div>
        </div>`
        document.getElementById('google-scopes-input').addEventListener('input', (e) => {
            const { value } = e.target
            window.pageStore.dispatch({ type: window.actionTypes.GOOGLE_AUTH_SCOPE_CHANGED, payload: value })
        })

        document.getElementById('save-scopes-btn').addEventListener('click', (e) => {
            const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, googleAuthConfig: { scopes } } = window.pageStore.state
            debugger;
            window.FB_DATABASE.ref(`workspaces/${workspaceName}/oauth/scopes/google`).update({ scopes }, (error, result) => {
                debugger;
            })
            debugger;
        })

        document.getElementById('authenticate-btn').addEventListener('click',(e)=>{
            const { auth: { idToken, localId: uid }, workspace: { workspaceSelected: { title: workspaceName } }, googleAuthConfig: { scopes }  } = window.pageStore.state
            const client_id = "117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com"
            const redirect_url = `${window.location.origin}/google-auth-callback`
            debugger;
        
            const state = `${workspaceName}--xxx--${uid}--xxx--${idToken}`
            const authRequestUri = `/google-auth?scope=${scopes}&client_id=${client_id}&redirect_url=${redirect_url}&state=${state}`//`https://accounts.google.com/o/oauth2/v2/auth?scope=${scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${redirect_url}&client_id=${client_id}`
            debugger;
            window.location.replace(authRequestUri)
        })

    }
})