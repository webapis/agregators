customElements.define('workflow-containers', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()
        const { workspace: { workspaceSelected }, auth: { idToken, localId: uid } } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.render({ workspaceSelected })
    }

    render({ workspaceSelected }) {

        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceSelected})`

        this.innerHTML = `<div>
        <h5>Containers:</h5>
        <a class="btn btn-outline-secondary" href="/container-name.html">Create Container</a>
        <div id="containers" class="row"></div>
        </div>`
        document.getElementById('containers').innerHTML = `Loading...`
        this.FB_DATABASE.ref(`workspaces/${workspaceSelected}/containers`).on('value', (error, response) => {
            debugger;
            if(response.data){
                const containers = Object.keys(response.data)
                document.getElementById('containers').innerHTML = ``
                debugger;
                containers.forEach(c => {
                    document.getElementById('containers').insertAdjacentHTML('beforeend', `<container-card title="${c}" page-link="/workflow-tree.html">${c}</container-card>`)
                })
                window.pageStore.dispatch({ type: window.actionTypes.CONTAINERS_FETCHED, payload: containers })

            } else{
                document.getElementById('containers').innerHTML = `No containers available`
            }
        

        })


    }
})


customElements.define('container-card', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const title = this.getAttribute('title')
        const pageLink = this.getAttribute('page-link')
        this.classList.add('col-3')
        this.innerHTML = `<div>
        <a class="btn btn-warning m-1" style="height:10vh; width:10vh;" href="${pageLink}" id="${title}">${title}</a>
        </div>`

        document.getElementById(title).addEventListener('click', (e) => {
            const { id } = e.target

            window.pageStore.dispatch({ type: window.actionTypes.WF_CONTAINER_SELECTED, payload: id })
        })

    }
})