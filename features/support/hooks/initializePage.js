const { httpInterceptors } = require('../puppeteer/httpsInterceptors/interceptors')

async function initializePage(scenario) {
  const { pickle: { name } } = scenario
  //1.CREATE NEW PAGE
  global.page = await global.browser.newPage()
  await global.page.setViewport({
    width: 1200,
    height: 1250,
    deviceScaleFactor: 1,
  });
  global.page.on('dialog',async(dialog)=>{
    await dialog.accept();
})
  await httpInterceptors(scenario)
  global.page.on('error', async (error) => {
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${name}-${Date.now()}-error.png` });
    console.log('page error', error)
    throw error
  })
  global.page.on('pageerror', async (error) => {
    await global.page.screenshot({ path: `${process.cwd()}/screenshots/${name}-${Date.now()}-pageerror.png` });
    console.log('page pageerror', error)
    throw error
  })
  await global.page.goto('https://localhost:8888')



}

module.exports = { initializePage }