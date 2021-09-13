customElements.define('app-footer', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>App Footer</div>`
    }
})