const { encrypt } = require('./root/utils/nodejs/cryptos2')
const path = require('path');
const makeDir = require('make-dir');
const fs = require('fs')
const { walkSync } = require('./root/utils/nodejs/walkSync');
debugger;
// const data = fs.readFileSync(`${process.cwd()}/mock-data/firebaseAuthData.json`, 'utf8')

let files =[]
const dirpath=`${process.cwd()}/mock-data`
debugger;
walkSync(dirpath, function (filepath) {

    files.push(filepath)
debugger;
})
debugger;
for (let filepath of files) {
    const batchName = path.basename(filepath, '.json');
debugger;
    const data = fs.readFileSync(filepath);
    debugger;
    const encryptedData =encrypt(data)
    debugger;
    fs.writeFileSync(`${filepath}.B64`,encryptedData,{encoding:'base64'})
debugger;
}




