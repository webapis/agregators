const gpg =require('gpg')
debugger;
function genGbp(path){

gpg.encryptFile(path,(result)=>{
    debugger;
    console.log(result)
})
}

genGbp("./turkmenistan-market-74b0fe0d7246.json")