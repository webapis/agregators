customElements.define('progress-monitor', class extends HTMLElement {

    constructor() {

        super()

    }

    connectedCallback() {
        const { state: { view, selectedProjectName } } = window.pageStore;
        const dataCollectionRef = firebase
            .database()
            .ref(`projects/${selectedProjectName}`)
        dataCollectionRef.on('value', (snapshot) => {
            const { dataCollection } = snapshot.val()

            this.render({ dataCollection });

        })


    }

    render({ dataCollection }) {
        this.innerHTML = `
        
      
<div class="row">
<h3 class="fw-light col-12 pb-2 border-bottom">Progress Monitor</h3>
<monitor-log class="col-6"></monitor-log>
<progress-status class="col-6 d-flex flex-column justify-content-center"></progress-status>

</div>



    `

    }

})




customElements.define('monitor-log', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { state: { view, selectedProjectName } } = window.pageStore;
        const dataCollectionRef = firebase
            .database()
            .ref(`projects/${selectedProjectName}`)
        dataCollectionRef.on('value', (snapshot) => {
            const { dataCollection, totalDataCollected, end, start, xlsx } = snapshot.val()
            const startDate = new Date(start)
            const endDate = end === '' ? '' : new Date(end)
            const duration = end === '' ? '' : window.diff(start, end)
            this.render({ totalDataCollected, startDate, endDate, duration,xlsx })

        })

    }

    render({ totalDataCollected, startDate, endDate, duration, xlsx,selectedProjectName }) {

        this.innerHTML = ` 
        <div>
      <ol class="list-group list-group-numbered">
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
 
    Data collected:
    </div>
    <span class="badge bg-primary rounded-pill">${totalDataCollected}</span>
  </li>
  
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
     
    Start:
    </div>
    <span class="badge bg-secondary rounded-pill">${startDate}</span>
  </li>
  
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
     
    End:
    </div>
    <span class="badge bg-secondary rounded-pill">${endDate}</span>
  </li>

  <li class="list-group-item d-flex justify-content-between align-items-start">

    <div class="ms-2 me-auto">

    Duration:
    </div>
    <span class="badge bg-primary rounded-pill">${duration}</span>
  </li>

  ${xlsx===''?'':`  <li class="list-group-item d-flex justify-content-between align-items-start">
  <div class="ms-2 me-auto">
   
  Download:
  </div>
  <b class="text-decoration-underline btn btn-link" id="download-last-scrape"> Excel </b>
</li>`}

</ol>
</div>
        `
        if(xlsx && document.getElementById('download-last-scrape')){
            debugger;
            document.getElementById('download-last-scrape').addEventListener('click', () => {
                window.downloadFile({ downloadpath: xlsx })
            })
        }
  


       const durcounter = document.getElementById("duration-counter")
        let liveDurationInterval = null
        const endRef = firebase
            .database()
            .ref(`projects/${selectedProjectName}/end`)
        endRef.on('value', (snapshort) => {
            const datetimestamp = snapshort.val()
            if (datetimestamp === '') {
                debugger;
                liveDurationInterval = liveDurationInterval === null && setInterval(() => {
                    const spantime = window.diff(startDate, Date.now())
                    document.getElementById("duration-counter").innerHTML = ''
                    document.getElementById("duration-counter").innerHTML = spantime
                }, 1000)
            } else {
                if(durcounter){
                    clearInterval(liveDurationInterval)
                    durcounter.innerHTML = `${duration}`;
                }
          
            
              

            }
        
})

}

})


customElements.define('progress-status', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const { state: { view, selectedProjectName } } = window.pageStore;
        const dataCollectionRef = firebase
            .database()
            .ref(`projects/${selectedProjectName}`)
        dataCollectionRef.on('value', (snapshot) => {
            const { dataCollection, } = snapshot.val()

            this.render({ dataCollection })

        })
    }

    render({ dataCollection }) {
        this.innerHTML = `  

<div  id="progress-monitor-container  class="f-flex justify-content-center bg-warning h-100">

<div class="col-12 d-flex justify-content-center" id ="spinner-container">


${dataCollection === 4 ? `
<div class="d-flex flex-column justify-content-center">
<div class="text-center">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="green" class="bi bi-check-lg" viewBox="0 0 16 16">
<path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
</svg>
</div>
<div class="text-center">Scraping Completed... </div>
</div>`: ''}



${dataCollection === 3 ? `
<div class="d-flex flex-column align-items-center">
<div class="spinner-grow text-success" role="status">
  <span class=" text-center visually-hidden">Loading...</span>
</div>

<div class="text-center">Scraping data... </div> </div>`: ''}


${dataCollection === 2 ? `
<div class="d-flex flex-column align-items-center">
<div class="text-center spinner-border text-info" style="width: 4rem; height: 4rem;" role="status">
<span class="visually-hidden">Loading...</span>
</div>

<div  class="text-center">Starting server... </div>

</div>`: ''}



${dataCollection === 1 ? `
<div class="d-flex flex-column align-items-center">
<div class="spinner-grow text-info" role="status">
<span class="visually-hidden">Loading...</span>
</div>

<div  class="text-center">Please wait... </div>`: ""}


</div>
</div>
`
    }
})