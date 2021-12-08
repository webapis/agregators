customElements.define('wf-container-editor', class extends HTMLElement {
    constructor() {
        super()
    }

  async   connectedCallback() {
      await Promise.all([import('./wf-container-editor-tabs.js')])
        const { auth: { idToken, localId: uid }, workspaceDashboard: { selectedContainer } } = window.pageStore.state

        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.render({selectedContainer})

        window.pageStore.subscribe(window.actionTypes.CONTAINER_NAME_SAVED, state=>{

            const {  workspaceDashboard: { selectedContainer } } = state
            this.render({selectedContainer})
        })
     
    }

    render({selectedContainer}){
        //CONTAINER_NAME_SAVED

        this.innerHTML = `<div>
        
        <div class="row mt-1">
                <div class="col-8 ">
                 <input type="email" ${selectedContainer && 'readonly'} class="form-control" id="container-name-input" placeholder="Enter name of container" value="${selectedContainer}" />
                </div>
                <div class="col-4">
                <button  ${selectedContainer && 'disabled'} class="btn btn-secondary" id="save-container-name-btn">Save</button>
                </div>
        </div>
        ${selectedContainer !== '' ? " <wf-container-editor-tabs></wf-container-editor-tabs>" : ''}
       
        </div>
        `

        document.getElementById('container-name-input').addEventListener('input', (e) => {
            const { value } = e.target

            window.pageStore.dispatch({ type: window.actionTypes.CONTAINER_NAME_CHANGED, payload: value })
        })

        document.getElementById('save-container-name-btn').addEventListener('click', (e) => {
            const { workspaceList: { workspaceSelected }, auth: { screenName }, workspaceDashboard: { containerName } } = window.pageStore.state

            window.FB_DATABASE.ref(`workspaces/${workspaceSelected}/containers/${containerName}`).set({ owner: screenName }, (error, data) => {
                if(!error){
                    window.pageStore.dispatch({type:window.actionTypes.CONTAINER_NAME_SAVED,payload:containerName})
                }

            })  
        })
    }

})
