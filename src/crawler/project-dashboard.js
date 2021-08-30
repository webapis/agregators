customElements.define('project-dashboard', class extends HTMLElement {
    constructor() {
        super()

    }

    async connectedCallback() {

        const resources = await import('./resources.js')
        await resources.default()
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                const { selectedDashboard } = window.pageStore.state
                const selectedMyProjectRef = firebase.database().ref(`myprojects/${uid}/${selectedDashboard}`)
                selectedMyProjectRef.on('value', snap => {
                    const conf = snap.val()['conf']
                    window.pageStore.dispatch({
                        type: window.actionTypes.SET_ALL_ACCOUNT_TYPES,
                        payload: conf
                    });

                    this.render({ selectedDashboard })
                })
            }


        });
    }

    render({ selectedDashboard }) {
        this.innerHTML = `
        <top-navigation></top-navigation>
        <div class="container">
        <fieldset>
        <legend>${selectedDashboard}</legend>
        </fieldset>
        <dashboard-tabs></dashboard-tabs>
        <dashboard-content></dashboard-content>
        </div>
        <app-footer></app-footer>
        `
    }
})



customElements.define('dashboard-tabs', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const { dashboardTab } = window.pageStore.state
        this.render({ selectedTab: dashboardTab })
        window.pageStore.subscribe(window.actionTypes.DASHBOARD_TAB_CHANGED, state => {
            const { dashboardTab } = state

            this.render({ selectedTab: dashboardTab })
        })
    }

    render({ selectedTab }) {

        this.innerHTML = `
<div>
        <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link ${selectedTab === 'main-tab' && 'active'}"  href="#" id="main-tab">Main</a>
        </li>
        <li class="nav-item">
            <a class="nav-link ${selectedTab === 'email-tab' && 'active'}" href="#" id="email-tab">Email</a>
        </li>
        <li class="nav-item">
            <a class="nav-link ${selectedTab === 'export-tab' && 'active'}" href="#" id="export-tab">Export</a>
        </li>
        <li class="nav-item">
            <a class="nav-link ${selectedTab === 'database-tab' && 'active'}" href="#" id ="database-tab">Database</a>
        </li>
        <li class="nav-item">
            <a class="nav-link ${selectedTab === 'schedule-tab' && 'active'}" href="#" id ="schedule-tab">Schedule</a>
        </li>
        <li class="nav-item">
            <a class="nav-link ${selectedTab === 'query-tab' && 'active'}" href="#" id="query-tab">Query</a>
        </li>
    </ul>
</div>`
        document.getElementById('main-tab').addEventListener('click', this.handleTabSelection)
        document.getElementById('email-tab').addEventListener('click', this.handleTabSelection)
        document.getElementById('export-tab').addEventListener('click', this.handleTabSelection)
        document.getElementById('database-tab').addEventListener('click', this.handleTabSelection)
        document.getElementById('schedule-tab').addEventListener('click', this.handleTabSelection)
        document.getElementById('query-tab').addEventListener('click', this.handleTabSelection)
    }

    handleTabSelection(e) {
        e.preventDefault()
        const { id } = e.target

        window.pageStore.dispatch({
            type: window.actionTypes.DASHBOARD_TAB_CHANGED,
            payload: id
        });
    }
})


customElements.define('dashboard-content', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const { dashboardTab } = window.pageStore.state

        this.render({ selectedTab: dashboardTab })

        window.pageStore.subscribe(window.actionTypes.DASHBOARD_TAB_CHANGED, state => {
            const { dashboardTab } = state

            this.render({ selectedTab: dashboardTab })
        })

    }

    render({ selectedTab }) {

        this.innerHTML = `<div>
        ${selectedTab === 'main-tab' ? `<main-tab></main-tab>` : ''}
        ${selectedTab === 'email-tab' ? `<email-tab></email-tab>` : ''}
        ${selectedTab === 'export-tab' ? `<export-tab></export-tab>` : ''}
        ${selectedTab === 'database-tab' ? `<database-tab></database-tab>` : ''}
        ${selectedTab === 'schedule-tab' ? `<schedule-tab></schedule-tab>` : ''}
        ${selectedTab === 'query-tab' ? `<query-tab></query-tab>` : ''}
        
        </div>`
    }
})



