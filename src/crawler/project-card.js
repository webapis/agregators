customElements.define('project-card', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const auth= window.pageStore.state.auth
        debugger;
        const projectName = this.getAttribute('project-name')
        const description = this.getAttribute('description')
        this.innerHTML = `<div class="card mt-3">
        <div class="card-body">
        <div class="row">
        <div class="col">
        <img src="http://webdata-scraping.com/wp-content/uploads/2016/10/Octoparse-150x150.png" width="50" height="50"/>
        </div>
        <h5 class="card-title col">${projectName}</h5>
        </div>
       
        <p class="card-text">${description}</p>
        <a href="#" class="card-link" id="${projectName}-dashboard-link" >Go to dashboard</a>
        ${auth && auth.role === 'admin' ? '<a href="#" class="card-link" id="${projectName}-project-editor-link">Edit project</a>' : ''}
        </div>
        <div class="card-footer text-muted">
        <eye-icon></eye-icon><span class="badge text-secondary">10</span>
      </div>
        </div>`
        document.getElementById(`${projectName}-dashboard-link`).addEventListener('click', async (e) => {
            e.preventDefault()

            const { auth } = window.pageStore.state

            if (!auth) {
                const result = await window.googleAuth({ navAfterAuth: '/project-dashboard.html' })

            } else {

                const { uid,email } = firebase.auth().currentUser;
                const userProjectsRef = firebase.database().ref(`myprojects/${uid}/${projectName}`)

                userProjectsRef.on('value', snap => {
                    const value = snap.val()
                    if (!value) {

                        const projectTemplatesRef = firebase.database().ref(`projects/${projectName}`)
                        projectTemplatesRef.on('value', snap => {
                            const value = snap.val()
                            const description = value['description']

                            userProjectsRef.set({ description,user:email }, (error) => {
                                if (error) {
                                    window.pageStore.dispatch({
                                        type: window.actionTypes.ERROR,
                                        payload: { error }
                                    });
                                } else {

                                    window.pageStore.dispatch({
                                        type: window.actionTypes.CONTENT_VIEW_CHANGED,
                                        payload: { contentView: 'project-dashboard', selectedDashboard: projectName }
                                    });
                                    window.location.replace('/project-dashboard.html')
                                }
                            })

                        })
                    } else {


                        window.pageStore.dispatch({
                            type: window.actionTypes.CONTENT_VIEW_CHANGED,
                            payload: { contentView: 'project-dashboard', selectedDashboard: projectName }
                        });
                        window.location.replace('/project-dashboard.html')

                    }
                })


                const { id } = e.target
                window.pageStore.dispatch({
                    type: window.actionTypes.CONTENT_VIEW_CHANGED,
                    payload: { contentView: 'project-dashboard', selectedDashboard: projectName }
                });
            }


        })
        document.getElementById(`${projectName}-project-editor-link`).addEventListener('click', (e) => {
            e.preventDefault()

            window.pageStore.dispatch({
                type: window.actionTypes.PROJECT_EDITOR_SELECTED,
                payload: { projectName, description }
            });
            window.location.replace('/project-editor.html')
        })

    }


})


customElements.define('eye-icon', class extends HTMLElement {
    constructor() {
        super()

        this.innerHTML = `    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
      </svg>`
    }
})