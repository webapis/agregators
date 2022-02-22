

customElements.define('enable-workflows', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { screenName } = JSON.parse(localStorage.getItem('auth'))
        this.innerHTML = `<a href="https://github.com/${screenName}/workflow_runner/actions"  target="_blank" id="enable-workflow-link">Enable Workflows</a>`
    }
})
