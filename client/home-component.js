
customElements.define('home-component', class extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {

        this.innerHTML = `loading...`
      
      
            const resources = await import('./resources.js')
            //const {default:reducer} = await import('./state/reducers/homeComponentReducer.js')
            await resources.default()


            const auth = JSON.parse(localStorage.getItem('auth'))
            const isValid = auth ? new Date(parseInt(auth.expiresIn) * 1000) < Date.now() : false
            debugger;
            if (isValid) {
                const {  idToken, localId: uid } =auth
                this.uid = uid
                window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
                this.innerHTML = `<div>
            
               
                <home-card title="Workspaces" page-link="/workspaces-list.html" link-id="workspace"></home-card>
               
                </div>`
            } else {
                this.innerHTML = `<div>
                
                <home-card title="Sign in" page-link="/.netlify/functions/auth" link-id="signin"></home-card>
                
                </div>`
            }

      

        debugger;



    }
})


customElements.define('home-card', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const title = this.getAttribute('title')
        const pageLink = this.getAttribute('page-link')
        const id = this.getAttribute('link-id')
        this.innerHTML = `<div>
        <a class="btn btn-warning m-1" style="height:10vh; width:10vh;" href="${pageLink}" id=${id}>${title}</a>
        </div>`
    }
})