customElements.define('main-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        this.render()


    }

    render() {
        this.innerHTML = `<div class="container">
        
        <scrape-controls></scrape-controls>
        <scrape-logs></scrape-logs>
        
        </div>`
    }
})

customElements.define('scrape-logs', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        this.innerHTML = `<div class="row">
            <div class="col">
            <log-accordion id="first" date="today"></log-accordion>
            <log-accordion id="two" date="yesterday"></log-accordion>
            </div>
            </div>`


    }
})


customElements.define('log-accordion', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        this.render()


    }

    render() {
        const id = this.getAttribute('id')
        const date = this.getAttribute('date')
        this.innerHTML = `
        <div class="py-1">
        <div class="accordion" id=${id}>
     <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${id}" aria-expanded="true" aria-controls="collapse-${id}">
       ${date}
      </button>
    </h2>
    <div id="collapse-${id}" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#${id}">
      <div class="accordion-body">
    <accordion-item></accordion-item>
      </div>
    </div>
  </div>

  </div>  
  </div>  
        `
    }
})

customElements.define('accordion-item', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.innerHTML = `
            <ol class="list-group list-group-numbered">
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">Start</div>
          When scraping started
        </div>
        <span class="badge bg-primary rounded-pill">14</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">End</div>
          When scraping ended
        </div>
        <span class="badge bg-primary rounded-pill">14</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">Time span</div>
          Total time 
        </div>
        <span class="badge bg-primary rounded-pill">14</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">Excel Link</div>
       Link to the Google Sheet file
      </div>
      <span class="badge bg-primary rounded-pill">14</span>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold"> Link to Image Folder</div>
     Link to collected images uploaded to Google Drive
    </div>
    <span class="badge bg-primary rounded-pill">14</span>
    </li>
    
    <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold"> Link JSON</div>
     Link to JSON data store to Google Firestore database
    </div>
    <span class="badge bg-primary rounded-pill">14</span>
    </li>
    
    <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold"> Email Alerts</div>
     List of emails notified about the result
    </div>
    <span class="badge bg-primary rounded-pill">14</span>
    </li>
    
    
    <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold"> Started Type</div>
     Whether web scraping started manually or by schedule 
    </div>
    <span class="badge bg-primary rounded-pill">Manual</span>
    </li>
    </ol>`
    }
})

customElements.define('scrape-controls', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        this.innerHTML = `<div class="row">
        <div class ="col py-5  my-1">
        <button class="btn btn-secondary" id="start-scraping-btn">Start Scraping</button>
        <button class="btn btn-danger" id="cancel-scraping-btn">Cancel Scraping</button>
        </div>
        
        </div>`
        document.getElementById('start-scraping-btn').addEventListener('click', async () => {
            const { auth: { user, fb_refresh_token }, selectedDashboard } = window.pageStore.state
            debugger;
            const hostname = window.location.hostname
            const api_key = "AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA";
            const fb_database_url = 'https://turkmenistan-market.firebaseio.com'
            const body = JSON.stringify({ ref: 'action', inputs: { projectName: selectedDashboard, parameters: JSON.stringify({ startedDateTime: Date.now(), fb_refresh_token, uid: user.uid, api_key, fb_database_url, email: user.email }) } })
            debugger;
            if (hostname === 'localhost') {
                const response = await fetch('http://localhost:3001/local_workflow', { method: 'post', mode: 'cors', body, headers: { 'Content-Type': 'application/json', 'Accept': 'text/plain' } })

                debugger;
            } else {
                const ghTokenRef = firebase.database().ref(`users/${user.uid}`)
                ghTokenRef.once('value', snap => {
                    const ghToken = snap.val()['ghtoken']
                    const gh_action_url= snap.val()['gh_action_url']
                    debugger;
                    if (ghToken) {
                        debugger;

                        triggerAction({ ticket: ghToken, body, gh_action_url })
                    } else {
                        const trialTokenRef = firebase.database().ref('gitticket')
                        debugger;
                        trialTokenRef.once('value', snap => {
                            const trialTicket = snap.val()
                            triggerAction(trialTicket)
                        })
                    }

                })
                debugger;
            }

        })

        document.getElementById('cancel-scraping-btn').addEventListener('click', () => {
            debugger;
        })
    }
})



