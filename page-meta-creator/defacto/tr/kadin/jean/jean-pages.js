// const fs = require('fs');
// //const { replaceUnicode } = require(`${process.cwd()}/utils/replaceUnicode`);
// function defactoPageConfig({ input }) {
//   const data = fs.readFileSync(input, 'utf-8');

//   const pages = JSON.parse(data).map(p => {
//     const { productName } = p;
//     const lowerCaseProdName = productName.toLowerCase();

//     return {
//       pageData: {
//         input: 'https://www.defacto.com.tr/kadin-denim',
//         output: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
//         dataCollectorFunc: './defacto/tr/dataCollector.js',
//         pageUrlsGetterFunc: './defacto/tr/pageUrlsGetter.js'
//       },
//       pageMeta: {
//         input: `${process.cwd()}/page-data/defacto/tr/kadin-denim.json`,
//         output: `${process.cwd()}/page-meta/defacto/tr/kadin/jean/${lowerCaseProdName}.json`,
//         output2: `${process.cwd()}/page-build/defacto/tr/kadin/jean/${lowerCaseProdName}.json`,
//         metaCreatorFunc: './defacto/tr/kadin/jean/metaCreator.js'
//       },
//       pageBuild: {
//         htmlOutput: `page-build/defacto/tr/kadin/jean/${lowerCaseProdName}.html`,
//         component: 'src/csr-components/product-list/product-list.js',
//         json: `./${lowerCaseProdName}.json`
//       },
//       pagePrerender: { selector: 'product-list' }
//     };
//   });

//   return pages;
// }

// module.exports = {
//   defactoPageConfig
// };
