customElements.define(
  'project-detail',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { user: { ticket }, view, selectedProjectName } } = window.pageStore;

      const dataCollectionRef = firebase
        .database()
        .ref(`projects/${selectedProjectName}`)
        dataCollectionRef.on('value', (snapshot) => {
        const {dataCollection,dataCollected} = snapshot.val()
        this.render({ dataCollection,dataCollected, selectedProjectName });
    
      })


    }

    render({ dataCollection, dataCollected,selectedProjectName }) {

      this.innerHTML = `

        <div class="container">
       
          <div class="row border border-1 p-5 rounded mt-5">

        <div class="col-8">
        <h3 class="fw-light">Project Name: <i class="text-decoration-underline fw-normal">${selectedProjectName}</i></h3>
        </div>
      
        <div class="col-2">
        <button class="btn btn-primary" id='start-scrape' ${(dataCollection > 0 && dataCollection!==4) && 'disabled'}>Start Scraping</button>
        </div>
       
        <div class="col-2"> 
        <button class="btn btn-warning" id='start-scrape' ${dataCollection > 0 && 'disabled'}>Cancel</button>
        </div>
     
           </div>


        <div class="row border border-1 p-5 rounded mt-1" id="progress-monitor-container">
        <h3 class="fw-light">Progress Monitor</h3>
        <div class="col-12 d-flex justify-content-center" id ="spinner-container">
        ${dataCollection === 4 ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="green" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z"/>
</svg> <div>Scraping Completed... </div>`: ''}
        ${dataCollection === 3 ? `
        <div class="spinner-border text-success" style="width: 4rem; height: 4rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div> <div>Scraping data... </div>`: ''}
      ${dataCollection === 2 ? `
      <div class="spinner-border text-info" style="width: 4rem; height: 4rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div> <div>Starting server... </div>`: ''}
       
      ${dataCollection === 1 ? `
      <div>
      <div class="spinner-grow text-info" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
</div>
      <div>Please wait... </div>`: ""}

      
        </div>


        
        <div class="col-12" id ="pages-retrieved">Pages retrieved: <b class="text-decoration-underline">0</b>
        
        </div>

        <div class="col-12" id ="collected-data-counter">Data Rows collected:<b class="text-decoration-underline">${dataCollected}</b>
        </div>

        <div class="col-12" id ="duration-container">Duration Container:<b class="text-decoration-underline">0</b>
        </div>

        </div>




        <div class="row border border-1 p-5 rounded mt-1" id="scrape-result-container">
        <h3 class="fw-light">Data collection Result:</h3>
        <scraping-result class="col-12  m-4"></scraping-result>
        <scraping-result class="col-12  m-4"></scraping-result>  
        </div>


        </div>`;


      document.getElementById('start-scrape').addEventListener('click', () => {
        dispatchAction()
      });
    }
  }
);

function dispatchAction() {
  const { state: { user: { ticket }, view, selectedProjectName } } = window.pageStore;
  const dataCollectionRef = firebase
    .database()
    .ref(`projects/${selectedProjectName}`)
  dataCollectionRef.update({ dataCollection: 1 }, (error) => {
    if (error) {
      debugger;
      errorHandler({ error })
    } else {
      debugger;
      import('https://cdn.skypack.dev/@octokit/request').then(module => {
        const { request } = module;
        request(
          'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
          {
            headers: {
              authorization: `token ${ticket}`,
              Accept: 'application/vnd.github.v3+json'
            },
            data: { ref: 'action', inputs: { projectName:selectedProjectName } },
            repo: 'agregators',
            owner: 'webapis',
            workflow_id: 'aggregate.yml'
          }
        )
          .then(() => {
            debugger;
            dataCollectionRef.update({ dataCollection: 2 }, (error) => {
              if (error) {
                debugger;
                errorHandler({ error })
              }
            })
          })
          .catch(error => {
            debugger;
            errorHandler({ error })
          });
      });
    }
  })

}



function errorHandler(error) {
  window.pageStore.dispatch({
    type: window.actionTypes.ERROR,
    payload: error
  });
}