customElements.define('email-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
    }

    render() {

        const label = 'Email Service:'

        this.innerHTML = `<div>
    

        <email-list></email-list>
        </div>`
    }
})


customElements.define('trial-professional-check', class extends HTMLElement {
    constructor() {
        super()

    }
    connectedCallback() {
        const serviceName = this.getAttribute('service-name')

        const accountType = window.pageStore.state[serviceName]

        this.render({ accountType, serviceName })
        window.pageStore.subscribe(window.actionTypes.ACCOUNT_TYPE_CHANGED, state => {
            const accountType = state[serviceName]

            this.render({ accountType, serviceName })
        })
    }

    render({ accountType, serviceName }) {
        const trialInputId = this.getAttribute('trial-input-id')
        const professionalInputId = this.getAttribute('professional-input-id')
        const label = this.getAttribute('label')

        this.innerHTML = `<div>
        <div class="row d-flex justify-content-center">
        <div class="col d-flex justify-content-center py-5">
        <div>
        <p>${label}</p>
          <input type="radio" id=${trialInputId} name="fav_language" value="trial" ${accountType === 'trial' && 'checked'}>
          <label for="html">Trial account: <i>(no action is required)</i></label><br>
          <input type="radio" id=${professionalInputId} name="fav_language" value="professional" ${accountType === 'professional' && "checked"} >
          <label for="javascript">Professional account: <i>(google authentication is required)</i></label>
        </div>
        </div>
        </div>
        </div>`

        document.getElementById(trialInputId) && document.getElementById(trialInputId).addEventListener('click', handleCheck({ serviceName }))
        document.getElementById(professionalInputId) && document.getElementById(professionalInputId).addEventListener('click', handleCheck({ serviceName }))
    }


})

