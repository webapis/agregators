customElements.define('user-settings', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()

        this.render()
    }

    render() {
        this.innerHTML = `
        <top-navigation></top-navigation>

        <div class="container">
        <h3>Settings:</h3>
        <div class="row">
          <main-tab></main-tab>
        </div>
        </div>
        <app-footer></app-footer>
        `
    }
})


customElements.define('service-tabs', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        window.pageStore.subscribe(window.actionTypes.SETTINGS_SERVICE_TAB_CHANGED, () => {

            this.render()
        })

        this.render()
    }

    render() {

        const { settingsServiceTab } = window.pageStore.state
        this.innerHTML = `<div>
        <ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link ${settingsServiceTab === 'email-tab' && 'active'}" href="#" id="email-tab">Email:</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ${settingsServiceTab === 'export-tab' && 'active'}" href="#" id="export-tab">Data Export</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ${settingsServiceTab === 'database-tab' && 'active'}" href="#" id="database-tab">Database</a>
  </li>
  <li class="nav-item ">
    <a class="nav-link ${settingsServiceTab === 'schedule-tab' && 'active'}" href="#" tabindex="-1" id="schedule-tab">Schedule</a>
  </li>
</ul>
        
        </div>`
        document.getElementById('email-tab').addEventListener('click', this.handleTabChange)
        document.getElementById('export-tab').addEventListener('click', this.handleTabChange)
        document.getElementById('database-tab').addEventListener('click', this.handleTabChange)
        document.getElementById('schedule-tab').addEventListener('click', this.handleTabChange)
    }

    handleTabChange(e) {
        e.preventDefault()
        const { id } = e.target

        window.pageStore.dispatch({ type: window.actionTypes.SETTINGS_SERVICE_TAB_CHANGED, payload: id })
    }

})

customElements.define('service-tab-contents', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        window.pageStore.subscribe(window.actionTypes.SETTINGS_SERVICE_TAB_CHANGED, () => {

            this.render()
        })
        this.render()
    }

    render() {

        const { settingsServiceTab } = window.pageStore.state
        this.innerHTML = `
        ${settingsServiceTab === 'email-tab' ? '<email-tab-content></email-tab-content>' : ''}
        ${settingsServiceTab === 'export-tab' ? '<export-tab-content></export-tab-content>' : ''}
        ${settingsServiceTab === 'database-tab' ? '<database-tab-content></database-tab-content>' : ''}
        ${settingsServiceTab === 'schedule-tab' ? '<schedule-tab-content></schedule-tab-content>' : ''}
        `
    }
})

customElements.define('email-tab-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const label = 'Email Service:'
        this.innerHTML = `<div>
        <trial-professional-check label="${label}"  trial-input-id="email-trial-input" professional-input-id="email-professional-input" service-name="emailService"></trial-professional-check>
        
        </div>`
    }
})

customElements.define('export-tab-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {

        const label = 'Google Sheet Service:'
        this.innerHTML = `<div>
        <trial-professional-check label="${label}" trial-input-id="export-trial-input" professional-input-id="export-professional-input" service-name="exportService"></trial-professional-check>
        </div>`
    }
})

customElements.define('database-tab-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>Databse tab content</div>`
    }
})


