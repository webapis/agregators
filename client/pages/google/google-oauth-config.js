customElements.define('google-oauth-config', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('/js/resources.js')
        await resources.default()

        const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
        const { localId: uid } = JSON.parse(localStorage.getItem('auth'))
        this.uid = uid

        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceName})`

        this.render()
    }

    render() {
        !localStorage.getItem('google') && localStorage.setItem('google', JSON.stringify({ googleAuthConfig: { scopes: '', editable: true, googleOauth: '' } }))
        const { googleAuthConfig: { scopes, editable, googleOauth } } = JSON.parse(localStorage.getItem('google'))

        this.innerHTML = `<div>
        <h5>Google OAuth Config</h5>
        <div class="mb-3">
        <label for="google-scopes-input" class="form-label">Google oauth scopes:</label>
        <textarea class="form-control" id="google-scopes-input" rows="3" ${!editable && "disabled"}>${scopes}</textarea>
        </div>
        <div class="col-auto">
        <button  class="btn btn-primary mb-3" id="save-scopes-btn" ${!editable && "hidden"}>Save</button>
        <button  class="btn btn-primary mb-3" id="edit-scopes-btn" ${editable && "hidden"}>Edit</button>
        <button  class="btn btn-primary mb-3"id="authenticate-btn" ${(editable || googleOauth) && 'disabled'}>${googleOauth ? 'Authenticated' : 'Authenticate'}</button>
        <button  class="btn btn-primary mb-3" id="revoke-scopes-btn">Revoke</button>
        </div>
        </div>`
        document.getElementById('google-scopes-input').addEventListener('input', (e) => {
            const { value } = e.target
            const google = JSON.parse(localStorage.getItem('google'))
            localStorage.setItem('google', JSON.stringify({ ...google, googleAuthConfig: { ...google.googleAuthConfig, scopes: value } }))

        })

        document.getElementById('save-scopes-btn').addEventListener('click', async (e) => {
            
            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            const { googleAuthConfig: { scopes } } = JSON.parse(localStorage.getItem('google'))
            await window.firebase().ref(`workspaces/${workspaceName}/oauth/scopes/google`).update({ scopes })

            
            const google = JSON.parse(localStorage.getItem('google'))
            
            localStorage.setItem('google', JSON.stringify({ ...google, googleAuthConfig: { ...google.googleAuthConfig, scopes, editable: false } }))
            
            location.reload()




        })
        document.getElementById('edit-scopes-btn').addEventListener('click', (e) => {
            const google = JSON.parse(localStorage.getItem('google'))
            
            localStorage.setItem('google', JSON.stringify({ ...google, googleAuthConfig: { ...google.googleAuthConfig, scopes, editable: true } }))
            location.reload()
            


            
        })
        document.getElementById('authenticate-btn').addEventListener('click', (e) => {

            const { title: workspaceName } = JSON.parse(localStorage.getItem('workspace'))
            const { idToken, localId: uid } = JSON.parse(localStorage.getItem('auth'))

            const client_id = "117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com"
            const redirect_url = `${window.location.origin}/google-auth-callback`
            

            const state = `${workspaceName}--xxx--${uid}--xxx--${idToken}`
            const authRequestUri = `/google-auth?scope=${scopes}&client_id=${client_id}&redirect_url=${redirect_url}&state=${state}`
            
            window.location.replace(authRequestUri)
        })

    }
})