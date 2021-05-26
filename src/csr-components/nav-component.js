customElements.define(
  'nav-component',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      fetch(`${window.location.origin}/nav.html`)
        .then(response => response.text())
        .then(html => {
          this.innerHTML = `${html}`;

          document.querySelectorAll('[data-bs-target]').forEach(element => {
            element.addEventListener('click', function() {
              let id = element.getAttribute('data-bs-target');
              const expander = document.getElementById(id);
              const isExpaded = Boolean(element.getAttribute('aria-expanded'));
              console.log('isExpaded',isExpaded)
              if(isExpaded){
                element.setAttribute('aria-expanded', false);
              }else{
                element.setAttribute('aria-expanded', true);
              }
           
              expander.classList.toggle('collapse');
              // element.toggleAttribute('aria-expanded')
            });
          });
        });
    }
  }
);
