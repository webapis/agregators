
customElements.define('wf-container-editor-tabs', class extends HTMLElement {
    constructor() {
        super()
    }

   async connectedCallback() {
       await Promise.all([import('./workflows-list.js'),import('./workflow-editor.js')])
        const { workspaceDashboard: { selectedWfContainerEditorTab } } = window.pageStore.state
        this.render({ selectedWfContainerEditorTab })

        window.pageStore.subscribe(window.actionTypes.WF_CONTAINER_EDITOR_TAB_CHANGED, state => {
            const { workspaceDashboard: { selectedWfContainerEditorTab } } = state
            debugger;
            this.render({ selectedWfContainerEditorTab })
        })
    }

    render({ selectedWfContainerEditorTab }) {
        this.innerHTML = `<div>
        <nav class="nav">
         <button class="btn btn-link nav-link ${selectedWfContainerEditorTab === 'workflows-tab' && 'active text-decoration-underline'}" aria-current="page"  id="workflows-tab">Workflows</button>
         <button class="btn btn-link nav-link  ${selectedWfContainerEditorTab === 'workflow-editor-tab' && 'active text-decoration-underline'}"  id="workflow-editor-tab">Workflow Editor</button>
        </nav>
      ${selectedWfContainerEditorTab === 'workflows-tab' ? ' <workflows-list></workflows-list>' : ''}
    
        ${selectedWfContainerEditorTab === 'workflow-editor-tab' ? '<workflow-editor></workflow-editor>' : ''}
        </div>`

        const elements = Array.from(this.getElementsByTagName('BUTTON'))
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault()
                const { id } = e.target;
                window.pageStore.dispatch({ type: window.actionTypes.WF_CONTAINER_EDITOR_TAB_CHANGED, payload: id })
            })
        })
    }
})
