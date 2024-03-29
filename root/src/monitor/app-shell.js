customElements.define(
  'app-shell',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      Promise.all([
        import('./air-store.js'),
        import('./reducer.js'),
        import('./navigation-component.js'),
        import('./project-card.js'),
        import('./project-list.js'),
        import('./projects-container.js'),
        import('./project-detail.js'),
        import('./home-component.js'),  
        import('./scraping-result.js'),
        import('./edit-project.js'),
        import('./error-component.js'),
        import('./progress-monitor.js'),
        import('./diff.js',
        import('./signin-google.js'),
        )
      ]).then(modules => {
        window.pageStore = modules[0].createStore(
          modules[1].default,
          modules[1].initState,
          'page-store'
        );
        window.actionTypes = modules[1].actionTypes;
        window.diff =modules[12].diff
        window.downloadFile=modules[12].downloadFile
        window.signin=modules[12].signin
        this.render();
      });
    }

    render() {
      this.innerHTML = `<div>
      <error-component></error-component>
      <navigation-component></navigation-component>
      <projects-container></projects-container>
      </div>`;
    }
  }
);
