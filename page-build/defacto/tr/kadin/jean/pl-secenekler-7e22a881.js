customElements.define(
  'pl-secenekler',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const { state: { items: { wordPatterns } } } = window.pageStore;
      this.render(wordPatterns);
    }

    render(wordPatterns) {
      this.innerHTML = `
      <div class="container">
      <div class="row">
      <div class=" col">${wordPatterns &&
        wordPatterns
          .map((w, i, arr) => {
            const { sw } = w;
            const currentfirstLetter = sw.charAt(0);
            const previousFirstLetter =
              i === 0 ? currentfirstLetter : arr[i - 1].sw.charAt(0);

            if (currentfirstLetter === previousFirstLetter) {
              return `
              ${i === 0
                ? `
              <p class="m-1 ms-3 fw-bold"><span>${currentfirstLetter}</span></p>`
                : ''}
              <li class="list-group-item d-flex ">
              <div class="ms-2 me-auto">
              <a href="#"  id= '${w.sw}' class="pattern-btn nav-link my-0 py-0 fw-light text-lowercase" > 
              ${w.sw}
              </a>
            </div>
            <span class="badge bg-primary rounded-pill">${w.count}</span>
              </li>
              `;
            } else {
              return `
              <p class="m-1 ms-3 fw-bold"><span>${currentfirstLetter}</span></p>
              <li class="list-group-item d-flex  ">
              <div class="ms-2 me-auto">
              <a href="#"  id= '${w.sw}' class="pattern-btn nav-link my-0 py-0 fw-light text-lowercase" > 
              ${w.sw}
              </a>
            </div>
            <span class="badge bg-primary rounded-pill">${w.count}</span>
              </li>
              `;
            }
          })
          .join(' ')}</div>
          </div>
          </div>
          `;

      const btns = this.querySelectorAll('.pattern-btn');
      btns.forEach(b => {
        b.addEventListener('click', e => {
          const id = e.target.id;

          window.pageStore.dispatch({
            type: window.actionTypes.PATTERN_SELECTED,
            payload: id
          });
          console.log('I amd clicked', id);
        });
      });
    }
  }
);
