const { walkSync } = require('./walkSync');
const makeDir = require('make-dir')
const path = require('path')
const fs = require('fs')
function pageMergeFiles({ taskSequelizerEventEmitter }) {
    try {


        let files = []
        let mergedData = []
        const output = `${process.cwd()}/page-merged-files/${process.env.projectName}/${process.env.projectName}.json`
        walkSync(`${process.cwd()}/page-data/${process.env.projectName}`, async filepath => {
            files.push(filepath)
        });
        makeDir.sync(path.dirname(output))
        
        for (let filepath of files) {
            const data = fs.readFileSync(filepath, { encoding: 'utf-8' });
            if (data) {
                const dataObject = JSON.parse(data)
                mergedData.push(...dataObject)
            }
        }

        fs.writeFileSync(output, JSON.stringify(mergedData))
        taskSequelizerEventEmitter.emit('taskComplete', 'page_merge_files')
    } catch (error) {
        taskSequelizerEventEmitter.emit('taskFailed', error)
    }
}

module.exports = {
    pageMergeFiles
}