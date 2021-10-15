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

            this.uid = localId
            window.pageStore.dispatch({ type: window.actionTypes.AUTH_SUCCESS, payload: { auth: { email, token, screenName, photoUrl, refreshToken, idToken, localId, api_key: 'AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA', timestamp: Date.now() + 3600000 } } })
            // this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
            // const publicData ={email,screenName,photoUrl}
            // const privateData={token,refreshToken,idToken}
            // this.FB_DATABASE.ref(`users`).update({[`private/${localId}`]:privateData,[`public/${localId}`]:publicData}, (error, data) => {
            //     debugger;
            //     if (error) {
                    
            //     } else {
            //         debugger;

            //         window.location.replace('/login.html')
            //         this.render({ authed: true, email })
            //     }
            // })

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