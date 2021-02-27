customElements.define(
  'home-page',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `<div id='root'>My Home Page</div>`;
      fetch('http://localhost:3000/buildstart')
        .then((response) => response.json())
        .then((data) => {
          this.innerHTML = `<div id='root'>
    <div id ="sub">${data.length}</div>
    </div>`;
          fetch('http://localhost:3000/buildend');
        });
    }

    get items() {
      return this.items;
    }
    set items(values) {
      this.items = values;
    }
  }
);
