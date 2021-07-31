debugger;
const json2xls = require('json2xls');
const fs = require('fs')
const path = require('path')
const makeDir =require('make-dir')
const projectName = process.env.projectName
debugger;
function pageExportExcel({ taskSequelizerEventEmitter }) {
    try {
        debugger;
        const data = fs.readFileSync(`${process.cwd()}/page-merged-files/${projectName}/${projectName}.json`)
        const fileDestinationPath = `${process.cwd()}/page-data-excel/${projectName}/${projectName}.xlsx`
   makeDir.sync(path.dirname(fileDestinationPath))
    const dataObject = JSON.parse(data);
        var xls = json2xls(dataObject);
 debugger;
    fs.writeFileSync(fileDestinationPath, xls, 'binary');
     taskSequelizerEventEmitter.emit('taskComplete','page_export_excel')
        debugger;
    } catch (error) {
      //  taskFailed
      debugger;
      taskSequelizerEventEmitter.emit('taskFailed','page_export_excel')// TODO
    }
 
}

module.exports = {
    pageExportExcel
}