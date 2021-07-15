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
              window.location.pathname.indexOf('/moda') + 1
            )
          );

          const selectedATag = document.querySelector(
            `a[href='${decodeURI(window.location.pathname)}']`
          );
          //selectedATag.setAttribute('aria-selected', 'true');

          const pathNames = paths.split('/');

          let id = '';
          pathNames.forEach((p, i, array) => {
            if (i === 0) {
              id = '';
              id += p;
            } else {
              id += `/${p}`;
            }
            if (array.length - 1 === i) {
              id = id.replace('.html', '');
            }
            let ul = document.getElementById(id);
            
            if (i !== 0 && ul) {
              ul.classList.toggle('collapse');
            }
            if (ul) {
              const arrow = document.querySelector(
                `li[data-bs-target='${id}']`
              );

              arrow.setAttribute('aria-expanded', 'true');
              console.log('id', id);
            }
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


document.body.prepend(document.createElement('nav-component'))