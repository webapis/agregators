const fs =require('fs')
const { nodeFetch } = require(`${process.cwd()}/root/utils/nodejs/node-fetch`)
async function saveAppState(scenario){
    
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



    //3. SAVE FIREBASE DATABASE STATE TO LOCAL FILE --START-------------------------
    debugger;
    const { auth } = locData
    const { idToken } = auth
    const backendData = await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'GET', headers: {}, port: process.env.dbPort, ssh: process.env.dbSsh })
    const backendAfter = JSON.parse(backendData)
    fs.writeFileSync(`${process.cwd()}/mock-data/back-end/${name}-after.json`, JSON.stringify(backendAfter), { encoding: 'utf-8' })
    //--------------------------------------------------END---------------------


}

module.exports={saveAppState}