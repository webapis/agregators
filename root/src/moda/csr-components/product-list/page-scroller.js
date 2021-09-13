customElements.define(
  'page-scroller',
  class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
        // document.addEventListener('scroll', () => {
        //   const { state: { autoscroll } } = window.pageStore;
        //   if (autoscroll) {
        //     if (
        //       document.body.scrollTop + document.body.clientHeight ===
        //       document.body.scrollHeight
        //     ) {
        //       console.log('Fetch started');
        //       const { state: { items: { items } } } = window.pageStore;
        //       const marka = this.getAttribute('marka');
        //       const itemTags = document.getElementsByTagName(
        //         `${marka}-product-view`
        //       );
        //       const nextItems = items.slice(
        //         itemTags.length,
        //         itemTags.length + 70
        //       );
        //       this.appendProducts(nextItems);
        //     }
        //   }
        //   //toggle nav tab
        // });
    }
  }
);
