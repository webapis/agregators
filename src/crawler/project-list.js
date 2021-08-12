customElements.define('project-list', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { projects } = window.pageStore.state
        this.render({ projects })
    }
    render({ projects }) {
        this.innerHTML = `<div class="container">
        <fieldset id="project-list-container">  
        <legend>Projects:</legend>
        </fieldset>
        </div>`
        projects.forEach(p => {
            const element = document.createElement('div')
            element.insertAdjacentHTML('afterbegin', `<div>
            <a href="#" id=${p.projectName}>${p.projectName}</a>
            </div>`)
            element.addEventListener('click', (e) => {
                const { id } = e.target
                window.pageStore.dispatch({
                    type: window.actionTypes.CONTENT_VIEW_CHANGED,
                    payload: { contentView: 'project-dashboard', selectedDashboard: id }
                });
            })
            document.getElementById('project-list-container').appendChild(element)
        })
    }
})




customElements.define('project-card', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const projectName = this.getAttribute('project-name')
        this.innerHTML = `<div>
        <a href="#" id=${projectName}>${projectName}</a>
        </div>`
        document.getElementById(projectName).addEventListener('click', (e) => {
            const { id } = e.target
            window.pageStore.dispatch({
                type: window.actionTypes.CONTENT_VIEW_CHANGED,
                payload: { contentView: 'project-dashboard', selectedDashboard: id }
            });
        })
    }
})