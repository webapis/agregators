
const { walkSync } = require('./walkSync');
const { uploadExcelFile, folderExist, createFolder } = require('../utils/google-drive')
const { fbRest } = require('../utils/firebase/firebase-rest')

const fbDatabase = fbRest().setIdToken(global.fb_id_token).setProjectUri(global.fb_database_url)

async function pageUploadExcel({ taskSequelizerEventEmitter }) {
  //  const email = process.env.email;
    const projectName = process.env.projectName

    let files = [];

    walkSync(`${process.cwd()}/page-data-excel/${projectName}`, async function (
        filepath
    ) {
        if (!filepath.includes('.DS_Store')) {
            files.push(filepath);
        }

        const userRef = fbDatabase.ref(`users/${global.fb_uid}`)
    
        userRef.once(async (snapshot) => {
            let access_token = snapshot.access_token
            let refresh_token = snapshot.refresh_token
            debugger;
           
            try {
                const token = await folderExist({ folderName: projectName, access_token, refresh_token })
                const folderResult = await createFolder({ folderName: projectName, access_token: token.access_token })
              
            
                const data = await folderResult.json()
                if (folderResult.status === 200) {

                    await uploadExcelFile({ access_token: token.access_token, filePath: files[0], taskSequelizerEventEmitter, parentFolder: data.id })

                } else {
                    console.log('error data',data)
                    throw 'unhandled http response Status'
                }

            } catch (error) {
                console.log('error', error)

            }

        })
    });
}


module.exports = { pageUploadExcel }





