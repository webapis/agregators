import '../pages/alphabe-page';

customElements.define(
  'alphabet-page-storybook',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `<alphabe-page></alphabe-page>`;
      const element = document.getElementsByTagName('alphabe-page')[0];
      element.items = items;
    }
  }
);

const items = [
  {
    name: 'Kazak',
    counters: [
      { name: 'defactor', count: '50' },
      { name: 'kigili', count: '15' }
    ]
  }
];
