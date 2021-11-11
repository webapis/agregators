customElements.define('wf-containers-content', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        await Promise.all([import('./workflow-containers.js'),import('./wf-container-editor.js')])
        const { workspaceDashboard: { selectedWfContainerTab } } = window.pageStore.state

        this.render({ selectedWfContainerTab })

        window.pageStore.subscribe(window.actionTypes.WF_CONTAINER_TAB_CHANGED, state => {
            const { workspaceDashboard: { selectedWfContainerTab } } = state
            debugger;
            this.render({ selectedWfContainerTab })
        })
        window.pageStore.subscribe(window.actionTypes.WF_CONTAINER_SELECTED, state => {
            const { workspaceDashboard: { selectedWfContainerTab } } = state
            this.render({ selectedWfContainerTab })
        })
        //WF_CONTAINER_SELECTED
    }

    render({ selectedWfContainerTab }) {

        this.innerHTML = `
          <div>
          <ul class="nav justify-content-start nav-tabs mt-1">
          <li class="nav-item">
            <a class="nav-link ${selectedWfContainerTab === 'collection-tab' && 'active'}"  href="#" id="collection-tab">Containers</a>
          </li>
          <li class="nav-item">
            <a class="nav-link ${selectedWfContainerTab === 'container-editor-tab' && 'active'}" href="#" id="container-editor-tab">Create container</a>
          </li>
        </ul>
        ${selectedWfContainerTab === 'collection-tab' ? '<workflow-containers></workflow-containers>' : ''}
        ${selectedWfContainerTab === 'container-editor-tab' ? '<wf-container-editor></wf-container-editor>' : ''}
        
        </div>
        `

        const tabs = Array.from(this.getElementsByTagName('A'))
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault()
                const { id } = e.target
                window.pageStore.dispatch({ type: window.actionTypes.WF_CONTAINER_TAB_CHANGED, payload: id })

            })
        })
    }
})