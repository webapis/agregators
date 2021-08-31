
const json2xls = require('json2xls');
const fs = require('fs')
const path = require('path')
const makeDir = require('make-dir')
const projectName = process.env.projectName

function pageExportExcel({ taskSequelizerEventEmitter }) {
    try {
   
        const data = fs.readFileSync(`${process.cwd()}/page-merged-files/${projectName}/${projectName}.json`)
        const fileDestinationPath = `${process.cwd()}/page-data-excel/${projectName}/${projectName}.xlsx`
        makeDir.sync(path.dirname(fileDestinationPath))
        const dataObject = JSON.parse(data);
        var xls = json2xls(dataObject);
   
        fs.writeFileSync(fileDestinationPath, xls, 'binary');
        taskSequelizerEventEmitter.emit('taskComplete', 'page_export_excel')
   
    } catch (error) {
        console.log('page_export_excel_error', error)
   
        taskSequelizerEventEmitter.emit('taskFailed', 'page_export_excel')// TODO
    }

}

module.exports = {
    pageExportExcel
}