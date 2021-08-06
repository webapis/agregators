const { fbDatabase } = require('../utils/firebase/firebaseInit')
const { walkSync } = require('./walkSync');
const { refreshAccessToken } = require('../index')
const fs = require('fs')
const fetch = require('node-fetch')
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
        debugger;
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
            debugger;

            try {
                const response = await uploadFile({ access_token, files })
                debugger;
                // const contentType = response.headers.get('content-type')
                const { error } = await response.json()
                if (error.code = 401) {
                    const { access_token } = await refreshAccessToken({
                        refresh_token, email, userkey, cb: async () => {
                            const response = await uploadFile({ access_token, files })
                            debugger;
                        }
                    })
                    //const response = await uploadFile({ access_token })
                    debugger;
                }
                debugger;
            } catch (error) {
                debugger;
            }
            debugger;
        })
    });



}

async function uploadFile({ access_token, files }) {
    //HEALP FROM: https://stackoverflow.com/questions/44021538/how-to-send-a-file-in-request-node-fetch-or-node
 
    const stats = fs.statSync(files[0]);
    const fileSizeInBytes = stats.size;
    let readStream = fs.createReadStream(files[0]);

debugger;
    const apiendpoint = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media'
    return await fetch(apiendpoint, {
        method: 'post', body: readStream,
        headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8', 'Content-Length': fileSizeInBytes, 'Authorization': `Bearer ${access_token}` },
    })
}
module.exports = { pageUploadExcel }