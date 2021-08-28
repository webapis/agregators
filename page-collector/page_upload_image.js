const { fbRest } = require('../utils/firebase/firebase-rest')
const { walkSync } = require('./walkSync');
const { uploadImageFile, folderExist, createFolder } = require('../utils/google-drive')

const fbDatabase = fbRest().setIdToken(global.fb_id_token).setProjectUri(global.fb_database_url)

async function pageUploadImage({ taskSequelizerEventEmitter }) {
    const email = process.env.email;
    const projectName = process.env.projectName

    let files = [];

    walkSync(`${process.cwd()}/page-image/${projectName}`, async function (
        filepath
    ) {
        if (!filepath.includes('.DS_Store')) {
            files.push(filepath);
        }
    });

    const userRef = fbDatabase.ref(`users/${global.fb_uid}`)
    userRef.once(async (snapshot) => {
        let access_token = snapshot.access_token
        let refresh_token = snapshot.refresh_token
        let userkey = snapshot.key
        try {
            debugger;
            const token = await folderExist({ folderName: projectName, access_token, refresh_token, email, userkey })
            const folderResult = await createFolder({ folderName: projectName, access_token: token.access_token })
            debugger;
            if (folderResult.status === 200) {
                const data = await folderResult.json()
                await uploadImageFile({ access_token: token.access_token, files, taskSequelizerEventEmitter, parentFolder: data.id })
                debugger;
            } else {
                debugger;
                throw 'unhandled http response Status'
            }
            debugger;

            debugger;
        } catch (error) {
            debugger;
            console.log('error', error)
        }

    })
}


module.exports = { pageUploadImage }
