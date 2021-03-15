// const {
//   joinDataSetItems
// } = require('../../aggregation/utils/joinDataSetItems');
const {
  defactoKadynJean
} = require('../../page-urls/utils/jean/defacto/defacto.kadyn.jean');
const {
  defactoKadinJeanMetadata
} = require('../../page-metadata/utils/jean/defacto/defacto.kadin.jean.metadata');
const {
  sortDataSetsAlphabetically
} = require('../../prerender/utils/sortDatasetsAlphabetically');

/* eslint-disable no-undef */

const {
  productSearchWords
} = require('../../prerender/utils/productSearchWords');
describe('Test joinDataSet function', () => {
  before(() => {
    process.env['APIFY_LOCAL_STORAGE_DIR'] = './apify_storage';
    process.env['MARKA'] = 'DEFACTO';
  });
  it.only('returns an array of joined dataset', async function() {
    this.timeout(50000);
    debugger;
    // const joinedDataSetItems = await joinDataSetItems(
    //   'defacto.defacto-kadin-jeans'
    // );
    const kadynjean = await defactoKadynJean();
    debugger;
   //const pageMetadata = await defactoKadinJeanMetadata(pantolonPage);
    debugger;
  });
});
