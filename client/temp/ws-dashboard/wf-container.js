
customElements.define('wf-container', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const title = this.getAttribute('title')
        this.innerHTML = `<div>
        <button class="btn btn-warning m-1" id="${title}">${title}</button>
        </div>`

        document.getElementById(title).addEventListener('click', (e) => {
            const { id } = e.target
            window.pageStore.dispatch({ type: window.actionTypes.WF_CONTAINER_SELECTED, payload: id })
        })
    }
})
