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
      this.innerHTML = `<div class="container d-flex justify-content-center">
      <div class="col-4">
      <div class="card mt-5">
  <div class="card-header">
  New Project
  </div>
  <div class="card-body">

  <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Project Name</label>
  <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="enter project name">
</div>
<div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Project Description</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="enter project description"></textarea>
  <a href="#" class="btn btn-primary mt-2">Save</a>
</div>
  </div>
  </div>
</div>
  
  
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
        .addEventListener('click', function () {
          const { state: { projectName } } = window.pageStore;
          debugger;
          firebase
            .database()
            .ref(`projects/${projectName}`)
            .set({ ready: true });
          window.pageStore.dispatch({
            type: window.actionTypes.VIEW_CHANGED,
            payload: 'project-list'
          });
          debugger;
        });
    }
  }
);
