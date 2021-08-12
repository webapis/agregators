customElements.define('app-content', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const {contentView} = window.pageStore.state
        this.render({contentView})
        window.pageStore.subscribe(window.actionTypes.CONTENT_VIEW_CHANGED, state => {
            const { contentView } = state
            this.render({contentView})
        })
    }

    render({ contentView = 'home' }) {
        this.innerHTML = `<div>
        ${contentView === 'projects' ? '<project-list ></project-list>' : ''}
        ${contentView === 'project-editor' ? '<project-editor></project-editor>' : ''}
        ${contentView === 'project-dashboard' ? '<project-dashboard></project-dashboard>' : ''}
        ${contentView === 'home' ? '<home-page></home-page>' : ''}
        </div>`
    }
})