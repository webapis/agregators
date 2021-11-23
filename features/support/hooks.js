require('dotenv').config()
const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const puppeteer = require("puppeteer");
const localStorageState = require('./localStorageState.json')
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
   
    global.browser = await puppeteer.launch(launchOptions);
    global.page = await global.browser.newPage()
    //await global.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36')
    // const tablet = puppeteer.devices['iPad landscape']
    // await global.page.emulate(tablet)


    await global.page.setViewport({
      width: 1200,
      height: 1250,
      deviceScaleFactor: 1,
    });


    await global.page.goto('https://localhost:8888')


    await global.page.evaluate((_localStorageState) => {

      window.localStorage.setItem("page-store", JSON.stringify(_localStorageState))

    }, { ...localStorageState, auth: { ...localStorageState.auth, token: process.env.TOKEN, refreshToken: process.env.REFRESHTOKEN, idToken: process.env.IDTOKEN } })
    debugger;

    // perform some shared setup
  } catch (error) {
    console.log('error', error)
  }

});

AfterAll(async function () {
  debugger;
  process.exit(0)

})

// Before({tags:'@signin'},async function (){
//   await global.page.waitForSelector('home-card > div > a')
//   await global.page.click('home-card > div > a')
// })


