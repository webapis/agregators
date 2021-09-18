
customElements.define('project-dashboard', class extends HTMLElement {
    constructor() {
        super()

    }

    async connectedCallback() {
        const resources = await import('./resources.js')
        await resources.default()
        const { auth: { idToken, localId: uid } } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')

        this.innerHTML = `<div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`

        const { selectedDashboard } = window.pageStore.state


        this.render({ selectedDashboard })



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
            <a class="nav-link ${selectedTab === 'email-tab' && 'active'}" href="#" id="plugins-tab">Plugins</a>
        </li>
   
    </ul>
</div>`
        document.getElementById('main-tab').addEventListener('click', this.handleTabSelection)
        document.getElementById('plugins-tab').addEventListener('click', this.handleTabSelection)

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
        ${selectedTab === 'plugins-tab' ? `<plugins-tab></plugins-tab>` : ''}
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
        const { auth: { localId: uid } } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.innerHTML =
            `<div class="row" id="log-container">
     
        </div>
        `
        const { auth: { user }, selectedDashboard } = window.pageStore.state

        this.FB_DATABASE.ref(`runs/${this.uid}/${selectedDashboard}`).on('child_added', snap => {
            const data = snap.val()
            const key = snap.key
            const start = data.RUN_STARTED
            const end = data.RUN_COMPLETE
            const download = data.PAGE_UPLOAD_EXCEL && data.PAGE_UPLOAD_EXCEL.webContentLink
            const openfile = data.PAGE_UPLOAD_EXCEL && data.PAGE_UPLOAD_EXCEL.webViewLink
            const imageLink = data.UPLOADING_IMAGES && data.UPLOADING_IMAGES.webViewLink

            document.getElementById('log-container').insertAdjacentHTML('afterbegin',
                `<div class="col-12">
        <log-accordion id="_i${key}" start=${start} end=${end} download=${download} open-file=${openfile} image-link=${imageLink}></log-accordion>
        </div>`)


        })

    }


})


customElements.define('log-accordion', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`
        this.render()
    }

    render() {
        const id = this.getAttribute('id')
        const start = this.getAttribute('start')
        const end = this.getAttribute('end')
        const download = this.getAttribute('download')
        const openFile = this.getAttribute('open-file')
        const imageLink = this.getAttribute('image-link')

        this.innerHTML = `
        <div class="py-1">
        <div class="accordion" id=${id}>
     <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${id}" aria-expanded="true" aria-controls="collapse-${id}">
        <run-state start=${start} end=${end}></run-state>
      </button>
    </h2>
    <div id="collapse-${id}" class="accordion-collapse collapse ${!end && 'show'}" aria-labelledby="headingOne" data-bs-parent="#${id}">
      <div class="accordion-body">
    <accordion-item start=${start} end=${end} download=${download} open-file=${openFile} image-link=${imageLink}></accordion-item>
      </div>
    </div>
  </div>

  </div>  
  </div>  
        `
    }
})

customElements.define('run-state', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const start = parseInt(this.getAttribute('start'))
        const { completeTime } = window.pageStore.state
        this.render({ completeTime })
        window.pageStore.subscribe(window.actionTypes.RUN_COMPLETE, state => {
            const { runId, completeTime } = state

            if (runId === start) {

                this.render({ completeTime })
            }
        })

    }
    render({ completeTime }) {
        const start = this.getAttribute('start')
        const end = this.getAttribute('end')
        const { minutes, seconds, hours } = start && end && calculateTimeSpan({ date_future: end !== "undefined" ? end : completeTime, date_now: start })

        this.innerHTML = `<div>
        ${start ? `<div><i class="me-1 w-bold text-decoration-underline">Start: </i>${new Date(parseInt(start)).toLocaleString()}</div>` : ''}
        ${(end !== "undefined" || completeTime > 1) ? ` <div><i class="w-bold text-decoration-underline">End: </i>${new Date(parseInt(completeTime)).toLocaleString()}</div>`
                : `<div><i class="w-bold text-decoration-underline">End:</i><div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div></div>`}
      ${(end !== "undefined" || completeTime > 1) ? `<div><i class="w-bold text-decoration-underline">Duration: </i>${hours}:${minutes}:${seconds}</div>` : `<div><i class="w-bold text-decoration-underline">Duration: </i><stop-watch></stop-watch></div>`}
        </div>`
    }
})


