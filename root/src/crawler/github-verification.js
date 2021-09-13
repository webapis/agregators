customElements.define('github-verification', class extends HTMLElement {
    constructor() {
        super()
    }

   async connectedCallback() {
        const resources= await import('./resources.js')
        await resources.default()
       // document.body.insertAdjacentHTML('beforebegin','<top-navigation></top-navigation>')
        this.innerHTML = `  <top-navigation></top-navigation>
        <div class ="container" id="root">
        <label for="user_code" class="form-label">User verification code:</label>
        <input class="form-control" type="text" id="user_code" readonly>

        <label for="verification_url" class="form-label">Please, click the following link and enter above verification code:</label>
        <a class="nav-link" href="#" id="verification_uri"> Verification link </a>
        </div>
        <app-footer></app-footer>`
    }
})