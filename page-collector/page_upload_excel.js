const { fbDatabase } = require('../utils/firebase/firebaseInit')
const { Blob } = require('buffer')
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

                const contentType = response.headers.get('content-type')


                debugger;
                const status = response.status
                debugger;
                if (status === 401) {
                    debugger;
                    const { access_token } = await refreshAccessToken({
                        refresh_token, email, userkey, cb: async () => {
                            debugger;
                            const response = await uploadFile({ access_token, files })
                            debugger;
                            if (response.ok) {
                                debugger;
                                taskSequelizerEventEmitter.emit('taskComplete', 'page_upload_excel')
                            } else {
                                taskSequelizerEventEmitter.emit('taskFailed', 'page_upload_excel')
                            }
                            debugger;
                        }
                    })
                    //const response = await uploadFile({ access_token })
                    debugger;
                } else if (status === 400) {
                    debugger;
                    const contentType = response.headers.get('content-type')
                    debugger;
                    const error = await response.text()
                    debugger;
                }
                debugger;
            } catch (error) {
                console.log('error', error)
                debugger;
            }
            debugger;
        })
    });



}

async function uploadFile({ access_token, files }) {

    //HEALP FROM: https://stackoverflow.com/questions/44021538/how-to-send-a-file-in-request-node-fetch-or-node
    try {

        debugger;

        const stats = fs.statSync(files[0]);

        const fileData = fs.readFileSync(files[0])

        const fileSizeInBytes = stats.size;
        const fileName = path.basename(files[0])
        const metadata = { name: fileName, mymeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
        const body = buildMultipartRelatedBody({ fileData, metadata })
        const bodySize = fileData.byteLength
        debugger;
        const apiendpoint = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
        return await fetch(apiendpoint, {
            method: 'post',
            headers: { 'Content-Type': 'multipart/related; boundary=boudaryWord', 'Authorization': `Bearer ${access_token}` },
            body
        })

    } catch (error) {
        debugger;
    }
}

function buildMultipartRelatedBody({ metadata, fileData}) {
    debugger;
    const { mymeType } = metadata
    debugger;
    

    const fileSizeInBytes = fileData.length//stats.size;
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

    console.log('body', body)
    debugger;
    return Buffer.concat([Buffer.from(delimiter +
        'Content-Type:application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type:' + mymeType + '\r\n\r\n', 'utf-8'), Buffer.from(fileData, 'utf-8'), Buffer.from(JSON.stringify(metadata) +
            delimiter, 'utf-8')])



}
module.exports = { pageUploadExcel }



/*
function buildMultipartRelatedBody() {

    const fileName = 'mychat123'
    const fileData = 'this is a sample data'
    const contentType = 'text/plain'
    const metadata = {
        name: fileName, mymeType: contentType
    }

    const boundary = 'boudaryWord'
    const delimiter = "\r\n--" + boundary+"\r\n"
    const close_delim = "\r\n--" + boundary + "--"
    const body = delimiter+
        'Content-Type:application/json; charset=UTF-8\r\n\r\n'+
        JSON.stringify(metadata)+
        delimiter+
        'Content-Type:'+contentType+'\r\n\r\n'+
        fileData+'\r\n'+
        close_delim

    console.log('body', body)
    debugger;
    return body



}
*/


/*


function buildMultipartRelatedBody({ metadata, fileData }) {
    debugger;
    const { mymeType } = metadata
    debugger;
    // const fileName = 'mychat123'
    // const fileData = 'this is a sample data'
    // const contentType = 'text/plain'
    // const metadata = {
    //     name: fileName, mymeType: contentType
    // }

    const fileSizeInBytes = fileData.length//stats.size;
    const boundary = 'boudaryWord'
    const delimiter = "\r\n--" + boundary+"\r\n"
    const close_delim = "\r\n--" + boundary+"--"
    const body = delimiter+
        'Content-Type:application/json; charset=UTF-8\r\n\r\n'+
        JSON.stringify(metadata)+
        delimiter +
        'Content-Type:'+mymeType+'\r\n\r\n' +
        fileData + '\r\n' +
        close_delim

    console.log('body', body)
    debugger;
    return body



}
*/