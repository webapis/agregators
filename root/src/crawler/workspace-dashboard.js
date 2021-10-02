customElements.define('workspace-dashboard', class extends HTMLElement {
    constructor() {
        super()
    }


    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()
        await Promise.all([import('./ws-dashboard/ws-dashboard-tabs.js'),import('./ws-dashboard/ws-dashboard-contents.js')])
        const { workspaceList: { workspaceSelected } } = window.pageStore.state
        this.render({ workspaceSelected })
    }

    render({ workspaceSelected }) {
        this.innerHTML = `
        <top-navigation></top-navigation>
        <div class="container">
        <h3>Workspace Dashboard:</h3>
        <h4 class="fw-normal"> ${workspaceSelected}</h4>
        <div class="row">
        <ws-dashboard-tabs></ws-dashboard-tabs>
        <ws-dashboard-contents></ws-dashboard-contents>
        </div>
        </div>
        `
    }
})





















