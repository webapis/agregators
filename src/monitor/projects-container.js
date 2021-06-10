customElements.define(
  'projects-container',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const { state: { user, view } } = window.pageStore;
   
      this.render({ user, view });

      window.pageStore.subscribe(window.actionTypes.SIGNED_IN, state => {
        const { user, view } = state;

        this.render({ user, view });
      });
      window.pageStore.subscribe(window.actionTypes.SIGNED_OUT, state => {
        const { user, view } = state;

        this.render({ user, view });
      });
      window.pageStore.subscribe(window.actionTypes.VIEW_CHANGED, state => {
        const { user, view } = state;

        this.render({ user, view });
      });
      window.pageStore.subscribe(
        window.actionTypes.PROJECT_NAME_SELECTED,
        state => {
          const { user, view } = state;
        
          this.render({ user, view });
        }
      );
    }

    render({ user, view }) {
      if (user) {
        
        this.innerHTML =
          user &&
          `<div>
          <div>
          <button class="btn btn-primary" id ="add-project">Add Project</button>
          </div>
          
          ${view === 'project-edit' ? `<edit-project></edit-project>` : ''}
          ${view === 'project-list' ? `<project-list></project-list>` : ''}
          ${view === 'project-detail'
            ? `<project-detail></project-detail>`
            : ''}
          </div>`;
        document
          .getElementById('add-project')
          .addEventListener('click', function() {
            addProject();
          });
      }
    }
  }
);

function addProject() {
  import('./edit-project.js').then(() => {});

  window.pageStore.dispatch({
    type: window.actionTypes.VIEW_CHANGED,
    payload: 'project-edit'
  });
}
