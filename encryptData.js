const { encrypt } = require('./root/utils/nodejs/cryptos2')
const path = require('path');
const makeDir = require('make-dir');
const fs = require('fs')
const { walkSync } = require('./root/utils/nodejs/walkSync');
debugger;
// const data = fs.readFileSync(`${process.cwd()}/mock-data/firebaseAuthData.json`, 'utf8')

let files =[]
const dirpath=`${process.cwd()}/mock-data`

walkSync(dirpath, function (filepath) {
    if (path.extname(filepath) === '.json') {
        files.push(filepath)
    }
    

})


for (let filepath of files) {


    const data = fs.readFileSync(filepath);
   
    const encryptedData =encrypt(data)
 
    fs.writeFileSync(`${filepath}.B64`,encryptedData,{encoding:'base64'})

}

// encrypt .env
const envFilePath =`${process.cwd()}/.env`
const data = fs.readFileSync(envFilePath);
debugger;
const encryptedData =encrypt(data)
debugger;
fs.writeFileSync(`${envFilePath}.B64`,encryptedData,{encoding:'base64'})
debugger;