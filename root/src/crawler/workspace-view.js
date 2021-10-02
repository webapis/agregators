customElements.define('workspace-view', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
        const resources = await import('./resources.js')
        await resources.default()

        const {workspace:{workspaceSelected}}=window.pageStore.state

        document.getElementById('ws-breadcrumb').innerText=`Workspace(${workspaceSelected})`
        this.innerHTML=`
        <div class="d-flex">
        <h5>Workspace:</h5>
        <h5 class="text-muted text-uppercase mx-2">${workspaceSelected}</h5>
        </div>
        <div class="row">
        <workspace-card title="Containers" page-link="./workflow-containers.html"></workspace-card>
        <workspace-card title="Runners" page-link="./container-runners.html"></workspace-card>
        <workspace-card title="Users" page-link="./workspace-users.html"></workspace-card>
        </div>`
    }
})




customElements.define('workspace-card', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        this.classList.add('col-3')
        const title =this.getAttribute('title')
        const pageLink =this.getAttribute('page-link')
        this.innerHTML=`<div>
        <a class="btn btn-warning" style="height:10vh; width:10vh;" href="${pageLink}">${title}</a>
        </div>`
    }
})