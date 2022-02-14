require('dotenv').config()

const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');


const timeout = 30000

//BEFORE_ALL HOOK---------------------------------------------
BeforeAll({ timeout }, async function () {
  try {

    const { launchPuppeteer } = require('./hooks/launchPuppeteer')
     const { clearScreenshots } = require('./hooks/clearScreenshots')
    await launchPuppeteer()
    clearScreenshots()

  } catch (error) {
    debugger;
    console.log('error', error)
    process.exit(1)
  }

});


//BEFORE HOOK------------------------------------------
Before({ timeout }, async function (scenario) {
  try {


    const { setAppState } = require('./hooks/setAppState');
    const { initializePage } = require('./hooks/initializePage')
    await initializePage(scenario)
    await setAppState(scenario)

  
  } catch (error) {
    debugger;
    console.log('error', error)
    process.exit(1)
  }
})


//AFTER HOOK---------------------------------------
After({ timeout }, async function (scenario) {
  try {
    const { saveAppState } = require('./hooks/saveAppState')
    await saveAppState(scenario)
    await global.page.close()
  } catch (error) {
    debugger;
    console.log('error', error)
    process.exit(1)
  }
})



//--AFTER_ALL HOOK---------------------------------------------START---------------------------------------
AfterAll(async function (error, result) {
  debugger;
  await global.browser.close();
  if (global.success >= 79) {
    // process.exit(0)
  } else {
    process.exit(1)
  }
})

