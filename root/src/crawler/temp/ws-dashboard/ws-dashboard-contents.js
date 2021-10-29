customElements.define('ws-dashboard-contents', class extends HTMLElement {
    constructor() {
        super()
    }

   async  connectedCallback() {
       await Promise.all([import('./wf-containers-content.js'),import('./wf-runners-content.js'),import('./wf-users-content.js')])
        const { workspaceDashboard: { selectedTab } } = window.pageStore.state
        this.render({ selectedTab })
        window.pageStore.subscribe(window.actionTypes.WS_DASHBOARD_TAB_CHANGED, state => {
            const { workspaceDashboard: { selectedTab } } = state
            this.render({ selectedTab })
        })
    }

    render({ selectedTab }) {
        this.innerHTML = `
<div >
       
         ${selectedTab === 'wf-container-tab' ? '<wf-containers-content></wf-containers-content>' : ''}
      
       
        ${selectedTab === 'wf-runner-tab' ? '<wf-runners-content></wf-runners-content>' : ''}
       
       
           ${selectedTab === 'wf-users-tab' ? '<wf-users-content></wf-users-content>' : ''}
       
      </div>`
    }
})









