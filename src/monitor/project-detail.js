customElements.define(
  'project-detail',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { user:{ticket}, view, selectedProjectName } } = window.pageStore;
      let started =false
     const dataCollection= firebase
      .database()
      .ref(`projects/${selectedProjectName}/dataCollection`)
      dataCollection.on('value',(snapshot)=>{
        const state =snapshot.val()
        this.render({dataCollection:state,selectedProjectName});
        if(state===1 && !window.pageStore.state[selectedProjectName]){ 
          debugger; 
          window.pageStore.dispatch({
            type: window.actionTypes.PROJECT_STARTED,
            payload: selectedProjectName
          });
          dispatchAction({projectName:selectedProjectName,ticket})
          
        } else
          if(state=>2    ){
            window.pageStore.dispatch({
              type: window.actionTypes.PROJECT_STOPPED,
              payload:   selectedProjectName
            });
          }
        
    
      })
     
    }

    render({dataCollection,selectedProjectName}) {
    
     // const { state: { user:{ticket}, view, selectedProjectName } } = window.pageStore;

      this.innerHTML = `

        <div class="container">
       
          <div class="row border border-1 p-5 rounded mt-5">

        <div class="col-8">
        <h3 class="fw-light">Project Name: <i class="text-decoration-underline fw-normal">${selectedProjectName}</i></h3>
        </div>
      
        <div class="col-2">
        <button class="btn btn-primary" id='start-scrape' ${dataCollection!==0 && 'disabled'}>Start Scraping</button>
        </div>
       
        <div class="col-2"> 
        <button class="btn btn-warning" id='start-scrape' ${dataCollection===0 && 'disabled'}>Cancel</button>
        </div>
     
           </div>


        <div class="row border border-1 p-5 rounded mt-1" id="progress-monitor-container">
        <h3 class="fw-light">Progress Monitor</h3>
        <div class="col-12 d-flex justify-content-center" id ="spinner-container">
        ${dataCollection===3 ? `
        <div class="spinner-border text-success" style="width: 4rem; height: 4rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div> <div>Scraping data... </div>`:'' }
      ${dataCollection===2 ? `
      <div class="spinner-border text-info" style="width: 4rem; height: 4rem;" role="status">
      <span class="visually-hidden">Loading...</span>
    </div> <div>Starting server... </div>`:'' }
       
      ${dataCollection===1 ?`
      <div>
      <div class="spinner-grow text-info" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
</div>
      <div>Please wait... </div>`:""}

      
        </div>


        
        <div class="col-12" id ="pages-retrieved">Pages retrieved: <b class="text-decoration-underline">0</b>
        
        </div>

        <div class="col-12" id ="collected-data-counter">Data Rows collected:<b class="text-decoration-underline">0</b>
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

     firebase
        .database()
        .ref(`projects/${selectedProjectName}`).update({dataCollection:1})
   
     
      });
    }
  }
);


function dispatchAction({projectName,ticket}){
   import('https://cdn.skypack.dev/@octokit/request').then(module => {
          const { request } = module;
          request(
            'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
            {
              headers: {
                authorization: `token ${ticket}`,
                Accept: 'application/vnd.github.v3+json'
              },
              data: { ref: 'action', inputs: { projectName } },
              repo: 'agregators',
              owner: 'webapis',
              workflow_id: 'aggregate.yml'
            }
          )
            .then(result => {
              firebase
              .database()
              .ref(`projects/${selectedProjectName}`).update({dataCollection:2})
              debugger;
              console.log(`${result.data} repos found.`);
            })
            .catch(err => {
              debugger;
            });
        });
}