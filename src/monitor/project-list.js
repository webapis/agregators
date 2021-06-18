/* eslint-disable no-undef */
customElements.define(
  'project-list',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `<div class="container">
      <div class="row d-flex justify-content-center">
      <h3 class="col text-center">Projects</h3>
      </div>
        <div class="row d-flex justify-content-center" id="project-name-container"></div>
      </div>`;
  
      var commentsRef = firebase.database().ref('projects');
      const container = document.getElementById('project-name-container');
      commentsRef.on('child_added', data => {
      
        const projectName = data.key;
        debugger;

        const projectCard = document.createElement('project-card');
        projectCard.classList.add('col-3')
        projectCard.setAttribute('project-name',projectName)
  
        container.appendChild(projectCard);
      });
    }
  }
);
