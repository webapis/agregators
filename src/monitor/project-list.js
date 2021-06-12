/* eslint-disable no-undef */
customElements.define(
  'project-list',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `<div id="project-name-container" class="d-flex flex-column"></div>`;
      var database = firebase.database();
      var commentsRef = database.ref('projects');
      const container = document.getElementById('project-name-container');
      commentsRef.on('child_added', data => {
      
        const projectName = data.key;
        debugger;
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = projectName;
        a.id = projectName;
        a.addEventListener('click', e => {
          const { id } = e.target;
          e.preventDefault();
          import('./project-detail.js').then(() => {
            window.pageStore.dispatch({
              type: window.actionTypes.PROJECT_NAME_SELECTED,
              payload: id
            });
          });
        });
        container.appendChild(a);
      });
    }
  }
);
