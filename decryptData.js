const { decrypt } = require('./root/utils/nodejs/cryptos2')
const path = require('path');
const makeDir = require('make-dir');
const fs = require('fs')
const { walkSync } = require('./root/utils/nodejs/walkSync');
debugger;
// const data = fs.readFileSync(`${process.cwd()}/mock-data/firebaseAuthData.json`, 'utf8')

let files = [`${process.cwd()}/.env.B64`]
const dirpath = `${process.cwd()}/mock-data`
debugger;
walkSync(dirpath, function (filepath) {
    if (path.extname(filepath) === '.B64') {
        files.push(filepath)
    }

    debugger;
})
debugger;
for (let filepath of files) {
    debugger;
    const data = fs.readFileSync(filepath);
    debugger;


    const result = decrypt(data).toString()
    debugger;
    fs.writeFileSync(`${filepath.replace('.B64', '')}`, result, { encoding: 'utf-8' })
    debugger;

}




