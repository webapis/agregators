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
      const { state: { user, view, selectedProjectName } } = window.pageStore;
      this.innerHTML = `<div>
        <a href="#" id="show-projest-list">Projest List</a>
        <div>
        ${selectedProjectName}
        <div>
        <button class="btn btn-secondary" id='start-scrape'>Start Scraping</button>
        </div>
        </div>
        </div>`;
      document
        .getElementById('show-projest-list')
        .addEventListener('click', e => {
          e.preventDefault();
          window.pageStore.dispatch({
            type: window.actionTypes.VIEW_CHANGED,
            payload: 'project-list'
          });
        });

      document.getElementById('start-scrape').addEventListener('click', () => {
        import('https://cdn.skypack.dev/@octokit/request').then(module => {
          const { request } = module;
          request(
            'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
            {
              headers: {
                authorization: 'token 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',
                Accept: 'application/vnd.github.v3+json'
              },
              data: { ref: 'master' },
              repo: 'agregators',
              owner: 'webapis',
              workflow_id: 'helloworld.yml'
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