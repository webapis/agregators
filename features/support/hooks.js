require('dotenv').config()

const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const puppeteer = require("puppeteer");
const fs = require('fs')

const makeDir = require('make-dir')
console.log('process.env.headless.....', (/true/i).test(process.env.headless))


const launchOptions = {
  timeout: 0,
  headless: (/true/i).test(process.env.headless),

  // executablePath:
  //   process.env.MACHINE === "mac"
  //     ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  //     : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

  args: [
    //  "--no-sandbox",
    //   "--disable-setuid-sandbox",
    // `--window-position=1200,0`,
    `--window-size=1200,1250`,
    "--allow-insecure-localhost",
    "--user-data-dir=/tmp/foo",
    "--ignore-certificate-errors",
    "--unsafely-treat-insecure-origin-as-secure=https://localhost:8888"
  ] //,devtools: true
};
BeforeAll({ timeout: 15000 }, async function () {
  try {
    const screenshotsFolderPath = `${process.cwd()}/screenshots`
    if (fs.existsSync(screenshotsFolderPath)) {

      fs.rmSync(screenshotsFolderPath, { recursive: true, force: true });
      await makeDir.sync(screenshotsFolderPath)

    } else {
      await makeDir.sync(screenshotsFolderPath)
    }

    //initialize firebase

    
    debugger;
    //Initialize puppetteer
    global.browser = await puppeteer.launch(launchOptions);



    // perform some shared setup
  } catch (error) {
    console.log('error', error)
  }

});
Before({ tags: '@auth or @workspace' }, async function () {
  debugger;
  global.page = await global.browser.newPage()

  await global.page.setViewport({
    width: 1200,
    height: 1250,
    deviceScaleFactor: 1,
  });

  await global.page.goto('https://localhost:8888')


})

After({ tags: '@auth or @workspace' }, async function () {
  debugger;
  await global.page.close()
})

Before({ tags: '@auth' }, async function () {
  //SET INITIAL LOCAL STORAGE STATE HERE

  const pageStoreInitState = require('../../mock-data/pageStore-InitState.json')
  await global.page.evaluate((_localStorageState) => {

    window.localStorage.setItem("page-store", JSON.stringify(_localStorageState))

  }, pageStoreInitState)
})
Before({ tags: '@workspace' }, async function () {
  //SET INITIAL LOCAL STORAGE STATE HERE

  const pageStoreInitState = require('../../mock-data/pageStore-authenticatedState.json')
  await global.page.evaluate((_localStorageState) => {

    window.localStorage.setItem("page-store", JSON.stringify(_localStorageState))

  }, pageStoreInitState)
})
AfterAll(async function () {
  debugger;
  process.exit(0)

})

// Before({tags:'@signin'},async function (){
//   await global.page.waitForSelector('home-card > div > a')
//   await global.page.click('home-card > div > a')
// })


