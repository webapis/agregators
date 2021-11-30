require('dotenv').config()

const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const puppeteer = require("puppeteer");
const fs = require('fs')
const { nodeFetch } = require('../../root/utils/nodejs/node-fetch')
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
    //  "--user-data-dir=/tmp/foo",
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



    //Initialize puppetteer
    global.browser = await puppeteer.launch(launchOptions);



    // perform some shared setup
  } catch (error) {

    console.log('error', error)
    throw error
  }

});


Before({ timeout: 15000 }, async function (scenario) {
  try {
    global.page = await global.browser.newPage()
    await global.page.setViewport({
      width: 1200,
      height: 1250,
      deviceScaleFactor: 1,
    });

    await global.page.goto('https://localhost:8888')
    const { pickle: { name } } = scenario
    const authData = await updateIdToken()
    const {auth:{ idToken} } = authData

    const order = parseInt(name)

    if (order === 0) {
      //load backend data from file
      const backEndBefore = fs.readFileSync(`${process.cwd()}/mock-data/back-end/${name}-before.json`, { encoding: 'utf-8' })

      // upload backend data
      await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'PUT', body: JSON.stringify(backEndBefore), headers: {}, port: process.env.dbPort, ssh: process.env.dbSsh })
      //load data for local storage
      const localStorageBefore = fs.readFileSync(`${process.cwd()}/mock-data/local-storage/${name}-before.json`, { encoding: 'utf-8' })

      // update local storage
      await global.page.evaluate((_localStorageBefore) => {
        window.localStorage.setItem("page-store", _localStorageBefore)
      }, localStorageBefore)
      await global.page.reload()
    } else {

      //load backend data from file
      const backEndBefore = fs.readFileSync(`${process.cwd()}/mock-data/back-end/${(order - 1).toString()}-after.json`, { encoding: 'utf-8' })

      // upload backend data
      const response =await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'PUT', body: backEndBefore, headers: {}, port: process.env.dbPort, ssh: process.env.dbSsh })
      console.log(' upload backend data',response)
      //load data for local storage
debugger;
      const localStorageBefore = fs.readFileSync(`${process.cwd()}/mock-data/local-storage/${(order - 1).toString()}-after.json`, { encoding: 'utf-8' })

      const { lastVisitedUrl } = JSON.parse(localStorageBefore)
      debugger;
      // update local storage
      await global.page.evaluate((_localStorageBefore) => {
        window.localStorage.setItem("page-store", _localStorageBefore)
      }, localStorageBefore)
      await global.page.goto(lastVisitedUrl)
debugger;
    }
  } catch (error) {
    debugger;
    console.log('error', error)
    throw error
  }



})

After({ timeout: 15000 }, async function (scenario) {

  const { pickle: { name } } = scenario

  const authData = await updateIdToken()
  const { auth: { idToken } } = authData

  //fetch backend data
  const backendData = await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'GET', headers: {}, port: process.env.dbPort, ssh: process.env.dbSsh })
  const backendAfter = JSON.parse(backendData)

  //save backend data
  fs.writeFileSync(`${process.cwd()}/mock-data/back-end/${name}-after.json`, JSON.stringify(backendAfter), { encoding: 'utf-8' })
  //get data from local storage

  const localStorageAfter = await global.page.evaluate(() => {
    return window.localStorage.getItem("page-store")
  })
  const lastVisitedUrl = await global.page.url()
  const localStorageState = { ...JSON.parse(localStorageAfter), lastVisitedUrl }
  debugger;
  //save local storage data to file
  fs.writeFileSync(`${process.cwd()}/mock-data/local-storage/${name}-after.json`, JSON.stringify(localStorageState), { encoding: 'utf-8' })
  await global.page.close()





})

Before({ tags: '@workspace' }, async function () {
  //SET INITIAL LOCAL STORAGE STATE HERE

  // const pageStoreInitState = fs.readFileSync(`${process.cwd()}/mock-data/firebaseAuthData.json`, { encoding: 'utf-8' })
  // await global.page.evaluate((_localStorageState) => {

  //   window.localStorage.setItem("page-store", JSON.stringify(_localStorageState))

  // }, pageStoreInitState)
})
AfterAll(async function (error, result) {

  await global.browser.close();
  process.exit(0)

})

// Before({tags:'@signin'},async function (){
//   await global.page.waitForSelector('home-card > div > a')
//   await global.page.click('home-card > div > a')
// })


async function updateIdToken() {

  const authState = JSON.parse(fs.readFileSync(`${process.cwd()}/mock-data/local-storage/0-after.json`, { encoding: 'utf-8' }))

  //  if (Date.now() > authState.timestamp) {
  if (true) {

    const refreshData = await renewIdToken(authState.auth)
    const { id_token } = refreshData

    const updatedState = { ...authState, auth: { ...authState.auth, idToken: id_token, timestamp: Date.now() } }

    // const authState = require('../../mock-data/firebaseAuthData.json')
    fs.writeFileSync(`${process.cwd()}/mock-data/local-storage/0-after.json`, JSON.stringify(updatedState), { encoding: 'utf-8' })

    return updatedState

  } else {

    return require(`${process.cwd()}/mock-data/local-storage/0_authentication-after.json`)
  }


}

async function renewIdToken({ api_key, refreshToken }) {

  const resp = await nodeFetch({ host: 'securetoken.googleapis.com', path: `/v1/token?key=${api_key}`, method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${refreshToken}` })
  ///const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${api_key}`, { method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${refreshToken}` })
  const data = JSON.parse(resp)

  return data
}