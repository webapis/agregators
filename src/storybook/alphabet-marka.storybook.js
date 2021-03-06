customElements.define(
  'alphabet-marka-storybook',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      import('../components/pageStore.js').then(() => {
        import('../components/alphabet-marka.js').then(() => {
          this.innerHTML = /*html*/ `<alphabet-marka title="Pantolon" defacto-count="45" kigili-count="15"></alphabet-marka>`;
        });
      });
    }
  }
);
