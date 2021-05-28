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

          const paths = decodeURI(
            window.location.pathname.substring(
              window.location.pathname.indexOf('/moda') + 1,
              window.location.pathname.lastIndexOf('/')
            )
          );

          const pathNames = paths.split('/');

          let id = '';
          pathNames.forEach((p, i) => {
            if (i === 0) {
              id = '';
              id += p;
            } else {
              id += `-${p}`;

              //if (i !== 0) {
                debugger;
                document.getElementById(id).classList.toggle('collapse');
                // const arrow =document.querySelector(`li[data-bs-target=${id}]`)
                // //const isExpaded = arrow.getAttribute('aria-expanded');
                // arrow.setAttribute('aria-expanded', 'true');
                //debugger;
                console.log('id', id);
              //}
            }
            document.getElementById(id).classList.toggle('collapse');
          });

          document.querySelectorAll('.arrow').forEach(element => {
            

            element.addEventListener('click', function() {
              let id = element.getAttribute('data-bs-target');
              const expander = document.getElementById(id);
              const isExpaded = element.getAttribute('aria-expanded');

              console.log('isExpaded', isExpaded);
              if (isExpaded === 'true') {
                element.setAttribute('aria-expanded', 'false');
              } else {
                element.setAttribute('aria-expanded', 'true');
              }

              expander.classList.toggle('collapse');
            });
          });
        });
    }
  }
);
