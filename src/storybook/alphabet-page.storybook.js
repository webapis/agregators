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
    gender: 'kadın',
    productCategory: 'Giyim',
    productName: 'İndirimli ürünler',
    url: '/indirimli-ürünler'
  },
  {
    gender: 'kadın',
    productCategory: 'Giyim',
    productName: 'Yeni gelenler',
    url: '/yeni-gelenler'
  },
  {
    gender: 'kadın',
    productCategory: 'Giyim',
    productName: 'Basics- Günlük giyim',
    url: '/basics-günlük-giyim'
  }
];
