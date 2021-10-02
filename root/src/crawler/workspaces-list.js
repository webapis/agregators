customElements.define('workspaces-list', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()

        const { auth: { idToken, localId: uid }, workspaceList: { workspaces } } = window.pageStore.state
        debugger;
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')

        debugger;
        this.FB_DATABASE.ref(`users/workspaces/${uid}`).on('value', (error, ws) => {
            debugger;
            const workspaces = Object.keys(ws.data)
            debugger;
            window.pageStore.dispatch({ type: window.actionTypes.WORKSPACES_FETCHED, payload: workspaces })
        })
        this.render({ workspaces })
        window.pageStore.subscribe(window.pageStore.WORKSPACES_FETCHED, state => {
            const { workspaceList: { workspaces } } = state
            this.render({ workspaces })
        })



    }

    render({ workspaces }) {
        debugger;
        this.innerHTML = `

        <div class="container">
        <h5>Workspaces:</h5>
        <div class="row" id="ws-container">
        
        </div>
        </div>
        <app-footer></app-footer>`

        workspaces&& workspaces.forEach(ws=>{
           document.getElementById('ws-container').insertAdjacentHTML(`beforeend`,`<workspace-component title=${ws}></workspace-component>`)
        })
    }
})

customElements.define('workspace-component', class extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.classList.add('col-3')
        const title = this.getAttribute('title')
        this.innerHTML = `<div>
        <a  class="btn btn-warning m-1" style="height:10vh; width:10vh;" id="${title}" href="/workspace.html">${title}</a>

        </div>`

        document.getElementById(title).addEventListener('click',(e)=>{
            const {id}= e.target
            debugger;
            window.pageStore.dispatch({type:window.actionTypes.WORKSPACE_SELECTED, payload:id})
         
        })


    }
})