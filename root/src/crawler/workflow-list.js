customElements.define('workflow-list', class extends HTMLElement{
    constructor(){
        super()
    }

 async   connectedCallback(){

    const resources = await import('./resources.js')
    await resources.default()
    const { workflows, auth: { idToken, localId: uid } } = window.pageStore.state

    this.uid = uid
    this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
    this.FB_DATABASE.ref('workflows').on('value',(error,snap)=>{
        debugger;
    })
  this.render({workflows})
        
    }

    render(){
        this.innerHTML=`        <top-navigation></top-navigation>

        <div class="container">
        <h3>Workflows:</h3>
        <div class="row">
     
        </div>
        </div>
        <app-footer></app-footer>`
    }
})