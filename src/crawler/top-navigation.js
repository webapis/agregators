customElements.define('top-navigation', class extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    window.addEventListener('load', () => {

      const { contentView, auth } = window.pageStore.state
      this.render({ contentView, auth })

      window.pageStore.subscribe(window.actionTypes.CONTENT_VIEW_CHANGED, state => {
        const { contentView, auth } = state
        this.render({ contentView, auth })
      })
      window.pageStore.subscribe(window.actionTypes.AUTH_SUCCESS, state => {
        const { contentView, auth } = state
        this.render({ contentView, auth })
      })

      window.pageStore.subscribe(window.actionTypes.LOGOUT, state => {
        const { contentView, auth } = state
        this.render({ contentView, auth })
      })
    })

  }

  render({ contentView, auth }) {

    this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Web Scraper</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link ${contentView === 'home' && 'active'}" aria-current="page" href="/" id="home">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${contentView === 'projects' && 'active'}" href="/project-list.html" id="projects">Project Templates</a>
              </li>
              <li class="nav-item">
              <a class="nav-link ${contentView === 'projects' && 'active'}" href="/my-projects.html" id="myprojects">My Projects</a>
            </li>
              <li class="nav-item">
                <a class="nav-link ${contentView === 'project-editor' && 'active'}" href="/project-editor.html" tabindex="-1" aria-disabled="true" id="project-editor">Add Project Template</a>
              </li>
            </ul>
          
            <form class="d-flex">  
            ${auth !== null ? `<span class="m-2">${auth.user.email}</span>` : ''}           
              ${auth === null ? '<a class="btn btn-outline-success" href="/login.html" id="login">Login</a>' : ''}
              ${auth !== null ? '<button class="btn btn-outline-success" id="logout-btn">Logout</button>' : ''}
            </form>
          </div>
        </div>
      </nav>`

    this.querySelectorAll('a').forEach(element => {
      element.addEventListener('click', e => {

        const { id } = e.target
        debugger
        window.pageStore.dispatch({
          type: window.actionTypes.CONTENT_VIEW_CHANGED,
          payload: { view: id }
        });

      })
    })

    document.getElementById('logout-btn') && document.getElementById('logout-btn').addEventListener('click', e => {
      e.preventDefault()
      debugger
      window.pageStore.dispatch({
        type: window.actionTypes.LOGOUT,
        payload: null
      });
      window.pageStore.dispatch({
        type: window.actionTypes.CONTENT_VIEW_CHANGED,
        payload: { view: 'home' }
      });
      window.location.replace("/");
    })
  }
})