customElements.define('top-navigation', class extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {

    const {contentView}= window.pageStore.state
    this.render({contentView})

    window.pageStore.subscribe(window.actionTypes.CONTENT_VIEW_CHANGED, state => {
      const { contentView } = state
      this.render({contentView})
    })
  }

  render({ contentView }) {

    this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Web Scraper</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link ${contentView==='home'&& 'active'}" aria-current="page" href="#" id="home">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${contentView==='projects'&& 'active'}" href="#" id="projects">Projects</a>
              </li>
           
              <li class="nav-item">
                <a class="nav-link ${contentView==='project-editor'&& 'active'}" href="#" tabindex="-1" aria-disabled="true" id="project-editor">Add Project</a>
              </li>
            </ul>
          
            <form class="d-flex">             
              <button class="btn btn-outline-success" type="submit">Login</button>
            </form>
          </div>
        </div>
      </nav>`

    this.querySelectorAll('a').forEach(element => {
      element.addEventListener('click', e => {
        e.preventDefault()
        const { id } = e.target
        debugger
        window.pageStore.dispatch({
          type: window.actionTypes.CONTENT_VIEW_CHANGED,
          payload: { view: id }
        });
      })
    })

  }
})