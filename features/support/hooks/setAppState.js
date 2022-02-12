const fs = require('fs')
const { nodeFetch } = require(`${process.cwd()}/root/utils/nodejs/node-fetch`)
async function setAppState(scenario) {
  //2.GET SCENARIO ORDER
  const { pickle: { name } } = scenario
  const order = parseInt(name)
  
  //3.SET PREVIOUD LOCAL STORAGE AND FIREBASE DATABASE STATE
  if (order > 0) {
    //3.1. NAVIGATE TO WEBSITE ROOT TO INITIALIZE LOCAL STORAGE-----------------------------------------------------------------
    //   await global.page.goto('https://localhost:8888')
    //-----------------------------------------------------END------------------------------------------------------------------


    //3.2 SET BROWSERS LAST LOCAL STORAGE STATE ---START--------------------------------------------------------------------------
    const orderStr =(order-1).toString()
    const localStorageString =fs.readFileSync(`${process.cwd()}/mock-data/local-storage/${orderStr}-after.json`, { encoding: 'utf-8' })
    const lsData = JSON.parse(localStorageString)
    
    await global.page.evaluate((_lsData) => {
      for (let l in _lsData) {
        window.localStorage.setItem(l, JSON.stringify(_lsData[l]))
      }
    }, lsData)
    //------------------------------------------END--------------------------------------------------------------------------------
    

    //3.2 SET FIREBASE DATABASE'S PREVIOUS STATE --START------------------------------------------------------------------------------
    const { auth: { idToken } } = lsData
    const backEndBefore = fs.readFileSync(`${process.cwd()}/mock-data/back-end/${orderStr}-after.json`, { encoding: 'utf-8' })
    await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'PUT', body: backEndBefore, headers: {}, port: process.env.dbPort, ssh: process.env.dbSsh })
    //--------------------------------------------END------------------------------------------------------------------------------
    
  }
}

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

module.exports = { setAppState }