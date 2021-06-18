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
        import('./project-detail.js')
      ]).then(modules => {
        window.pageStore = modules[0].createStore(
          modules[1].default,
          modules[1].initState,
          'page-store'
        );
        window.actionTypes = modules[1].actionTypes;
        this.render();
      });
    }

    render() {
      this.innerHTML = `<div>
      <navigation-component></navigation-component>
      <projects-container></projects-container>
      </div>`;
    }
  }
);
