customElements.define('ws-dashboard-tabs', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { workspaceDashboard: { selectedTab } } = window.pageStore.state
        this.render({ selectedTab })
        window.pageStore.subscribe(window.actionTypes.WS_DASHBOARD_TAB_CHANGED, state => {
            const { workspaceDashboard: { selectedTab } } = state
            this.render({ selectedTab })
        })
    }
    render({ selectedTab }) {
        this.innerHTML = `<ul class="nav nav-tabs">
      
        <li class="nav-item">
          <a class="nav-link ${selectedTab === 'wf-container-tab' && 'active'}" href="#" id="wf-container-tab">wf containers</a>
        </li>
        <li class="nav-item ">
          <a class="nav-link ${selectedTab === 'wf-runner-tab' && 'active'}" href="#" id="wf-runner-tab">workflow runners</a>
        </li>
        <li class="nav-item">
          <a class="nav-link  ${selectedTab === 'wf-users-tab' && 'active'}" id="wf-users-tab">workflow users</a>
        </li>
      </ul>`

        const elements = Array.from(this.getElementsByTagName('A'))
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                const { id } = e.target
                window.pageStore.dispatch({ type: window.actionTypes.WS_DASHBOARD_TAB_CHANGED, payload: id })
            })
        })

    }
})