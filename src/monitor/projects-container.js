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
          `<div class="container">
   <div class="row">
          
          ${view === 'project-edit' ? `<edit-project class="col"></edit-project>` : ''}
          ${view === 'project-list' ? `<project-list class="col"></project-list>` : ''}
          ${view === 'project-detail'
            ? `<project-detail></project-detail>`
            : ''}

            </div>
          </div>`;

      }
    }
  }
);


