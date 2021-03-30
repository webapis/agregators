const pages = [
  {
    pageName: '/index.html',
    input: 'src/index.js',
    selector: '#root',
    component: 'div',
    id: 'root',
    jsonUrl: ''
  },
  {
    pageName: '/defacto/kadin/jean/pantolon.html',
    input: 'src/product-list-page.js',
    selector: 'product-list',
    component: 'product-list',
    id: 'defacto-kadin-jean-pantolon',
    jsonUrl: './defacto-kadin-jean-pantolon.json'
  }
];

module.exports = {
  pages
};
