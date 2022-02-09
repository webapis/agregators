require('dotenv').config()

const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const puppeteer = require("puppeteer");
const fs = require('fs')
const { nodeFetch } = require('../../root/utils/nodejs/node-fetch')
const makeDir = require('make-dir')
console.log('process.env.headless.....', (/true/i).test(process.env.headless))

const launchOptions = {
  timeout: 0,
  //slowMo: 15,
  headless: (/true/i).test(process.env.headless),

  // executablePath:
  //   process.env.MACHINE === "mac"
  //     ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  //     : "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

  args: [
    //  "--no-sandbox",
    //   "--disable-setuid-sandbox",
    // `--window-position=1200,0`,
    "--disable-web-security",
    `--window-size=1200,1250`,
    "--allow-insecure-localhost",
    //  "--user-data-dir=/tmp/foo",
    "--ignore-certificate-errors",
    "--unsafely-treat-insecure-origin-as-secure=https://localhost:8888"
  ]// ,devtools: true
};

//BEFORE_ALL HOOK---------------------------------------------
BeforeAll({ timeout: 15000 }, async function () {
  try {

    //1. LAUNCH BROWSER
    global.browser = await puppeteer.launch(launchOptions);

    const screenshotsFolderPath = `${process.cwd()}/screenshots`
    if (fs.existsSync(screenshotsFolderPath)) {

      fs.rmSync(screenshotsFolderPath, { recursive: true, force: true });
      await makeDir.sync(screenshotsFolderPath)

    } else {
      await makeDir.sync(screenshotsFolderPath)
    }

  } catch (error) {

    console.log('error', error)
    process.exit(1)
  }

});

//BEFORE HOOK------------------------------------------
Before({ timeout: 15000 }, async function (scenario) {
  try {
    //1.CREATE NEW PAGE
    global.page = await global.browser.newPage()
    await global.page.setViewport({
      width: 1200,
      height: 1250,
      deviceScaleFactor: 1,
    });
    
    

    //2.GET SCENARIO ORDER
    const { pickle: { name } } = scenario
    const order = parseInt(name)

    //3.SET PREVIOUD LOCAL STORAGE AND FIREBASE DATABASE STATE
    if (order > 0) {
      //3.1. NAVIGATE TO WEBSITE ROOT TO INITIALIZE LOCAL STORAGE-----------------------------------------------------------------
       await global.page.goto('https://localhost:8888')
      //-----------------------------------------------------END------------------------------------------------------------------


      //3.2 SET BROWSERS LAST LOCAL STORAGE STATE ---START--------------------------------------------------------------------------
      const lsData = await getLocalStorageData(order)
      await global.page.evaluate((_lsData) => {
        for (let l in _lsData) {
          window.localStorage.setItem(l, JSON.stringify(_lsData[l]))
        }
      }, lsData)
      //------------------------------------------END--------------------------------------------------------------------------------


      //3.2 SET FIREBASE DATABASE'S PREVIOUS STATE --START------------------------------------------------------------------------------
      const { auth: { idToken } } = lsData
      const backEndBefore = fs.readFileSync(`${process.cwd()}/mock-data/back-end/${(order - 1).toString()}-after.json`, { encoding: 'utf-8' })
      await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'PUT', body: backEndBefore, headers: {}, port: process.env.dbPort, ssh: process.env.dbSsh })
      //--------------------------------------------END------------------------------------------------------------------------------

    }
  } catch (error) {

    console.log('error', error)
    process.exit(1)
  }



})
//AFTER HOOK---------------------------------------
After({ timeout: 15000 }, async function (scenario) {

  try {

    //1.GET SCENARIO ORDER---START-----------------------
    const { pickle: { name } } = scenario
    //---------------------END------------------------------


    //2.SAVE BROWSER'S LOCAL STORAGE STATE TO FILE --START--------------------------
    const locData = await global.page.evaluate(() => {
      const local = localStorage
      function isJSON(str) {
        try {
          return (JSON.parse(str) && !!str);
        } catch (e) {
          return false;
        }
      }
      let lsData = {}
      for (let l in local) {
        if (localStorage.getItem(l)) {
          lsData = { ...lsData, [l]: isJSON(local[l]) ? JSON.parse(local[l]) : local[l] }
        }
      }
      return lsData
    })
    fs.writeFileSync(`${process.cwd()}/mock-data/local-storage/${name}-after.json`, JSON.stringify(locData), { encoding: 'utf-8' })
    //-------------------------------------------------END--------------------------



    //3. SAVE FIREBASE DATABASE STATE TO LOCAL FILE --START---------------------
    const { auth } = locData
    const { idToken } = auth
    const backendData = await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'GET', headers: {}, port: process.env.dbPort, ssh: process.env.dbSsh })
    const backendAfter = JSON.parse(backendData)
    fs.writeFileSync(`${process.cwd()}/mock-data/back-end/${name}-after.json`, JSON.stringify(backendAfter), { encoding: 'utf-8' })
    //--------------------------------------------------END---------------------



    //4.CLOSE PAGE------------------------------
    await global.page.close()
    //----------------------END-----------------


  } catch (error) {

    console.log('error', error)
    process.exit(1)
  }
})

//--AFTER_ALL HOOK---------------------------------------------START---------------------------------------
AfterAll(async function (error, result) {


  //1.CLOSE BROWSER----------------------------
  await global.browser.close();

  if (global.success >= 79) {
    process.exit(0)
  } else {
    process.exit(1)
  }


})

//-----------------------------------------------------------------END---------------------------------------

//HELPER FUNCTIONS-------------------------START----------------------------------
async function getLocalStorageData(order) {

  const data = fs.readFileSync(`${process.cwd()}/mock-data/local-storage/0-after.json`, { encoding: 'utf-8' })

  const authState = JSON.parse(data)

  //refresh token if expired and save to mock_data/local-storage and return local-storage data from local file
  if (authState.auth && (authState.auth.timestamp <= Date.now())) {

    const refreshData = await renewIdToken(authState.auth)
    const { id_token } = refreshData

    const updatedState = { ...authState, auth: { ...authState.auth, idToken: id_token, timestamp: Date.now() } }


    fs.writeFileSync(`${process.cwd()}/mock-data/local-storage/0-after.json`, JSON.stringify(updatedState), { encoding: 'utf-8' })

    return updatedState

  } else {
    //if refresh token is not expired just return local-storage data from local file

    return require(`${process.cwd()}/mock-data/local-storage/0-after.json`)
  }


}

async function renewIdToken({ api_key, refreshToken }) {

  const resp = await nodeFetch({ host: 'securetoken.googleapis.com', path: `/v1/token?key=${api_key}`, method: 'post', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `grant_type=refresh_token&refresh_token=${refreshToken}` })

  const data = JSON.parse(resp)

  return data
}

//----------------------------------------------END----------------------------------