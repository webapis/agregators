customElements.define(
  'project-detail',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { view, selectedProjectName,user } } = window.pageStore;

      const dataCollectionRef = firebase
        .database()
        .ref(`projects/${selectedProjectName}`)
      dataCollectionRef.on('value', (snapshot) => {
        const { dataCollection, totalDataCollected, end, start,xlsx,projectDescription } = snapshot.val()
       
        const startDate = new Date(start)
        const endDate = end === '' ? '' : new Date(end)
        const duration = end === '' ? '' : window.diff(start, end)
        this.render({ dataCollection, totalDataCollected, selectedProjectName, duration, startDate, endDate,xlsx,projectDescription,user });

      })

    }//connectedCallback

    render({ dataCollection, totalDataCollected, selectedProjectName, duration, startDate, endDate, xlsx,projectDescription,user}) {



      this.innerHTML = `
        <div class="container">
       
          <div class="row border border-1 p-5 rounded mt-5">

        <div class="col-6">
        <h3 class="fw-light">Project Name: <i class="text-decoration-underline fw-normal">${selectedProjectName}</i></h3>
        <h5 class="fw-light">Project Description : ${projectDescription}</h5>
        </div>
      
        <div class="col-4">
        <div class="row">

        <div class="col-12 pb-2">
        <input type="text" class="form-control" placeholder="Enter Company Name" id="company-name">
        </div>

        <div class="col-12">
        <button class="btn btn-primary" id='start-scrape' ${(dataCollection > 0 && dataCollection !== 4) && 'disabled'}>Start Scraping</button>
        </div>
        
        </div>
      
        </div>
       
        <div class="col-2"> 

        </div>
        
        </div>

  
      
        <progress-monitor class="row border border-1  rounded mt-5 "></progress-monitor>
        <div class="row border border-1 border-bottom-0  mt-5" >
      
        <h3 class="fw-light">Data collection Result:</h3>
        </div>
     
        <div class="row border border-1  border-top-0 " id="scrape-result-container">
      

        </div>
        `;
     document.getElementById('company-name').addEventListener('input',(e)=>{
 const {value}=e.target
     
           window.pageStore.dispatch({
             type: window.actionTypes.COMPANY_NAME_CHANGED,
             payload: value
           });
     })

      document.getElementById('start-scrape').addEventListener('click', () => {
        

        const ticket = firebase
        .database()
        .ref(`gitticket`)
      ticket.once('value', data => {
        
        const tkt = data.val()

        dispatchAction({ticket:tkt})
      })
        
      
          // window.pageStore.dispatch({
          //   type: window.actionTypes.VIEW_CHANGED,
          //   payload: 'signin-google'
          // });
        
       
      });
      const resultContainer = document.getElementById('scrape-result-container')
      resultContainer.innerHTML = ``
      const collectionRef = firebase
        .database()
        .ref(`collections/${selectedProjectName}`)
      collectionRef.orderByChild("end").on('child_added', (shapshot) => {
        
        const { json, xlsx, start, end } = shapshot.val()
        

        const scrapeResult = document.createElement('scraping-result')
        scrapeResult.setAttribute('upload-path-xlsx', xlsx)
        scrapeResult.setAttribute('upload-path-json', json)
        scrapeResult.setAttribute('start', start)
        scrapeResult.setAttribute('end', end)

        resultContainer.prepend(scrapeResult)
        
      })

      
      
    
    }//render
  }
);

function dispatchAction({ticket}) {
  const { state: { user, view, selectedProjectName,companyName } } = window.pageStore;
  const dataCollectionRef = firebase
    .database()
    .ref(`projects/${selectedProjectName}`)
  dataCollectionRef.update({ dataCollection: 1, totalDataCollected: 0, start: Date.now(), end: '',xlsx:'' }, (error) => {
    if (error) {
      
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
            data: { ref: 'action', inputs: { projectName: selectedProjectName,companyName:companyName } },
            repo: 'agregators',
            owner: 'webapis',
            workflow_id: 'aggregate.yml'
          }
        )
          .then((result) => {
            
            dataCollectionRef.update({ dataCollection: 2 }, (error) => {
              if (error) {
                
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