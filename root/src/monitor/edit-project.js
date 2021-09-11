/* eslint-disable no-undef */
customElements.define(
  'edit-project',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { projectName,projectDescription } } = window.pageStore;
      this.render({ projectName,projectDescription });
    }

    render({ projectName,projectDescription }) {
      this.innerHTML = `<div class="container d-flex justify-content-center">
      <div class="col-4">
      <div class="card mt-5">
  <div class="card-header">
  New Project
  </div>
  <div class="card-body">

  <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Project Name</label>
  <input type="email" class="form-control" id="project-name-input" placeholder="enter project name">
</div>
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Project Description</label>
  <textarea class="form-control" id="project-description-input" rows="3" placeholder="enter project description"></textarea>
  <a href="#" class="btn btn-primary mt-2" id="save-project-btn">Save</a>
</div>
  </div>
  </div>
</div>
      </div>`;
      document.getElementById('project-name-input').value = projectName? projectName:'';
      document.getElementById('project-name-input').addEventListener('input', e => {
        const { value } = e.target;

        window.pageStore.dispatch({
          type: window.actionTypes.PROJECT_NAME_CHANGED,
          payload: value
        });
      });
      document.getElementById('project-description-input').value = projectDescription?projectDescription:''
      document.getElementById('project-description-input').addEventListener('input', e => {
        const { value } = e.target;

        window.pageStore.dispatch({
          type: window.actionTypes.PROJECT_DESCRIPTION_CHANGED,
          payload: value
        });
      });
      document
        .getElementById('save-project-btn')
        .addEventListener('click', function () {
          const { state: { projectName,projectDescription } } = window.pageStore;
          
          firebase
            .database()
            .ref(`projects/${projectName}`)
            .set({ dataCollection: 0,projectDescription });
          
          window.pageStore.dispatch({
            type: window.actionTypes.VIEW_CHANGED,
            payload: 'project-list'
          });
          
        });
    }
  }
);
