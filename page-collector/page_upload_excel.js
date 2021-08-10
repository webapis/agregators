const { fbDatabase } = require('../utils/firebase/firebaseInit')
const { walkSync } = require('./walkSync');
const { refreshAccessToken } = require('../index')
const fs = require('fs')
const path = require('path')


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
                    await uploadFile({ access_token, files, taskSequelizerEventEmitter, parentFolder: folderExts })
                    debugger;
                } else {
                    debugger;
                    const folderResult = await createFolder({ folderName: projectName, access_token })
                    debugger;
                    if (folderResult.status === 200) {
                        const data = await folderResult.json()
                        await uploadFile({ access_token, files, taskSequelizerEventEmitter, parentFolder: data.id })
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

async function uploadFile({ access_token, files, taskSequelizerEventEmitter, parentFolder }) {

    //HEALP FROM: https://stackoverflow.com/questions/44021538/how-to-send-a-file-in-request-node-fetch-or-node
    const response = await postFileUpload({ access_token, files, parentFolder })
    const status = response.status
    if (status === 200) {
        debugger;
        //create permission
        const data = await response.json()
        const { id } = data;
        await createPermission({ fileId: id, access_token })
        const publicLinkReponse = await getPublicLink({ fileId: id, access_token })
        const {
            webViewLink, webContentLink } = await publicLinkReponse.json()
        taskSequelizerEventEmitter.emit('taskComplete', 'page_upload_excel', { webViewLink, webContentLink })
        debugger;
        //get public link

    }


    else {
        console.log('Error:Unhandled status code')
        taskSequelizerEventEmitter.emit('taskFailed', 'page_upload_excel')
        throw 'Unhandled status code'
    }


}

async function postFileUpload({ access_token, files, parentFolder }) {
    const fileData = fs.readFileSync(files[0])
    const fileName = path.basename(files[0])
    const metadata = { name: fileName, mymeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', parents: [parentFolder] }


    const apiendpoint = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
    return await fetch(apiendpoint, {
        method: 'post',
        headers: { 'Content-Type': 'multipart/related; boundary=boudaryWord', 'Authorization': `Bearer ${access_token}` },
        body: buildMultipartRelatedBody({ fileData, metadata })
    })
}
async function createPermission({ fileId, access_token }) {
    const apiendpoint = `https://www.googleapis.com/drive/v3/files/${fileId}`

    return fetch(apiendpoint, {
        method: 'post',
        headers: { 'Content-Type': 'application/json;', 'Authorization': `Bearer ${access_token}` },
        body: JSON.stringify({
            "role": "reader",
            "type": "anyone"
        })
    })
}

async function getPublicLink({ fileId, access_token }) {
    const apiendpoint = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink%2CwebContentLink`
    return fetch(apiendpoint, {
        method: 'get',
        headers: { 'Content-Type': 'application/json;', 'Authorization': `Bearer ${access_token}` }
    })
}

function buildMultipartRelatedBody({ metadata, fileData }) {

    const { mymeType } = metadata
    const boundary = 'boudaryWord'
    const delimiter = "\r\n--" + boundary + "\r\n"
    const close_delim = "\r\n--" + boundary + "--"
    const body = delimiter +
        'Content-Type:application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type:' + mymeType + '\r\n\r\n' +
        fileData + '\r\n' +
        close_delim
    return Buffer.concat([Buffer.from(delimiter +
        'Content-Type:application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type:' + mymeType + '\r\n\r\n', 'utf-8'), Buffer.from(fileData, 'utf-8'), Buffer.from(JSON.stringify(metadata) +
            delimiter, 'utf-8')])

}


async function createFolder({ folderName, access_token }) {


    const apiendpoint = `https://www.googleapis.com/drive/v3/files`


    return fetch(apiendpoint, {
        method: 'post',
        headers: { 'Content-Type': 'application/json;', 'Authorization': `Bearer ${access_token}` },
        body: JSON.stringify({
            mimeType: "application/vnd.google-apps.folder",
            name: folderName
        })
    })






}


async function folderExist({ folderName, access_token, refresh_token, email, userkey }) {
    const apiendpoint = `https://www.googleapis.com/drive/v3/files?q=name%20%3D'${folderName}'%20and%20mimeType%20%3D%20'application%2Fvnd.google-apps.folder'`

    const response = await fetch(apiendpoint, {
        method: 'get',
        headers: { 'Content-Type': 'application/json;', 'Authorization': `Bearer ${access_token}` }
    })

    const status = response.status
    if (status === 200) {
        debugger;
        const data = await response.json()
        if (data.files.length > 0) {
            const folder = data.files[0]['id']
            debugger;
            return folder
        } else {
            return false
        }

    } else if (status === 401) {
        const { access_token } = await refreshAccessToken({
            refresh_token, email, userkey, cb: async () => {

                const response = await fetch(apiendpoint, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json;', 'Authorization': `Bearer ${access_token}` }
                })
                const status = response.status
                if (status === 200) {
                    debugger;
                    const data = await response.json()
                    if (data.files.length > 0) {
                        const folder = data.files[0]['id']
                        return folder
                    } else {
                        return false
                    }
                } else {
                    console.log('Error:Unhandled status code')
                    taskSequelizerEventEmitter.emit('taskFailed', 'page_upload_excel')
                    throw 'Unhandled status code'
                }

            }
        })
    }
}
module.exports = { pageUploadExcel }





