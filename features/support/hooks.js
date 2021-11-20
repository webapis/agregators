const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const puppeteer = require("puppeteer");

const launchOptions = {
  timeout: 0,
  headless: process.env.headless,
  // executablePath:
  //   process.env.MACHINE === "mac"
  //     ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  //     : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

  args: [
    //    "--no-sandbox",
    //    "--disable-setuid-sandbox",
    // `--window-position=1200,0`,
    `--window-size=1200,1250`,
    "--allow-insecure-localhost",
    // "--user-data-dir=/tmp/foo",
    "--ignore-certificate-errors",
    "--unsafely-treat-insecure-origin-as-secure=https://localhost:3000"
  ] //,devtools: true
};
BeforeAll(async function () {

  global.browser = await puppeteer.launch(launchOptions);
  global.page = await global.browser.newPage()
  await global.page.setViewport({
    width: 1200,
    height: 1250,
    deviceScaleFactor: 1,
  });
  global.page.goto('https://localhost:8888')
  // perform some shared setup
});

AfterAll(async function () {
  debugger;
  process.exit(0)
})

// Before({tags:'@signin'},async function (){
//   await global.page.waitForSelector('home-card > div > a')
//   await global.page.click('home-card > div > a')
// })