customElements.define('schedule-tab-content', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>Schedule tab content</div>`
    }
})





const updateAccountType = ({ serviceName, accountType }) => {


    const { selectedDashboard, auth: { user } } = window.pageStore.state

    var uid = user.uid;

    const myProjectsRef = firebase.database().ref(`myprojects/${uid}/${selectedDashboard}/conf`)
    myProjectsRef.update({ [serviceName]: accountType }, (error) => {

        if (error) {
            console.log('error', error)
        } else {

            window.pageStore.dispatch({
                type: window.actionTypes.ACCOUNT_TYPE_CHANGED,
                payload: { accountType, serviceName }
            });
        }
    })
}


const handleCheck = ({ serviceName }) => {


    return (e) => {
        window.pageStore.dispatch({ type: window.actionTypes.LOADING })
        let scopes = ''
        switch (serviceName) {
            case 'emailService':
                scopes = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.send'
                break;
            case 'exportService':
                scopes = 'https://www.googleapis.com/auth/drive.file'
                break;
            case 'databaseService':
                scopes = 'https://www.googleapis.com/auth/cloud-platform'
                break;
            case 'scheduleService':
                scopes = ''
                break;
            default:
                ''
        }
        const { value } = e.target
        if (value === 'professional') {
            var CLIENT_ID = '117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com';
            var REDIRECT_URI = `${window.location.origin}/user-settings.html`;

            window.googleAuthorizationRequest({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI, scope: scopes, state: `${serviceName}`.toLowerCase(), include_granted_scopes: true, response_type: 'code' })

            //  updateAccountType({ serviceName, accountType: value })
        } else {
            updateAccountType({ serviceName, accountType: value })
        }
    }
}


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
        window.pageStore.subscribe(window.actionTypes.LOADING, state => {
            const accountType = state[serviceName]
            this.render({ accountType, serviceName })
        })
        const { auth: { user } } = window.pageStore.state

        if (user) {
            const serviceConfRef = firebase.database().ref(`users/${user.uid}/serviceConf/${serviceName}`)
            serviceConfRef.on('value', snap => {
                const accountType = snap.val()
                window.pageStore.dispatch({ type: window.actionTypes.LOADING_COMPLETE })
                window.pageStore.dispatch({
                    type: window.actionTypes.ACCOUNT_TYPE_CHANGED,
                    payload: { accountType, serviceName }
                });
            })
        }
    }

    render({ accountType, serviceName }) {
        const { loading } = window.pageStore.state

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
      ${loading ? `  <div class="col-12 d-flex justify-content-center">
      <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
 
      </div>
       authenticating...
    </div>`: ''}
        </div>
        </div>`
        document.getElementById(trialInputId) && document.getElementById(trialInputId).addEventListener('click', handleCheck({ serviceName }))
        document.getElementById(professionalInputId) && document.getElementById(professionalInputId).addEventListener('click', handleCheck({ serviceName }))
    }


})




