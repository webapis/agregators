customElements.define('my-projects', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources= await import('./resources.js')
        await resources.default()
    
            this.render()
    

    }
    render() {

        
        const { auth: { idToken,localId:uid } } = window.pageStore.state
        this.uid=uid
    this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
                
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
             
            
                this.FB_DATABASE
                    .ref(`myprojects/${uid}`).on('value', (error,snap) => {
                        debugger;
                        const dataObject = JSON.parse(snap.data)['data']
                        debugger;
                        const arrayData =Object.entries(dataObject)
                        arrayData.forEach(a=>{
                            const projectName =a[0]
            
                      
                            const projectDescription = a[1]['description']
                        
                             const githuburl =a[1]['githuburl']
                             
                            const element = document.createElement('project-card')
                            element.setAttribute('project-name', projectName)
                            element.setAttribute('description', projectDescription)
                            element.setAttribute('githuburl',githuburl)
                            element.classList.add('col-3')
                            document.getElementById('project-list-container').appendChild(element)
                            document.getElementById('loaing').style='display:none'
                        })
                          
                    })
                // ...
           
    
        this.innerHTML = `
        <top-navigation></top-navigation>
        <div class="container">
        <div id="project-list-container" class="row">  
        <legend>Tasks:</legend>
        <div id="loaing">Loading....</div>
        </div>
        </div>
        <app-footer></app-footer>
        `
        
        

    }

})