customElements.define(
  'nav-component',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {

      if(!this.querySelector('.side-nav')){
       debugger;
      fetch(`${window.location.origin}/nav.html`)
        .then(response => response.text())
        .then(html => {
       this.innerHTML=`
       <style>
       .arrow::before {
        width: 1.25em;
        line-height: 0;
        content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
        transition: transform 0.35s ease;
        transform-origin: .5em 50%;
      }
      .arrow:hover {
        cursor: pointer;
      }
      .arrow[aria-expanded="true"]::before {
        content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
      }
      .arrow[aria-expanded="true"] {
        font-weight: bolder;
      }
      .side-nav {
        position: fixed;
      }
      a[aria-selected='true'] {
        font-weight: bolder;
      }
      .side-nav a {
        padding: .1875rem .5rem;
        margin-top: .125rem;
      
        color: black;
        text-decoration: none;
      }
      
      .side-nav ul,
      li {
        list-style-type: none;
      }
      
      ul,
      li,
      a {
        margin-left: 0 !important;
        padding-left: 1em !important;
      }
      
       
       </style>
       ${html}`
   
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
  }
);


if(!document.querySelector('nav-component')){
  document.getElementById('root').insertAdjacentHTML('afterbegin','<nav-component class="bg-info"></nav-component>')
}
