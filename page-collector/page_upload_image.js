const { fbDatabase } = require('../utils/firebase/firebaseInit')
const { walkSync } = require('./walkSync');

const { uploadImageFile, folderExist, createFolder } = require('../utils/google-drive')

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
                await uploadImageFile({ access_token, files, taskSequelizerEventEmitter, parentFolder: folderExts })
                debugger;
            } else {
                debugger;
                const folderResult = await createFolder({ folderName: projectName, access_token })
                debugger;
                if (folderResult.status === 200) {
                    const data = await folderResult.json()
                    await uploadImageFile({ access_token, files, taskSequelizerEventEmitter, parentFolder: data.id })
                    debugger;
                } else {
                    debugger;
                    throw 'unhandled http response Status'
                }
                debugger;
            }
            debugger;


        } catch (error) {
            console.log('error', error)

        }

    })
}


module.exports = { pageUploadImage }
