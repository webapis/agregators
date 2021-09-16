customElements.define('login-page', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()

        if (document.getElementById('email')) {
            const email = document.getElementById('email').value
            const token = document.getElementById('oauthAccessToken').value
            const screenName = document.getElementById('screenName').value
            const photoUrl = document.getElementById('photoUrl').value
            const refreshToken=document.getElementById('refreshToken').value
            const idToken =document.getElementById('idToken').value
            const localId =document.getElementById('localId').value
            window.pageStore.dispatch({ type: window.actionTypes.AUTH_SUCCESS, payload: { auth: { email, token, screenName, photoUrl,refreshToken,idToken,localId } } })
            window.location.replace('/login.html')
            this.render({ authed: true, email })
        } else {
            const { auth: { email } } = window.pageStore.state
            this.render({ authed: true, email })
        }

        debugger;



        window.pageStore.subscribe(window.actionTypes.AUTH_SUCCESS, state => {

        })
    }

    render({ authed, email }) {
        this.innerHTML = `
        <top-navigation></top-navigation>
        <div class ="container">
        <div class ="row">
              ${authed ? `You are authenticated with ${email}` : 'You are not authenticated'}
        </div>
        </div>
        <app-footer></app-footer>
        `
    }
})