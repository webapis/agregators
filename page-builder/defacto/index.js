const fs = require('fs');

const catPage = {
  htmlOutput: 'page-build/defacto/tr/kadin/jean/jean-category.html',
  component: 'src/csr-components/products-nav.js',
  json: './jean-category.json'
};

function defactoPageBuilder() {
  const filePath = `${process.cwd()}/page-build/defacto/tr/kadin/jean/jean-category.json`;
  const data = fs.readFileSync(filePath, 'utf-8');
  debugger;
  const pages = JSON.parse(data).map(p => {
    const { productName } = p;
    const lowerCaseProdName = productName.toLowerCase();
    return {
      htmlOutput: `page-build/defacto/tr/kadin/jean/${lowerCaseProdName}.html`,
      component: 'src/csr-components/product-list/product-list.js',
      json: `./${lowerCaseProdName}.json`
    };
  });

  return [...pages, catPage];
}

module.exports = {
  defactoPageBuilder
};
