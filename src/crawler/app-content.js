customElements.define('app-content', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const { contentView, error } = window.pageStore.state
        this.render({ contentView, error })
        window.pageStore.subscribe(window.actionTypes.CONTENT_VIEW_CHANGED, state => {
            const { contentView, error } = state
            this.render({ contentView, error })
        })
        window.pageStore.subscribe(window.actionTypes.AUTH_SUCCESS, state => {
            const { contentView, error } = state
            this.render({ contentView, error })
        })

        window.pageStore.subscribe(window.actionTypes.ERROR, state => {
            const { error,contentView } = state
            this.render({ error, contentView })
        })

        window.pageStore.subscribe(window.actionTypes.PROJECT_SAVED, state => {
            const { error,contentView } = state
            this.render({ error, contentView })
        })
    }

    render({ contentView = 'home', error }) {
        this.innerHTML = `<div>
        ${contentView === 'projects' ? '<project-list ></project-list>' : ''}
        ${contentView === 'project-editor' ? '<project-editor></project-editor>' : ''}
        ${contentView === 'project-dashboard' ? '<project-dashboard></project-dashboard>' : ''}
        ${contentView === 'home' ? '<home-page></home-page>' : ''}
        ${contentView === 'login' ? '<login-page></login-page>' : ''}
        ${error ? '<error-component></error-component>' : ''}
        </div>`
    }
})



customElements.define('error-component', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { error } = window.pageStore.state

        if (error) {
            this.render({ error })
        }
        window.pageStore.subscribe(window.actionTypes.ERROR, state => {
            const { error } = state
            this.render({ error })
        })
    }

    render({ error }) {
        this.innerHTML = `<div>${error}</div>`
    }
})