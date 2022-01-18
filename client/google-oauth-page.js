customElements.define('google-oauth-page', class extends HTMLElement {

    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()
       // const { auth: { idToken, localId: uid }, workspace: { workspaceSelected }, containerName: { name } } = window.pageStore.state
debugger;
        if (document.getElementById('access_token')) {
            const access_token = document.getElementById('access_token').value
            const refresh_token = document.getElementById('refresh_token').value
            const scope = document.getElementById('scope').value
           // const { googleAuthConfig: { scopes } } = JSON.parse(localStorage.getItem('google'))
           // window.pageStore.dispatch({ type: window.actionTypes.GOOGLE_AUTH_SUCCESS, payload: { access_token, refresh_token, scope } })
            const google = JSON.parse(localStorage.getItem('google'))
            localStorage.setItem('google',JSON.stringify({...google,googleAuthConfig:{...google.googleAuthConfig,googleOauth:{access_token, refresh_token, scope }}}))
            window.location.replace('/google-oauth-config.html')
        }
    }
})