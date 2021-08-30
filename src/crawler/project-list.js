customElements.define('project-list', class extends HTMLElement {
    constructor() {
        super()
        this.innerHTML='<div>Loading...</div>'
    }

    async connectedCallback() {
        const resources= await import('./resources.js')
        await resources.default()
     
            this.render()
     


    }
    render() {
        this.innerHTML = `
        <top-navigation></top-navigation>
        
        <div class="container">
        <div id="project-list-container" class="row">  
        <legend>Project Templates:</legend>
        <div id="loaing">Loading....</div>
        </div>
        </div>
        
        <app-footer></app-footer>
        `
        firebase
            .database()
            .ref(`projects`).on('child_added', data => {
                const projectName = data.key;
                const projectDescription = data.val()['description']
                const element = document.createElement('project-card')
                element.setAttribute('project-name', projectName)
                element.setAttribute('description', projectDescription)
                element.classList.add('col-3')
                document.getElementById('project-list-container').appendChild(element)
                document.getElementById('loaing').style='display:none'
            })
    }
})



