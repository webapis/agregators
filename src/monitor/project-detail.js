customElements.define(
  'project-detail',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const { state: { user:{ticket}, view, selectedProjectName } } = window.pageStore;
debugger;
      this.innerHTML = `<div>
  
        <div>
        ${selectedProjectName}
        <div>
        <button class="btn btn-secondary" id='start-scrape'>Start Scraping</button>
        </div>
        </div>
        </div>`;


      document.getElementById('start-scrape').addEventListener('click', () => {
        import('https://cdn.skypack.dev/@octokit/request').then(module => {
          const { request } = module;
          request(
            'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
            {
              headers: {
                authorization: `token ${ticket}`,
                Accept: 'application/vnd.github.v3+json'
              },
              data: { ref: 'action', inputs: { projectName: 'books' } },
              repo: 'agregators',
              owner: 'webapis',
              workflow_id: 'aggregate.yml'
            }
          )
            .then(result => {
              debugger;
              console.log(`${result.data} repos found.`);
            })
            .catch(err => {
              debugger;
            });
        });
      });
    }
  }
);