customElements.define('email-list', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { selectedDashboard } = window.pageStore.state

        const user = firebase.auth().currentUser

        const emaillistRef = firebase.database().ref(`myprojects/${user.uid}/${selectedDashboard}/emaillist`)
        emaillistRef.on('value', snap => {
            if (snap.val()) {
                const emaillist = Object.entries(snap.val())


                window.pageStore.dispatch({
                    type: window.actionTypes.SET_EMAIL_LIST,
                    payload: emaillist
                });
                this.render()
            } else {
                this.render()
            }

        })

        window.pageStore.subscribe(window.actionTypes.EDIT_EMAIL, state => {
            this.render()
        })

    }
    render() {
        const { emaillist, emailToEdit } = window.pageStore.state
        const { key, email } = emailToEdit

        this.innerHTML = `<div class="container">Email List:
        <div class="row">
        <div class="col-1">
         <p></p>
        </div>
   
        <div class="col-3">
        <p ></p>
        </div>
        <div class="col">
        <p ></p>
        </div>
        </div>
<div class="row mb-1">
        <div class="col-1">
        <p>#</p>
       </div>

       <div class="col-3">
       <input class="form-control" type="email" id="email-input" placeholder='Enter email' value="${email}"/>
       </div>

       <div class="col">
       <button class="btn btn-primary" id="add-emaillist-btn"> Add</button>  <button class="btn btn-warning" id="update-email-list"> Update</button>
       </div>

       </div>
        <div id="emaillist-table-body"></div>
    </div>`
        if (emaillist.length > 0) {
            emaillist.forEach((obj, i) => {
                const key = obj[0]
                const email = obj[1]['email']
                document.getElementById('emaillist-table-body').insertAdjacentHTML('beforeend', `<email-table-row email="${email}" id="${key}" order=${i}></email-table-row>`)

            })
        }



        document.getElementById('add-emaillist-btn') && document.getElementById('add-emaillist-btn').addEventListener('click', () => {

            const user = firebase.auth().currentUser
            const email = document.getElementById('email-input').value
            const { selectedDashboard } = window.pageStore.state
            const emailListRef = firebase.database().ref(`myprojects/${user.uid}/${selectedDashboard}/emaillist`)
            emailListRef.push({ email }, (error) => {
                if (error) {
                    console.log('error', error)
                }
            })
        })

        document.getElementById('update-email-list').addEventListener('click', (e) => {
            const user = firebase.auth().currentUser
            const email = document.getElementById('email-input').value
            const { selectedDashboard } = window.pageStore.state
            const emailListRef = firebase.database().ref(`myprojects/${user.uid}/${selectedDashboard}/emaillist/${key}`)
            emailListRef.update({ email }, (error) => {
                if (error) {
                    console.log('error', error)
                } else {

                    window.pageStore.dispatch({
                        type: window.actionTypes.EDIT_EMAIL,
                        payload: { email: '', key: '' }
                    });
                }
            })
        })
    }

})

customElements.define('email-table-row', class extends HTMLElement {
    constructor() {
        super()
        this.render()
    }

    render() {
        const email = this.getAttribute('email')
        const id = this.getAttribute('id')
        const order = this.getAttribute('order')
        this.innerHTML = `
        <div class="row">
        <div class ="col-1"><p>${order}</p></div>
        <div class ="col-3"><p>${email}</p></div>
        <div class ="col">
        <input class="btn btn-secondary" type="button" class="btn btn-secondary" value="Edit" id="${id}-edit-btn"/>
        <input class="btn btn-secondary" type="button" class="btn btn-secondary" value="Delete" id ="${id}-delete-btn" />
        </div>
   
        </div>
    
        `

        document.getElementById(`${id}-edit-btn`).addEventListener('click', () => {

            window.pageStore.dispatch({
                type: window.actionTypes.EDIT_EMAIL,
                payload: { email, key: id }
            });

        })
        document.getElementById(`${id}-delete-btn`).addEventListener('click', () => {
            const user = firebase.auth().currentUser
            const { selectedDashboard } = window.pageStore.state
            const emaillistRef = firebase.database().ref(`myprojects/${user.uid}/${selectedDashboard}/emaillist/${id}`)
            emaillistRef.remove((error) => {


            })

        })
    }
})

customElements.define('export-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        this.render()

    }

    render() {

        const label = "Export to Sheet Service:"

        this.innerHTML = `<div>
        

        </div>`
    }
})


customElements.define('database-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        this.render()

    }

    render() {

        const label = "Google Firestore database service:"
        this.innerHTML = `<div>

        </div>`
    }
})

customElements.define('schedule-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        this.render()

    }

    render() {

        const label = "Github schedule (cron job) service:"
        this.innerHTML = `<div>
    
        </div>`
    }
})


customElements.define('query-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        this.render()

    }

    render() {
        this.innerHTML = `<div>query-tab</div>`
    }
})




function triggerAction({ ticket, body, gh_action_url }) {

    fetch(gh_action_url, {
        method: 'post',
        headers: {
            authorization: `token ${ticket}`,
            Accept: 'application/vnd.github.v3+json'
        },
        body
    }).then(result => {
        debugger;

    }).then(data => {
        debugger;
    }).catch(error => {
        debugger;
    })
}

