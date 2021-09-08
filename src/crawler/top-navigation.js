customElements.define('top-navigation', class extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {

    const { currentPage, auth } = window.pageStore.state


    this.render({ currentPage, auth })

    window.pageStore.subscribe(window.actionTypes.CONTENT_VIEW_CHANGED, state => {
      const { currentPage, auth } = state
      this.render({ currentPage, auth })
    })
    window.pageStore.subscribe(window.actionTypes.AUTH_SUCCESS, state => {
      const { currentPage, auth } = state
      this.render({ currentPage, auth })
    })

    window.pageStore.subscribe(window.actionTypes.LOGOUT, state => {
      const { currentPage, auth } = state
      this.render({ currentPage, auth })
    })






  }

  render({ currentPage, auth }) {

    this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Web Scraper</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link ${currentPage === 'home' && 'active'}" aria-current="page" href="/" id="home-page-link">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${currentPage === 'project-list' && 'active'}" href="#" id="project-list-link">Project Templates</a>
              </li>
              <li class="nav-item">
              <button class="btn nav-link ${currentPage === 'myprojects' && 'active'}" id="myprojects-btn">My Projects</button>
            </li>
              <li class="nav-item">
                <a class="nav-link ${currentPage === 'project-editor' && 'active'}" href="#" tabindex="-1" aria-disabled="true" id="add-project-template-link">Add Project Template</a>
              </li>

         
            </ul>
          
            <form class="d-flex">
            ${auth !== null ? ` <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${auth.user.displayName}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
              <li><a class="dropdown-item" href="#">  ${auth.user.email}</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="/user-settings.html">Settings</a></li>
          
             
            </ul>
          </li>
            </ul>` : ''}    
           
                   
              ${auth === null ? '<a class="btn btn-outline-success" href="/login.html" id="login">Login</a>' : ''}
              ${auth !== null ? '<button class="btn btn-outline-success" id="logout-btn">Logout</button>' : ''}
            </form>
          </div>
        </div>
      </nav>`
    document.getElementById('home-page-link').addEventListener('click', (e) => {
      e.preventDefault()

      window.pageStore.dispatch({
        type: window.actionTypes.PAGE_NAVIGATED,
        payload: 'home'
      });
      window.location.replace("/");
    })
    document.getElementById('project-list-link').addEventListener('click', (e) => {
      e.preventDefault()

      window.pageStore.dispatch({
        type: window.actionTypes.PAGE_NAVIGATED,
        payload: 'project-list'
      });
      window.location.replace("/project-list.html");
    })

    document.getElementById('add-project-template-link').addEventListener('click', (e) => {
      e.preventDefault()
      window.pageStore.dispatch({
        type: window.actionTypes.PAGE_NAVIGATED,
        payload: 'project-editor'
      });
      window.pageStore.dispatch({
        type: window.actionTypes.ADD_PROJECT_TEMPLATE,

      });
      window.location.replace("/project-editor.html");
    })

    document.getElementById('myprojects-btn').addEventListener('click', async (e) => {
      e.preventDefault()
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          window.pageStore.dispatch({
            type: window.actionTypes.PAGE_NAVIGATED,
            payload: 'myprojects'
          });
          window.location.replace("/my-projects.html");

          // ...
        } else {
          window.googleAuth({ navAfterAuth: '/my-projects.html' })
          // User is signed out
          // ...
        }
      })




      // 
    })
    document.getElementById('logout-btn') && document.getElementById('logout-btn').addEventListener('click', e => {
      e.preventDefault()


      firebase.auth().signOut().then(() => {

        window.pageStore.dispatch({
          type: window.actionTypes.LOGOUT,
          payload: null
        });

        window.location.replace("/");
      }).catch((error) => {
        // An error happened.
      });

    })
  }
})