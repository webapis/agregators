customElements.define('login-page', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('../../js/resources.js')

        debugger;
        await resources.default()

        if (document.getElementById('email')) {
            debugger;
            const email = document.getElementById('email').value
            const token = document.getElementById('token').value
            const screenName = document.getElementById('screenName').value
            const photoUrl = document.getElementById('photoUrl').value
            const refreshToken = document.getElementById('refreshToken').value
            const idToken = document.getElementById('idToken').value
            const localId = document.getElementById('localId').value
            const expiresIn =parseInt( document.getElementById('expiresIn').value)
            const timestamp = parseInt( document.getElementById('timestamp').value)
            this.uid = localId
            localStorage.setItem('auth',JSON.stringify({ email, token, screenName, photoUrl, refreshToken, idToken, localId, api_key: window.webapikey, timestamp,expiresIn }))
            window.location.replace('/')
            
debugger;
        } 
       
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