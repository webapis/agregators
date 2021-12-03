customElements.define('wf-users-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `wf-users-content`
    }
})