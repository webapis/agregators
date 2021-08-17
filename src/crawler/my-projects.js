customElements.define('my-projects', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        window.addEventListener('load', () => {
            this.render()
        })


    }
    render() {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                var uid = user.uid;

                // firebase
                firebase.database()
                    .ref(`myprojects/${uid}`).on('child_added', data => {
                        const projectName = data.key;
                        const projectDescription = data.val()['description']
                        const element = document.createElement('project-card')
                        element.setAttribute('project-name', projectName)
                        element.setAttribute('description', projectDescription)
                        element.classList.add('col-3')
                        document.getElementById('project-list-container').appendChild(element)
                        document.getElementById('loaing').style='display:none'
                    })
                // ...
            } else {
                
                // User is signed out
                // ...
            }
        });
        this.innerHTML = `<div class="container">
        <div id="project-list-container" class="row">  
        <legend>My Projects:</legend>
        <div id="loaing">Loading....</div>
        </div>
        </div>`
        
        

    }

})