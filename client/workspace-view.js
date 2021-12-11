customElements.define('workspace-view', class extends HTMLElement{
    constructor(){
        super()
    }

   async connectedCallback(){
    this.innerHTML=`loading...`
        const resources = await import('./resources.js')
        await resources.default()
        const { auth: { idToken, localId: uid },workspace:{workspaceSelected:{title}}} = window.pageStore.state
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
     

        document.getElementById('ws-breadcrumb').innerText=`Workspace(${title})`

        this.innerHTML=`
     
        <div class="d-flex">
        <h5>Workspace:</h5>
        <h5 class="text-muted text-uppercase mx-2">${title}</h5>
        </div>
        <div class="row">
        <workspace-card title="Tasks Configuration" page-link="./workspace-tasks.html" link-id="tasks-card"></workspace-card>
   
        <workspace-card title="Users" page-link="./workspace-users.html" link-id="users-card"></workspace-card>
        <workspace-card title="Task Runner" page-link="./task-runner.html" link-id="task-runner-card"></workspace-card>
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
        const linkId=this.getAttribute('link-id')
        this.innerHTML=`<div>
        <a class="btn btn-warning" style="height:10vh; width:10vh;" href="${pageLink}" id="${linkId}">${title}</a>
        </div>`
    }
})