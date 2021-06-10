/* eslint-disable no-undef */
customElements.define(
  'edit-project',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { projectName } } = window.pageStore;
      this.render({ projectName });
    }

    render({ projectName }) {
      this.innerHTML = `<div>
      <input placeholder="project name" id="project-name" />
      <button class="btn btn-secondary" id="save-project">Save</button>
      </div>`;
      document.getElementById('project-name').value = projectName;
      document.getElementById('project-name').addEventListener('input', e => {
        const { value } = e.target;

        window.pageStore.dispatch({
          type: window.actionTypes.PROJECT_NAME_CHANGED,
          payload: value
        });
      });

      document
        .getElementById('save-project')
        .addEventListener('click', function() {
          const { state: { projectName } } = window.pageStore;
          debugger;
          firebase.database().ref('projects').push({ projectName });
          window.pageStore.dispatch({
            type: window.actionTypes.VIEW_CHANGED,
            payload: 'project-list'
          });
          debugger;
        });
    }
  }
);
