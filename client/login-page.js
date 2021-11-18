customElements.define('login-page', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()

        if (document.getElementById('email')) {
            debugger;
            const email = document.getElementById('email').value
            const token = document.getElementById('oauthAccessToken').value
            const screenName = document.getElementById('screenName').value
            const photoUrl = document.getElementById('photoUrl').value
            const refreshToken = document.getElementById('refreshToken').value
            const idToken = document.getElementById('idToken').value
            const localId = document.getElementById('localId').value
            const expiresIn = document.getElementById('expiresIn').value
            this.uid = localId
            window.pageStore.dispatch({ type: window.actionTypes.AUTH_SUCCESS, payload: { auth: { email, token, screenName, photoUrl, refreshToken, idToken, localId, api_key: window.webapikey, timestamp: Date.now() + 3600000,expiresIn } } })
           
            window.location.replace('/')
            
debugger;
        } else {
            debugger;
            const { auth: { email } } = window.pageStore.state
            this.render({ authed: true, email })
        }





        window.pageStore.subscribe(window.actionTypes.AUTH_SUCCESS, state => {

        })
    }

    render({ authed, email }) {
        this.innerHTML = `

        <div class ="container">
        <div class ="row">
              ${authed ? `You are authenticated with ${email}` : 'You are not authenticated'}
        </div>
        </div>
        <app-footer></app-footer>
        `
    }
})