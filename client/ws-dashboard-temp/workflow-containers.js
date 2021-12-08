customElements.define('workflow-containers', class extends HTMLElement {
    constructor() {
        super()
    }
   async connectedCallback() {
       await Promise.all([import('./wf-container.js')])
        this.innerHTML = `<div id="containers-collection">Workflow containers</div>`
        const { workspaceList: { workspaceSelected }, auth: { idToken, localId: uid } } = window.pageStore.state
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        window.FB_DATABASE.ref(`workspaces/${workspaceSelected}/containers`).on('value', (error, response) => {
            const containers = Object.keys(response.data)
            window.pageStore.dispatch({ type: window.actionTypes.CONTAINERS_FETCHED, payload: containers })


        })
        window.pageStore.subscribe(window.actionTypes.CONTAINERS_FETCHED, state => {
            const { workspaceDashboard: { containers } } = state

            this.render({ containers })
        })


    }

    render({ containers }) {

        document.getElementById('containers-collection').innerHTML = ''

        containers.forEach(c => {
            document.getElementById('containers-collection').insertAdjacentHTML('beforeend', `<wf-container title="${c}"></wf-container>`)
        })
    }
})
