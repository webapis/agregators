const { walkSync } = require('./walkSync');
const makeDir =require('make-dir')
const ws_domain = 'tr/moda';
const fs=require('fs')
function pageNavDataTreeCreation({taskSequelizerEventEmitter}) {
    let files = [];
    console.log('nav data tree creation started....');
    walkSync(`${process.cwd()}/page-data/${process.env.projectName}`, async function (filepath) {
      if (!filepath.includes('.DS_Store')) {
        files.push(filepath.substring(filepath.indexOf('moda/')));
      }
    });
 
    let reduced = [];
  
    const breadcrumbs = getBreadCrumbs({ files, reduced });
  
      breadcrumbs.forEach(w => {
      const { files, filter } = w;
      const pathNames = filter.split('/').filter(f => f !== '');
      const fileName = pathNames[pathNames.length - 1];
      let mergedData = [];
  
      files.forEach(f => {
        const filePath = `${process.cwd()}/page-data/${f}`;

        const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
        const dataObject = JSON.parse(data);
        mergedData.push(...dataObject);
      });
      const output = `${process.cwd()}/page-tree/${filter}`;
  
      makeDir.sync(output);
      const outputFilePath = `${output}${fileName}.json`;
  
      fs.writeFileSync(outputFilePath, JSON.stringify(mergedData));
    });
  
    taskSequelizerEventEmitter.emit('taskComplete', `page_nav_data_tree_creation`)
  }

  module.exports={
    pageNavDataTreeCreation
  }



  function getBreadCrumbs({ files, reduced }) {
    let i = 0;
  
    while (i < files.length) {
      const ps = files[i];
      const index = files[i].split('/');
      let s = 1;
      let filter;
      for (s; s < index.length; s++) {
        const curr = ps.indexOf(index[s]);
        filter = ps.substr(0, curr);
        reduced = [
          ...reduced,
          { files: files.filter(f => f.includes(filter)), filter }
        ];
      }
      i++;
    }
  
    return reduced.reduce((acc, curr, i) => {
      if (i === 0) {
        return [curr];
      }
      if (acc.findIndex(e => e.filter === curr.filter) === -1) {
        return [...acc, curr];
      }
  
      return acc;
    }, []);
  }