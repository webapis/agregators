
//const { default: fetch } = require('node-fetch');

const { nodeFetch } = require('../../nodejs/node-fetch')

async function exchangeGoogleAuthorizationCode({ client_id, client_secret, code, redirect_uri }) {
    // Exchange google authorization code for access token
    debugger;
    const grant_type = 'authorization_code';
    var path = `/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=${grant_type}&redirect_uri=${redirect_uri}`
    const response = await nodeFetch({ host: 'oauth2.googleapis.com', path, method: 'post' })
    debugger;
    const authData = JSON.parse(response)
    console.log('authData', authData)
    debugger;
    // const { access_token, refresh_token, scope } = authData
    return authData

}

// async function exchangeCodeForAccessToken({ client_id, client_secret, code, redirect_uri, res, filepath, state }) {
//     debugger;
//     const { admin } = require('../../../utils/firebase/firebase-admin')
//     const fbDatabase = admin.database()


//     try {
//         const grant_type = 'authorization_code';
//         var oauth2Endpoint = 'https://oauth2.googleapis.com/token';
//         var fulloauth2Endpoint = `${oauth2Endpoint}?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=${grant_type}&redirect_uri=${redirect_uri}`
//         debugger;
//         const response = await fetch(fulloauth2Endpoint, { method: 'post' })
//         const contentType = response.headers.get('content-type')
//         debugger;
//         if (/text\/html.*/.test(contentType)) {
//             debugger;
//             res.setHeader('Content-Type', 'text/html');
//             const data = await response.text()
//             debugger;
//             res.setHeader('Content-Type', 'text/html');
//             res.setHeader('Content-Length', Buffer.byteLength(data));
//             res.write(data)
//             res.end()
//         } else {
//             debugger;
//             const authData = await response.json()
//             debugger;
//             const { access_token, refresh_token, scope } = authData
//             debugger;
//             //  const { email } = await getUserEmail({ token: access_token })
//             debugger;
//             const params = state.split('--xxx--')
//             const selectedWorkspace = params[0]
//             const uid = params[1]
//             debugger;
//             const uidRef = fbDatabase.ref(`server/users/${uid}/workspaces/${selectedWorkspace}/auth`)
//             debugger;
//             const update = { google: { access_token, refresh_token, scope } }

//             uidRef.update(update, async (error, data) => {
//                 debugger;
//                 if (error) {
//                     console.log('error', error)
//                     res.setHeader('Content-Type', 'text/plain');
//                     res.end('database Error');
//                 } else {

//                     const dom = await JSDOM.fromFile(filepath)
//                     const document = dom.window.document;
//                     // var input = document.createElement('input');
//                     // input.setAttribute('type', 'hidden');
//                     // // input.setAttribute('id', 'email');
//                     // // input.setAttribute('value', email);
//                     // document.body.appendChild(input);
//                     var input = document.createElement('input');
//                     input.setAttribute('type', 'hidden');
//                     input.setAttribute('id', 'token');
//                     input.setAttribute('value', access_token);
//                     document.body.prepend(input);
//                     const content = dom.serialize()

//                     res.setHeader('Content-Type', 'text/html');

//                     res.setHeader('Content-Length', Buffer.byteLength(content));
//                     res.write(content)
//                     res.end()
//                 }
//             })



//         }


//     } catch (error) {
//         debugger;
//         console.log('error', error)
//     }


// }

async function updateUsersWorkspaceGoogleAuthState({ access_token, refresh_token, scope, state }) {
    try {
        const update = { google: { access_token, refresh_token, scope } }
        const params = state.split('--xxx--')
        const selectedWorkspace = params[0]
        const uid = params[1]
        const idToken = params[2]
        // const uidRef = fbDatabase.ref(`server/users/${uid}/workspaces/${selectedWorkspace}/auth`)
        const host = process.env.databaseHost
        const path = `/server/users/${uid}/workspaces/${selectedWorkspace}/auth.json?auth=${idToken}`

        const port = process.env.dbPort && parseInt(process.env.dbPort)
        const ssh = process.env.dbSsh === 'true'
        debugger;
        const response = await nodeFetch({ host, path, method: 'PATCH', body: JSON.stringify(update), port, ssh })
        return JSON.parse(response)
      
    } catch (error) {
        debugger;
    }

}

// async function refreshAccessToken({ refresh_token, cb }) {

//     const { fbRest } = require('../../firebase/firebase-rest')
//     const fbDatabase = fbRest().setIdToken(global.fb_id_token).setProjectUri(global.fb_database_url)
//     const grant_type = 'refresh_token';
//     fbDatabase.ref("env").once(async (snapshot) => {
//         const client_id = snapshot.client_id
//         const client_secret = snapshot.client_secret
//         debugger;
//         var oauth2Endpoint = 'https://oauth2.googleapis.com/token';
//         var fulloauth2Endpoint = `${oauth2Endpoint}?client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}&refresh_token=${refresh_token}`
//         const response = await fetch(fulloauth2Endpoint, { method: 'post' })
//         const data = await response.json()
//         const { access_token } = data
//         debugger;
//         const userRef = fbDatabase.ref(`users/${global.fb_uid}`)
//         userRef.update({ access_token }, (error) => {
//             if (error) {
//                 console.log('error', error)
//             } else {

//                 cb()
//             }
//         })

//         return data


//     })


// }
async function getUserEmail({ token }) {
    try {

        const oauthendpoint = 'https://www.googleapis.com/userinfo/v2/me'
        const response = await fetch(oauthendpoint, { headers: { 'Authorization': `Bearer ${token}`, method: 'get' } })

        const data = await response.json()
        debugger;
        return data

    } catch (error) {
        debugger;
        console.log('error', error)
    }

}


module.exports = { exchangeGoogleAuthorizationCode, updateUsersWorkspaceGoogleAuthState }





