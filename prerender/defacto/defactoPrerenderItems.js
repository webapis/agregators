const Apify = require('apify');
const { firstPageUrls } = require('../../scrape/defacto/defactoFirstPageUrls');
debugger;

async function generateDefactoPrerenderItems() {
  const defactoPrerenerItems = await Promise.all(
    firstPageUrls.map(async f => {
      const { folderName } = f;
      const dataSet = await Apify.openDataset(`DEFACTO.${folderName}`);
      const { items } = await dataSet.getData();
      debugger;
      const mappedAndSortedItems = items
        .reduce((a, c, i) => {
          if (i === 0) {
            return [...c.products];
          }
          return [...a, ...c.products];
        }, [])
        // .sort(function(a, b) {
        //   var textA = a.productName.toUpperCase();
        //   var textB = b.productName.toUpperCase();
        //   return textA < textB ? -1 : textA > textB ? 1 : 0;
        // });
      var i,
        j,
        temparray = [],
        chunk = 72;
      for (i = 0, j = mappedAndSortedItems.length; i < j; i += chunk) {
        temparray.push(mappedAndSortedItems.slice(i, i + chunk));
        // do whatever
      }
      debugger;
      const unuqProductNames =temparray.reduce((acc,cur,i)=>{
          if(i===0){
              debugger;
              return cur
          }
      },[])
      debugger;
      return {
        data: '',
        componentName: '',
        outputPath: '',
        pageName: '',
        pageTitle: '',
        pageDescription: ''
      };
      debugger;
    })
  );
  debugger;
}

generateDefactoPrerenderItems();

module.exports = {};
