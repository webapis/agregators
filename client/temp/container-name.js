customElements.define('container-name',class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){

        const resources = await import('./resources.js')
        await resources.default()
        const { auth: { idToken, localId: uid },workspace:{workspaceSelected},containerName:{name}} = window.pageStore.state
        this.uid = uid
   
        document.getElementById('ws-breadcrumb').innerText=`workspace(${workspaceSelected})`
        this.innerHTML=`<div>
        <h5>New Container:</h5>

        <div class="row">
        <div class="col">
        
        <input type="email" class="form-control" id="container-name-input" placeholder="Enter container name"value=${name}>
        
        </div>
        <div class="col">
        
        <button class="btn btn-primary" id="save-container-name">Save</button>
        </div>
        </div>
        </div>
        `

        document.getElementById('container-name-input').addEventListener('input',(e)=>{
            const {value}= e.target
            window.pageStore.dispatch({type:window.actionTypes.CONTAINER_NAME_CHANGED, payload:value})
        })

        document.getElementById('save-container-name').addEventListener('click',async(e)=>{
           
            const { workspace: { workspaceSelected }, auth: { screenName }, containerName:{name}} = window.pageStore.state

           await window.firebase().ref(`workspaces/${workspaceSelected}/containers/${name}`).set({ owner: screenName })
           
                    
                    window.pageStore.dispatch({type:window.actionTypes.CONTAINER_NAME_SAVED})
                    window.location.replace('/workflow-containers.html')
                

            
        })
    }
})