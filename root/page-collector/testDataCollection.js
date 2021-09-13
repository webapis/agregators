const fs = require('fs');
const { walkSync } = require('./walkSync');
const path = require('path');
const makeDir = require('make-dir');
function testDataCollection({taskSequelizerEventEmitter}){
    try {
        let files =[]
        
         walkSync(`${process.cwd()}/page-data/${process.env.projectName}`, async filepath => {
             
             files.push(filepath)
             
         });
     
           
    } catch (error) {
        
    }

}

module.exports={
    testDataCollection
}


