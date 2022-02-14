customElements.define('google-oauth-page', class extends HTMLElement {

    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()

debugger;
        if (document.getElementById('access_token')) {
            const access_token = document.getElementById('access_token').value
            const refresh_token = document.getElementById('refresh_token').value
            const scope = document.getElementById('scope').value

            const google = JSON.parse(localStorage.getItem('google'))
            localStorage.setItem('google',JSON.stringify({...google,googleAuthConfig:{...google.googleAuthConfig,googleOauth:{access_token, refresh_token, scope }}}))
            window.location.replace('/google-oauth-config.html')
        }
    }
})