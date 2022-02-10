
const fs = require('fs')

const makeDir = require('make-dir');
function clearScreenshots(){

    const screenshotsFolderPath = `${process.cwd()}/screenshots`
    if (fs.existsSync(screenshotsFolderPath)) {

      fs.rmSync(screenshotsFolderPath, { recursive: true, force: true });
       makeDir.sync(screenshotsFolderPath)

    } else {
       makeDir.sync(screenshotsFolderPath)
    }
}
module.exports={clearScreenshots}