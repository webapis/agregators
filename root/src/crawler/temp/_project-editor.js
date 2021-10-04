customElements.define('project-editor', class extends HTMLElement {
  constructor() {
    super()
  }

  async connectedCallback() {
    const resources= await import('./resources.js')
    await resources.default()
  
      const { loading, projectName, description,githuburl } = window.pageStore.state
      this.render({ loading, projectName, description,githuburl })
    

  }


  render({ loading, projectName, description,githuburl }) {
    
    this.innerHTML = `
    <top-navigation></top-navigation>
    <div class="container">
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
  <label for="description" class="col-sm-2 col-form-label">Project Description</label>
  <div class="col-sm-10">
    <input class="form-control" id="githuburl" name="githuburl" placeholder="github url" value=${githuburl}/>
  </div>  
</div>
  <div class="mb-3 row">
  <label for="description" class="col-sm-2 col-form-label"> </label>
  <div class="col-sm-10">
  <button type="button" class="btn btn-secondary" id="save-project-btn">Save</button>
  </div>
</div>
  </fieldset>
    </div>
    <app-footer></app-footer>
    `

    document.getElementById('projectName').addEventListener('input', this.handleInputChange)
    document.getElementById('githuburl').addEventListener('input', this.handleInputChange)
    document.getElementById('description').addEventListener('input', this.handleInputChange)
    document.getElementById('save-project-btn').addEventListener('click', this.handleSave)
  }


  handleInputChange(e) {
    const { name, value } = e.target
    
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
        const { projectName, description,githuburl } = window.pageStore.state
        
        
        var updates = {};
        updates['/projects/' + projectName] = {description,githuburl};
        updates['/myprojects/' + uid + '/' + projectName] = {description,githuburl};
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

