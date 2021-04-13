const pages = [
  {
    input: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/jean-kategoriler.json`,
    pagePrerenderFunc: `${process.cwd()}/page-prerender/defacto/jeans/pagePrerender.js`,
    selector: 'product-list'
  }
];

module.exports = {
  pages
};


