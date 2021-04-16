const pages = [
  {
    input: `${process.cwd()}/page-meta/tr/moda/defacto/kadin/jean/jean-kategoriler.json`,
    pagePrerenderFunc: `${process.cwd()}/page-prerender/tr/moda/defacto/jeans/pagePrerender.js`,
    selector: 'product-list'
  }
];

module.exports = {
  pages
};


