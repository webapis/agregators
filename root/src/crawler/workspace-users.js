customElements.define('workspace-users', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
       
        const resources = await import('./resources.js')
        await resources.default()

        this.innerHTML=`<div>
        <h5>Workspace Users:</h5>
        </div>`
    }
})