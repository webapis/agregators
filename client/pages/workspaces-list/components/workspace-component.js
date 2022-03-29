customElements.define('workspace-component', class extends HTMLElement {

  constructor() {
    super()
  }

  connectedCallback() {
    this.classList.add('col-3')
    const title = this.getAttribute('title')
    const accessLevel = this.getAttribute('accesslevel')
    const description = this.getAttribute('description')
    const owner = this.getAttribute('owner')
    this.innerHTML = `<div class="card"  style="width: 23rem;">
   
  <ul class="list-group list-group-flush">
    <li class="list-group-item d-flex justify-content-between"><span class="fw-normal">name:</span><span class="fw-light" id="${title}-ws-title">${title}</span></li>
    <li class="list-group-item d-flex justify-content-between"><span class="fw-normal">description:</span><span class="fw-light" id="${title}-ws-description">${description}</span></li>
    <li class="list-group-item d-flex justify-content-between"><span class="fw-normal">access_level:</span><span class="fw-light" id="${title}-ws-access-level">${accessLevel}</span></li>
    <li class="list-group-item d-flex justify-content-between"><span class="fw-normal">owner:</span><span class="fw-light" id ="${title}-ws-owner">${owner}</span></li>
  </ul>

  <div class="card-body">
  <a href="#" class="btn btn-outline-success btn-sm" id="${title}-tasks">Tasks</a>
  <a href="#" class="btn btn-outline-warning btn-sm" id="${title}-vars">Vars</a>
  <a href="#" class="btn btn-outline-warning btn-sm" id="${title}-input">Input</a>
  <a href="#" class="btn btn-outline-warning btn-sm"id="${title}-oauth">Oauth</a>
  <a href="#" class="btn btn-outline-warning btn-sm" id="${title}-edit"><edit-icon></edit-icon></a>
  <a href="#" class="btn btn-outline-danger btn-sm"id="${title}-delete"><delete-icon></delete-icon></a>
</div>
</div>`
    document.getElementById(`${title}-tasks`).addEventListener('click', (e) => {

      localStorage.setItem('workspace', JSON.stringify({ title, accessLevel, description, owner }))
      window.location.replace('/pages/workspace-tasks/workspace-tasks.html')
    })

    document.getElementById(`${title}-input`).addEventListener('click', (e) => {

      localStorage.setItem('workspace', JSON.stringify({ title, accessLevel, description, owner }))
      window.location.replace('/pages/input/input-configuration.html')
    })

    document.getElementById(`${title}-vars`).addEventListener('click', (e) => {

      localStorage.setItem('workspace', JSON.stringify({ title, accessLevel, description, owner }))
      window.location.replace('/pages/env-vars/workspace-scope-vars.html')
    })

    document.getElementById(`${title}-oauth`).addEventListener('click', (e) => {

      localStorage.setItem('workspace', JSON.stringify({ title, accessLevel, description, owner }))
      window.location.replace('/pages/oauth-configuration/oauth-configuration.html')
    })

    document.getElementById(`${title}-edit`).addEventListener('click', (e) => {

      
      localStorage.setItem('workspace', JSON.stringify({ title, accessLevel, description, owner }))
      window.location.replace('/pages/workspace-editor/workspace-editor.html')
    })

    document.getElementById(`${title}-delete`).addEventListener('click', async(e) => {

      if (confirm(`Are you sure you want to delete ${title}? workspace?`)) {
        // Save it!

        const { screenName, localId } = JSON.parse(localStorage.getItem('auth'))
        let update = {}
        if (accessLevel === "private") {
          
          update = { [`private/${localId}/workspaces/${title}`]: null }
        } else {
          
          update = { [`public/workspaces/${title}`]: null }
        }


        
        const data = await window.firebase().ref('/').update(update)
        if (data) {
          window.location.replace('../workspaces-list/workspaces-list.html')
        }
        
      } else {
        // Do nothing!
        console.log('Thing was not saved to the database.');
      }
    })
  }
})

