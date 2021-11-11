customElements.define('index-page', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources= await import('./resources.js')
        await resources.default()
        this.innerHTML = `
            <top-navigation></top-navigation>
            <div>Home page</div>
            <app-footer></app-footer>
            `


    }
})