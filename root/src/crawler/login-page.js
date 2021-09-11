customElements.define('login-page', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources= await import('./resources.js')
        await resources.default()
        this.innerHTML = `
        <top-navigation></top-navigation>
        <div class ="container">
        <div class ="row">
        <div class="col d-flex justify-content-center pt-5">
        <button class="btn btn-outline-secondary" id="google-sign-in-btn"> 
        <img width="35" src="data:image/png;base64,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"/>
         Sign in with Github
        </button>        
        </div>
        </div>
        <app-footer></app-footer>
        `
     
        document.getElementById('google-sign-in-btn').addEventListener('click', () => {
            window.googleAuth({ navAfterAuth: '/' })
        })
    }
})