customElements.define('project-dashboard', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        window.addEventListener('load', () => {

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/firebase.User
                    var uid = user.uid;
                    const { selectedDashboard } = window.pageStore.state
                    this.render({ selectedDashboard })
                    // ...
                } else {
                    // User is signed out
                    // ...
                }
            });

        })

    }

    render({ selectedDashboard }) {
        this.innerHTML = `<div class="container">
        <fieldset>
        <legend>${selectedDashboard}</legend>

        </fieldset>
        <dashboard-tabs></dashboard-tabs>

        <dashboard-content></dashboard-content>
        
        </div>`
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
        this.innerHTML = `<div>
        <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link ${selectedTab === 'main-tab' && 'active'}" aria-current="page" href="#" id="main-tab">Main</a>
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
        this.querySelectorAll('a').forEach(element => {
            element.addEventListener('click', e => {
                e.preventDefault()
                const { id } = e.target
                
                window.pageStore.dispatch({
                    type: window.actionTypes.DASHBOARD_TAB_CHANGED,
                    payload: id
                });
            })
        })
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

    render({ selectedTab  }) {
        
        this.innerHTML = `<div>
        ${selectedTab === 'main-tab' ? `<main-tab></main-tab>` : ''}
        ${selectedTab === 'email-tab' ? `<email-tab  ></email-tab>` : ''}
        ${selectedTab === 'export-tab' ? `<export-tab  ></export-tab>` : ''}
        ${selectedTab === 'database-tab' ? `<database-tab  ></database-tab>` : ''}
        ${selectedTab === 'schedule-tab' ? `<schedule-tab ></schedule-tab>` : ''}
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
    
    </ol>
            
            `


    }
})

customElements.define('scrape-controls', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div class="row">
        <div class ="col py-5  my-1">
        <button class="btn btn-secondary">Start Scraping</button>
        </div>
        
        </div>`
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

        const label ='Email Service:'
        
        this.innerHTML = `<div>
    
     <trial-professional-check label="${label}"  trial-input-id="email-trial-input" professional-input-id="email-professional-input" service-name="emailService"></trial-professional-check>
        <email-list></email-list>
        </div>`
    }
})


const  handleCheck=({serviceName})=>{

    return (e)=>{
        debugger;
     
        debugger;
        const { value } = e.target
        firebase.auth().onAuthStateChanged((user) => {
            debugger;
            if (user) {
                const { selectedDashboard } = window.pageStore.state
                debugger;
                var uid = user.uid;
                const myProjectsRef = firebase.database().ref(`myprojects/${uid}/${selectedDashboard}/conf`)
    
                myProjectsRef.update({ [serviceName]: value }, (error) => {
                    debugger;
                    if (error) {
                        console.log('error', error)
                    } else {
                        debugger;
                        window.pageStore.dispatch({
                            type: window.actionTypes.ACCOUNT_TYPE_CHANGED,
                            payload: { accountType: value, serviceName }
                        });
                    }
                })
    
            }
        });
    }
 

}
customElements.define('trial-professional-check', class extends HTMLElement {
    constructor() {
        super()
       
    }
    connectedCallback() {
        const serviceName = this.getAttribute('service-name')
      
        const accountType =window.pageStore.state[serviceName]
        debugger;
        this.render({accountType,serviceName})
        window.pageStore.subscribe( window.actionTypes.ACCOUNT_TYPE_CHANGED, state=>{
            const accountType =state[serviceName]
            debugger;
            this.render({accountType,serviceName})
        })
    }

    render({accountType,serviceName}) {
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

        document.getElementById(trialInputId) && document.getElementById(trialInputId).addEventListener('click', handleCheck({serviceName}))
        document.getElementById(professionalInputId)&&  document.getElementById(professionalInputId).addEventListener('click', handleCheck({serviceName}))
    }


})

customElements.define('email-list', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>Email List:
        
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
    </tr>
  </tbody>
</table>
        </div>`
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

     const label="Export to Sheet Service:"
        
        this.innerHTML = `<div>
        
        <trial-professional-check label="${label}" trial-input-id="export-trial-input" professional-input-id="export-professional-input" service-name="exportService"></trial-professional-check>
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

       const label="Google Firestore database service:"
        this.innerHTML = `<div>
        <trial-professional-check label="${label}"  trial-input-id="database-trial-input" professional-input-id="database-professional-input" service-name="databaseService"></trial-professional-check>
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

        const label ="Github schedule (cron job) service:"
        this.innerHTML = `<div>
        <trial-professional-check label="${label}" trial-input-id="schedule-trial-input" professional-input-id="schedule-professional-input" service-name="scheduleService"></trial-professional-check>
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