customElements.define('user-settings-tabs', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div>
        <nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <button class="nav-link" id="nav-google-apis-tab" data-bs-toggle="tab" data-bs-target="#nav-google-apis" type="button" role="tab" aria-controls="nav-google-apis" aria-selected="true">Google API's</button>
    <button class="nav-link d-none" id="nav-dropbox-apis-tab" data-bs-toggle="tab" data-bs-target="#nav-dropbox-apis" type="button" role="tab" aria-controls="nav-dropbox-apis" aria-selected="false">Dropbox API's</button>
    <button class="nav-link active" id="nav-github-apis-tab" data-bs-toggle="tab" data-bs-target="#nav-github-apis" type="button" role="tab" aria-controls="nav-github-apis" aria-selected="false">Github API's</button>
    <button class="nav-link d-none" id="nav-proxy-apis-tab" data-bs-toggle="tab" data-bs-target="#nav-proxy-apis" type="button" role="tab" aria-controls="nav-proxy-apis" aria-selected="false">Proxy API's</button>
  
  </div>
</nav>
<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade " id="nav-google-apis" role="tabpanel" aria-labelledby="nav-google-apis-tab"><google-services></google-services></div>
  <div class="tab-pane fade" id="nav-dropbox-apis" role="tabpanel" aria-labelledby="nav-dropbox-apis-tab">Dropbox API's</div>
  <div class="tab-pane fade show active" id="nav-github-apis" role="tabpanel" aria-labelledby="nav-github-apis-tab"><github-services></github-services></div>
  <div class="tab-pane fade" id="nav-proxy-apis" role="tabpanel" aria-labelledby="nav-proxy-apis-tab">Proxy API's</div>
 
</div>
        </div>`
    }
})


customElements.define('main-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `
        <div class="d-flex align-items-start">
  <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
    <button class="nav-link active" id="v-pills-user-tab" data-bs-toggle="pill" data-bs-target="#v-pills-user" type="button" role="tab" aria-controls="v-pills-user" aria-selected="true">User Seeting:</button>
    <button class="nav-link d-none" id="v-pills-developer-tab" data-bs-toggle="pill" data-bs-target="#v-pills-developer" type="button" role="tab" aria-controls="v-pills-developer" aria-selected="false">Developer Settings:</button>
  </div>
  <div class="tab-content" id="v-pills-tabContent">
    <div class="tab-pane fade show active" id="v-pills-user" role="tabpanel" aria-labelledby="v-pills-user-tab"><user-settings-tabs></user-settings-tabs></div>
    <div class="tab-pane fade" id="v-pills-developer" role="tabpanel" aria-labelledby="v-pills-developer-tab">Developer Setting...</div>
  </div>
</div>
        `
    }
})


customElements.define('google-services', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.render()
        window.pageStore.subscribe(window.actionTypes.LOADING, () => {
            this.render()
        })
        const { auth: { user } } = window.pageStore.state
        firebase.database().ref(`users/${user.uid}/scope`).on('value', snap => {
            window.pageStore.dispatch({ type: window.actionTypes.LOADING_COMPLETE })
            this.render()
        })
    }

    render() {
        const { loading, googleServiceScopes } = window.pageStore.state
        const hasEmailScope = googleServiceScopes.includes('https://www.googleapis.com/auth/gmail.send')
        const hasDriveScope = googleServiceScopes.includes('https://www.googleapis.com/auth/drive.file')

        this.innerHTML = `
    <div>
        <h5 class="mt-3 mb-5 fw-normal text-muted">Enable or Disable Google Services: </h5>
        <div class="form-check">
        <input class="form-check-input" type="checkbox" value="https://www.googleapis.com/auth/gmail.send" id="emailServiceInput" ${hasEmailScope && 'checked'}>
        <label class="form-check-label" for="emailServiceInput">
            Gmail API Service
        </label>
        </div>
        <div class="form-check">
        <input class="form-check-input" type="checkbox" value="https://www.googleapis.com/auth/drive.file" id="exportServiceInput" ${hasDriveScope && 'checked'}>
        <label class="form-check-label" for="exportService">
            Drive API service
        </label>
        </div>
    <div class="mt-5">
    <button class="btn btn-primary" type="button" ${loading && 'disabled'} id="update-google-api">
    ${loading ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' : ''}
    
    ${loading ? 'Updating...' : 'Update'}
  </button>

    <div>
        </div>`
        document.getElementById('emailServiceInput').addEventListener('click', this.handleCheck)
        document.getElementById('exportServiceInput').addEventListener('click', this.handleCheck)


        document.getElementById('update-google-api').addEventListener('click', () => {
            const { googleServiceScopes } = window.pageStore.state

            window.pageStore.dispatch({ type: window.actionTypes.LOADING })

            var CLIENT_ID = '117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com';
            var REDIRECT_URI = `${window.location.origin}/user-settings.html`;
            window.googleAuthorizationRequest({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI, scope: googleServiceScopes, state: 'google_services'.toLowerCase(), include_granted_scopes: true, response_type: 'code' })

        })
    }



    handleCheck(e) {
        const { value, checked } = e.target

        if (checked) {
            window.pageStore.dispatch({ type: window.actionTypes.GOOGLE_SERVICE_SCOPE_ADDED, payload: value })
        } else {
            window.pageStore.dispatch({ type: window.actionTypes.GOOGLE_SERVICE_SCOPE_REMOVED, payload: value })
        }

    }
})


customElements.define('github-services', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { auth: { user, gh_tkn } } = window.pageStore.state
        const ghServiceRef = firebase.database().ref(`users/${user.uid}`)
        ghServiceRef.on("value", snap => {
            const hastoken = snap.val()['ghtoken']
            const gh_user = snap.val()['ghuser']
            debugger;
            if (hastoken) {
                window.pageStore.dispatch({ type: window.actionTypes.SET_GH_TKN, payload: { gh_tkn: hastoken, gh_user } })
            }
            this.render({ hastoken: gh_tkn })


        })

    }

    render({ hastoken }) {

        const { loading } = window.pageStore.state


        this.innerHTML = `   <div>
        <h5 class="mt-3 mb-5 fw-normal text-muted">Enable or Disable Github Services: </h5>
      
     
    <div class="mt-5">
    <button class="btn btn-primary" type="button" ${(loading || hastoken) && 'disabled'} id="update-github-api">
    ${loading ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' : ''}
    
    ${loading ? 'Enabling Github...' : hastoken ? 'Github is Enabled' : 'Enable Github service'}
  </button>

    <div>
        </div>`

        document.getElementById('update-github-api').addEventListener('click', async (e) => {
            try {
                e.preventDefault()
                const { auth: { user } } = window.pageStore.state
                window.location.replace(`/github-verification.html?uid=${user.uid}`)


            } catch (error) {

            }

        })
    }
})