customElements.define('project-editor', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `<div class="container">
        <fieldset>
        <legend>Add Project:</legend>
        <div class="mb-3 row">
        <label for="projectName" class="col-sm-2 col-form-label">Project Name</label>
        <div class="col-sm-10">
        <input type="text" class="form-control" id="projectName">
      </div>
      </div>
      <div class="mb-3 row">
        <label for="description" class="col-sm-2 col-form-label">Project Description</label>
        <div class="col-sm-10">
          <textarea class="form-control" id="description" rows="3"></textarea>
        </div>
      </div>
      <div class="mb-3 row">
      <label for="description" class="col-sm-2 col-form-label"> </label>
      <div class="col-sm-10">
      <button type="button" class="btn btn-secondary">Save</button>
      </div>
    </div>
      </fieldset>
        </div>`
    }
})