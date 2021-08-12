customElements.define('project-dashboard', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { selectedDashboard } = window.pageStore.state
        debugger;
        this.render({ selectedDashboard })
    }

    render({ selectedDashboard }) {
        this.innerHTML = `<div class="container">
        <fieldset>
        <legend>${selectedDashboard}</legend>
        
        </fieldset>
        </div>`
    }
})