customElements.define('project-card', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const projectName = this.getAttribute('project-name')
        this.innerHTML = `<div>
        <div class="card" style="">
        <img src="https://nocodewebscraping.com/wp-content/uploads/2016/03/extract-multiple-web-pages-into-excel.jpg" class="card-img-top img-thumbnail" height="70" alt="...">
        <div class="card-body">
        
        <h6 class="card-subtitle mb-2 text-muted">Project name:</h6>
          <h5 class="card-title">${projectName}</h5>
         
          <h6 class="card-subtitle mb-2 text-muted">Description:</h6>
          <p class="card-text">Console for managing data collection</p>
          <a id="project-view-link-${projectName}" href="#" class="btn btn-primary">Dashboard </a>
        </div>
      </div>   </div>`

        document.getElementById(`project-view-link-${projectName}`).addEventListener('click', e => {
            const { id } = e.target;
            e.preventDefault();
            import('./project-detail.js').then(() => {
                window.pageStore.dispatch({
                    type: window.actionTypes.PROJECT_NAME_SELECTED,
                    payload: projectName
                });
            });
        });
    }
})  