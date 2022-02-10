async function initializePage(){
   //1.CREATE NEW PAGE
   global.page = await global.browser.newPage()
   await global.page.setViewport({
     width: 1200,
     height: 1250,
     deviceScaleFactor: 1,
   });
}

module.exports={initializePage}