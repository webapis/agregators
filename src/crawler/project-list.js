customElements.define('project-list', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        window.addEventListener('load', () => {
            this.render()
        })


    }
    render() {
        this.innerHTML = `<div class="container">
        <div id="project-list-container" class="row">  
        <legend>Project Templates:</legend>
        </div>
        </div>`
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
            })
    }
})




