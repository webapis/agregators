customElements.define('wf-runners-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `wf-runners-contnet`
    }
})