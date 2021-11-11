
customElements.define('home-component', class extends HTMLElement {
    constructor() {
        super()
    }
    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()
       

        const auth = window.pageStore.state.auth
        const isValid = window.pageStore.state.auth ? new Date(parseInt(auth.expiresIn) * 1000) < Date.now() : false
        debugger;
        if (isValid) {
            this.innerHTML = `<div>
           <signed-in-as></signed-in-as>
           
            <home-card title="Workspaces" page-link="/workspaces-list.html" link-id="workspace"></home-card>
       
            </div>`
        } else {
            this.innerHTML = `<div>
            
            <home-card title="Sign in" page-link="/.netlify/functions/auth" link-id="signin"></home-card>
            </div>`
        }

    }
})

//     <home-card title="Sign in" page-link="/login.html?authed=false" link-id="signin"></home-card>
customElements.define('home-card', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const title = this.getAttribute('title')
        const pageLink = this.getAttribute('page-link')
        const id =this.getAttribute('link-id')
        this.innerHTML = `<div>
        <a class="btn btn-warning m-1" style="height:10vh; width:10vh;" href="${pageLink}" id=${id}>${title}</a>
        </div>`
    }
})