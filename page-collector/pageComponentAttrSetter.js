const { walkSync } = require('./walkSync');
const ws_domain = 'tr/moda';
function pageComponentAttrSetter({ inputFolder }) {
  let files = [];
  console.log('page component set attr started....');
  walkSync(`${process.cwd()}/${inputFolder}/${ws_domain}`, async function(
    filepath
  ) {
    if (!filepath.includes('.DS_Store')) {
      files.push(filepath);
    }
  });
  files.forEach(f=>{
      

      debugger;
  })
  debugger;
  console.log('page component set attr ended....');
  return true;
}

module.exports = { pageComponentAttrSetter };
