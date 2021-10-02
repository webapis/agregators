customElements.define('home-component', class extends HTMLElement{
    constructor(){
        super()
    }
   async connectedCallback(){
        const resources = await import('./resources.js')
        await resources.default()
        this.innerHTML=`<div>
        <home-card title="Workspaces" page-link="/workspaces-list.html"></home-card>
        <home-card title="Sign in" page-link="/login.html?authed=false"></home-card>
        </div>`
    }
})


customElements.define('home-card', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const title =this.getAttribute('title')
        const pageLink =this.getAttribute('page-link')
        this.innerHTML=`<div>
        <a class="btn btn-warning m-1" style="height:10vh; width:10vh;" href="${pageLink}">${title}</a>
        </div>`
    }
})