customElements.define('stop-watch', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        var millisecound = 0;
        var timer;

        //`<div id ="stop-counter"></div>`


        clearInterval(timer);
        timer = setInterval(() => {
            millisecound += 10;

            let dateTimer = new Date(millisecound);

            this.innerHTML = `${('0' + dateTimer.getUTCHours()).slice(-2) + ':' +
                ('0' + dateTimer.getUTCMinutes()).slice(-2) + ':' +
                ('0' + dateTimer.getUTCSeconds()).slice(-2) + ':' +
                ('0' + dateTimer.getUTCMilliseconds()).slice(-3, -1)
                }
         `
        }, 10);
    }
})



customElements.define('accordion-item', class extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        const download = this.getAttribute('download')
        const openFile = this.getAttribute('open-file')
        const imageLink = this.getAttribute('image-link')
        this.innerHTML = `
            <ol class="list-group list-group-numbered">




    
    
${download ? ` <li class="list-group-item d-flex justify-content-between align-items-start">
<div class="ms-2 me-auto">
  <div class="fw-bold">Excel Link</div>
 Link to the Google Sheet file
</div>
<a href=${download} class="me-1">Download</a>or
<a href=${openFile} class="ms-1" target="_blank">Open File</a>
</li>`: ''}
     
${imageLink ? `  <li class="list-group-item d-flex justify-content-between align-items-start">
<div class="ms-2 me-auto">
  <div class="fw-bold"> Link to Image Folder</div>
 Link to collected images uploaded to Google Drive
</div>
<a href=${imageLink} class="me-1" target="_blank">Open Images Link</a>
</li>`: ''}
  
    
  
    
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

function calculateTimeSpan({ date_future, date_now }) {
    // get total seconds between the times
    var seconds = Math.floor((date_future - (date_now)) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

    return { hours, minutes, seconds }
}

customElements.define('scrape-controls', class extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {

        this.innerHTML = `<div class="row">
        <div class ="col py-5  my-1">
        <start-scraping-btn></start-scraping-btn>
        <button class="btn btn-danger" id="cancel-scraping-btn">Cancel Scraping</button>
        </div>
        
        </div>`


        document.getElementById('cancel-scraping-btn').addEventListener('click', () => {

        })
    }
})

customElements.define('start-scraping-btn', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { startScrapingClicked, auth: { localId: uid, idToken }, runId, selectedDashboard } = window.pageStore.state
        this.uid = uid
        this.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri('https://turkmenistan-market.firebaseio.com')
        this.render({ startScrapingClicked })


        // window.pageStore.subscribe(window.actionTypes.START_SCRAPING_CLICKED, async (state) => {
        //     const { auth: { user, fb_refresh_token, gh_tkn, gh_user }, selectedDashboard, startScrapingClicked, runId } = state
        //     this.render({ startScrapingClicked })
        //    this.FB_DATABASE.ref(`runs/${this.uid}/${selectedDashboard}/${runId}`).set({ RUN_STARTED: runId }, () => {

        //         const liveRef =FB_DATABASE.ref(`myprojects/${this.uid}/${selectedDashboard}/LIVE`)
        //         liveRef.get().then(async snap => {
        //             const value = snap.val()

        //             if (value) {
        //                this.FB_DATABASE.ref(`runs/${this.uid}/${selectedDashboard}/${runId}`).set({ RUN_STARTED: runId }, () => {

        //                 })

        //             } else {
        //                 const hostname = window.location.hostname
        //                 const api_key = "AIzaSyDb8Z27Ut0WJ-RH7Exi454Bpit9lbARJeA";
        //                 const fb_database_url = 'https://turkmenistan-market.firebaseio.com'
        //                 const parameters = `${runId}--splitter--${fb_refresh_token}--splitter--${this.uid}--splitter--${api_key}--splitter--${user.email}--splitter--${fb_database_url}--splitter--${gh_tkn}--splitter--${gh_user}`

        //                 const body = JSON.stringify({ ref: selectedDashboard, inputs: { projectName: selectedDashboard, parameters } })

        //                 if (false) {

        //                     fetch(`http://localhost:3000/local_workflow?projectName=${selectedDashboard}&parameters=${parameters}`, { method: 'get', mode: 'cors', headers: { 'Content-Type': 'application/json', 'Accept': 'text/plain' } }).then((response) => {
        //                         return response.json()
        //                     }).then(data => data).catch(error => {

        //                     })

        //                 } else {
        //                     const { auth: { token } } = window.pageStore.state
        //                     triggerAction({ ticket: token, body, gh_action_url })
        //                 }
        //             }
        //         })
        //     })


        //    this.FB_DATABASE.ref(`runs/${this.uid}/${selectedDashboard}/${runId}/RUN_COMPLETE`).on('value', (error,snap) => {
        //     const dataObject = JSON.parse(snap.data)['data']

        //         if (dataObject) {


        //             window.pageStore.dispatch({ type: window.actionTypes.RUN_COMPLETE, payload: value })
        //         }


        //     })
        // })
        // window.pageStore.subscribe(window.actionTypes.RUN_COMPLETE, state => {
        //     const { startScrapingClicked } = state

        //     this.render({ startScrapingClicked })



        // })

        // this.FB_DATABASE.ref(`runs/${this.uid}/${selectedDashboard}/${runId}/RUN_STARTED`).on('value', (error,snap) => {


        //     // window.pageStore.dispatch({ type: window.actionTypes.RUN_COMPLETE })
        // })

    }

    render({ startScrapingClicked }) {
        this.innerHTML = `<button class="btn btn-secondary" id="start-scraping-btn" ${startScrapingClicked && 'disabled'}>${startScrapingClicked ? `  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Wait...`: 'Start'}</button>`
        document.getElementById('start-scraping-btn').addEventListener('click', async () => {
            const { auth: { token, screenName: owner }, selectedDashboard } = window.pageStore.state
            const body = JSON.stringify({ ref: selectedDashboard, inputs: { projectName: selectedDashboard, parameters: `sdsdsdsdsdsdasdasdasd` } })
            debugger;   
            triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/agregators/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
         
            //  window.pageStore.dispatch({ type: window.actionTypes.START_SCRAPING_CLICKED })
        })
    }
})


customElements.define('plugins-tab', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render()
    }

    render() {

        const label = 'Email Service:'

        this.innerHTML = `<div>
    

       Plugins
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

        const emaillistRef = FB_DATABASE.ref(`myprojects/${this.uid}/${selectedDashboard}/emaillist`)
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
            const emailListRef = FB_DATABASE.ref(`myprojects/${this.uid}/${selectedDashboard}/emaillist`)
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
            const emailListRef = FB_DATABASE.ref(`myprojects/${this.uid}/${selectedDashboard}/emaillist/${key}`)
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
            const emaillistRef = FB_DATABASE.ref(`myprojects/${this.uid}/${selectedDashboard}/emaillist/${id}`)
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
debugger;
    fetch(gh_action_url, {
        method: 'post',
        headers: {
            authorization: `token ${ticket}`,
            Accept: 'application/vnd.github.v3+json'
        },
        body
    }).then(result => {
debugger;
return result.json()
    }).then(data => {
debugger;
    }).catch(error => {
debugger;
    })
}
