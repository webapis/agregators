const { fbDatabase } = require('../utils/firebase/firebaseInit')
const { walkSync } = require('./walkSync');
//const { refreshAccessToken } = require('../utils/oauth2/server/server.oauth2')
const { uploadExcelFile, folderExist, createFolder } = require('../utils/google-drive')
// const fs = require('fs')
// const path = require('path')
// const fetch = require('node-fetch')
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
                const folderExts = await folderExist({ folderName: projectName, access_token, refresh_token, email, userkey })
                if (folderExts) {
                    debugger;
                    await uploadExcelFile({ access_token, filePath: files[0], taskSequelizerEventEmitter, parentFolder: folderExts })
                    debugger;
                } else {
                    debugger;
                    const folderResult = await createFolder({ folderName: projectName, access_token })
                    debugger;
                    if (folderResult.status === 200) {
                        const data = await folderResult.json()
                        await uploadExcelFile({ access_token, filePath: files[0], taskSequelizerEventEmitter, parentFolder: data.id })
                        debugger;
                    } else {
                        throw 'unhandled http response Status'
                    }
                    debugger;
                }
                debugger;


            } catch (error) {
                console.log('error', error)

            }

        })
    });
}


module.exports = { pageUploadExcel }





