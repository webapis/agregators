customElements.define('project-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    window.addEventListener('load', () => {
      const { loading, projectName, description } = window.pageStore.state
      this.render({ loading, projectName, description })
    })

  }


  render({ loading, projectName, description }) {
    debugger
    this.innerHTML = `<div class="container">
    <fieldset>
    <legend>Add Project:</legend>
    <div class="mb-3 row">
    <label for="projectName" class="col-sm-2 col-form-label">Project Name</label>
    <div class="col-sm-10">
    <input type="text" class="form-control" id="projectName" name="projectName" value=${projectName}>
  </div>
  </div>
  <div class="mb-3 row">
    <label for="description" class="col-sm-2 col-form-label">Project Description</label>
    <div class="col-sm-10">
      <textarea class="form-control" id="description" rows="3" name="description" >${description}</textarea>
    </div>
  </div>
  <div class="mb-3 row">
  <label for="description" class="col-sm-2 col-form-label"> </label>
  <div class="col-sm-10">
  <button type="button" class="btn btn-secondary" id="save-project-btn">Save</button>
  </div>
</div>
  </fieldset>
    </div>`

    document.getElementById('projectName').addEventListener('input', this.handleInputChange)
    document.getElementById('description').addEventListener('input', this.handleInputChange)
    document.getElementById('save-project-btn').addEventListener('click', this.handleSave)
  }


  handleInputChange(e) {
    const { name, value } = e.target
    debugger
    window.pageStore.dispatch({
      type: window.actionTypes.INPUT_CHANGED,
      payload: { name, value }
    });
  }

  handleSave() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        window.pageStore.dispatch({ type: window.actionTypes.LOADING })
        const { projectName, description } = window.pageStore.state
        
        
        var updates = {};
        updates['/projects/' + projectName] = {description};
        updates['/myprojects/' + uid + '/' + projectName] = {description};
        firebase
          .database()
          .ref().update(updates, (error) => {
            if (error) {
              window.pageStore.dispatch({ type: window.actionTypes.ERROR, error })
            }
            window.pageStore.dispatch({ type: window.actionTypes.PROJECT_SAVED })
            window.location.replace("/project-list.html");
          })
      } else {
        // User is signed out
        // ...
      }
    });
  

  }

})

