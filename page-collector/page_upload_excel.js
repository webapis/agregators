//const { fbDatabase } = require('../utils/firebase/firebaseInit')
const { walkSync } = require('./walkSync');
//const { refreshAccessToken } = require('../utils/oauth2/server/server.oauth2')
const { uploadExcelFile, folderExist, createFolder } = require('../utils/google-drive')
// const fs = require('fs')
// const path = require('path')
// const fetch = require('node-fetch')
const { fbRest } = require('../utils/firebase/firebase-rest')

const fbDatabase = fbRest().setIdToken(global.fb_id_token).setProjectUri(global.fb_database_url)
debugger;
const startedDateTime = global.fb_run_id
const rootFirebaseRef = `runs/${global.fb_uid}/${process.env.projectName}/${startedDateTime}`
async function pageUploadExcel({ taskSequelizerEventEmitter }) {
    const email = process.env.email;
    const projectName = process.env.projectName

    let files = [];

    walkSync(`${process.cwd()}/page-data-excel/${projectName}`, async function (
        filepath
    ) {
        if (!filepath.includes('.DS_Store')) {
            files.push(filepath);
        }

        const userRef = fbDatabase.ref('users').orderByChild('email').equalTo(email).limitToLast(1)
        userRef.once('value', async (snapshot) => {
            let access_token = ''
            let refresh_token = ''
            let userkey = ''
            snapshot.forEach(childsnap => {
                access_token = childsnap.val().access_token
                refresh_token = childsnap.val().refresh_token
                userkey = childsnap.key
            })

            try {
                debugger;
                const token = await folderExist({ folderName: projectName, access_token, refresh_token, email, userkey })
                debugger;
                const folderResult = await createFolder({ folderName: projectName, access_token: token.access_token })
                debugger;
                if (folderResult.status === 200) {
                    const data = await folderResult.json()
                    await uploadExcelFile({ access_token: token.access_token, filePath: files[0], taskSequelizerEventEmitter, parentFolder: data.id })
                    debugger;
                } else {
                    throw 'unhandled http response Status'
                }
                debugger;




            } catch (error) {
                console.log('error', error)

            }

        })
    });
}


module.exports = { pageUploadExcel }





