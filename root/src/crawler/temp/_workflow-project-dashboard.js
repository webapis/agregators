customElements.define('workflow-project-dashboard', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `<div>Workflow project dahsboard</div>`
    }
})