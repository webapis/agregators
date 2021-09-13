const fs = require('fs');
const makeDir =require('make-dir')
const path =require('path')
function recordError({batchName,error,functionName,dirName}) {
    const result = {
      batchName,
      error,
      functionName
    };
    let filePath = `${process.cwd()}/${dirName}/errors.json`;
    let dataObject = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, { encoding: 'utf-8' });
      dataObject = JSON.parse(data);
      dataObject.push(result);
    } else {
        makeDir.sync(path.dirname(filePath))
         dataObject.push(result);
    }
    fs.writeFileSync(filePath, JSON.stringify(dataObject));
  }

  module.exports={recordError}