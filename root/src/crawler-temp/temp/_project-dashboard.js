
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
        <div class ="col-12 py-5  my-1">
        <start-scraping-btn></start-scraping-btn>
        <button class="btn btn-danger" id="cancel-scraping-btn">Cancel</button>
        </div>
        <div class="col-12">
        <github-initialization></github-initialization>
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

    }

    render({ startScrapingClicked }) {
        window.pageStore.dispatch({type:window.actionTypes.GITHUB_INITIALIZATION_CHANGED,payload:{upstream:'pending', copySourceCode:'pending', startRunner:'pending'}})
        this.innerHTML = `<button class="btn btn-secondary" id="start-scraping-btn" ${startScrapingClicked && 'disabled'}>${startScrapingClicked ? `  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Wait...`: 'Start'}</button>`
        document.getElementById('start-scraping-btn').addEventListener('click', async () => {
            const { auth: { screenName: owner, token }, selectedDashboard: projectName, codeGithubOwner } = window.pageStore.state
         //upstream, copySourceCode, startRunner
            window.pageStore.dispatch({type:window.actionTypes.GITHUB_INITIALIZATION_CHANGED,payload:{upstream:'started'}})

            
            const gitApis = await Promise.all([import('./github-rest.js')])
            const CopySourceCode = gitApis[0].default
            const deleteBranch = gitApis[0].deleteBranch
            const mergeUpstream = gitApis[0].mergeUpstream
            await mergeUpstream()

            window.pageStore.dispatch({type:window.actionTypes.GITHUB_INITIALIZATION_CHANGED,payload:{upstream:'complete'}})
            debugger;
            fetch(`https://api.github.com/repos/${owner}/agregators/branches`).then(response => response.json()).then(async data => {
                window.pageStore.dispatch({type:window.actionTypes.GITHUB_INITIALIZATION_CHANGED,payload:{copySourceCode:'started'}})
                const branches = data
                const bExist = branches.filter(b => b.name === projectName).length > 0

                if (bExist) {
                    await deleteBranch({ owner, repo: 'agregators', branchName: projectName, token })
                    await CopySourceCode({ gihubowner: codeGithubOwner, projectName, login: owner, token })
                    window.pageStore.dispatch({type:window.actionTypes.GITHUB_INITIALIZATION_CHANGED,payload:{copySourceCode:'complete'}})
                    return Promise.resolve(true);

                } else {
                    window.pageStore.dispatch({type:window.actionTypes.GITHUB_INITIALIZATION_CHANGED,payload:{copySourceCode:'complete'}})
                    await CopySourceCode({ gihubowner: codeGithubOwner, projectName, login: owner, token })
                    return Promise.resolve(true);
                }

            }).then(resolved => {
                const { auth: { token, screenName: owner }, selectedDashboard } = window.pageStore.state
                const body = JSON.stringify({ ref: selectedDashboard, inputs: { projectName: selectedDashboard, parameters: `sdsdsdsdsdsdasdasdasd` } })
                debugger;
                window.pageStore.dispatch({type:window.actionTypes.GITHUB_INITIALIZATION_CHANGED,payload:{startRunner:'started'}})
                triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/agregators/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
            })


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


customElements.define('github-initialization', class extends HTMLElement {
    constructor() {
        super()

    }
    connectedCallback() {
        const { githubInitialization: { upstream, copySourceCode, startRunner } } = window.pageStore.state
        this.render({ upstream, copySourceCode, startRunner })
        window.pageStore.subscribe(window.actionTypes.GITHUB_INITIALIZATION_CHANGED, state => {
            const { githubInitialization: { upstream, copySourceCode, startRunner } } = state
            this.render({ upstream, copySourceCode, startRunner })
        })
    }

    render({ upstream, copySourceCode, startRunner }) {
        this.innerHTML = `<ol class="list-group list-group-numbered">
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Github upstreaming</div>
        
          </div>
          <spinners-tick state=${upstream}></spinners-tick>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Initialize Source code</div>
         
          </div>
          <spinners-tick state=${copySourceCode}></spinners-tick>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">Start Runner</div>
          </div>
        <spinners-tick state=${startRunner}></spinners-tick>
        </li>
      </ol>`

    }
})

customElements.define('spinners-tick', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        let state = this.getAttribute('state')

        this.innerHTML = `
        ${state === 'pending' ? `Pending` : ``}
        ${state === 'started' ? `<div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>`: ''}
        ${state === 'complete' ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="bi bi-check-lg" viewBox="0 0 16 16">
        <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
      </svg>`: ``}
      
      </div>`
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
        window.pageStore.dispatch({type:window.actionTypes.GITHUB_INITIALIZATION_CHANGED,payload:{startRunner:'complete'}})
        return result.json()
    }).then(data => {
        debugger;
    }).catch(error => {
        debugger;
    })
}

