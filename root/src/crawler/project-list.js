customElements.define('project-list', class extends HTMLElement {
    constructor() {
        super()
        //this.innerHTML='<div>Loading...</div>'
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()


        this.render()

    }
    render() {
        const { auth: { idToken } } = window.pageStore.state
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
        // const projectsRef= firebase.database().ref('projects')

     debugger;
        window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com').ref('projects').on('value', function (error, snap) {
            const dataObject = JSON.parse(snap.data)['data']
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
   
    }
})




