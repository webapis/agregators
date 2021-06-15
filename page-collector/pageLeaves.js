
const { walkSync } = require('./walkSync');
const ws_domain = 'tr/moda';
const fs =require('fs')
const path =require('path')
const makeDir =require('make-dir')
function pageLeaves({taskSequelizerEventEmitter}) {
    let files = [];
  
    walkSync(`${process.cwd()}/page-tree/${ws_domain}`, async function (filepath) {
      if (!filepath.includes('.DS_Store')) {
        files.push(filepath);
      }
    });
    const sorted = files.sort();
    sorted.forEach(s => {
      const data = fs.readFileSync(s);
      const dataObject = JSON.parse(data);
      const filename = path.basename(s, '.json');
      const outputDir = path.dirname(s).replace('page-tree', 'page-leave');
      const outputDir2 = outputDir.substring(0, outputDir.lastIndexOf('/'));
      makeDir.sync(outputDir);
      let i;
      let count = 0;
  
      for (i = 0; i < dataObject.length; i += 100) {
        const outoutFilePath = `${outputDir2}/${filename}-${count}.json`;
        const slice = dataObject.slice(i, i + 100);
        fs.writeFileSync(outoutFilePath, JSON.stringify(slice));
        count++;
      }
    });
    taskSequelizerEventEmitter.emit('taskComplete', 'page_leaves_creation')
  //  console.log('page tree creation ended....');
  }


  module.exports={pageLeaves}