
const path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { fbDatabase } = require('../../firebase/firebaseInit')
const { default: fetch } = require('node-fetch');
const dirPath = `${process.cwd()}/src/dashboard/`;
//const filepath = dirPath + 'index.html'
const client_id = '117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com'
const client_secret = process.env.client_secret

async function exchangeCodeForAccessToken({ client_id, client_secret, code, redirect_uri, res, filepath }) {
    try {
        const grant_type = 'authorization_code';
        var oauth2Endpoint = 'https://oauth2.googleapis.com/token';
        var fulloauth2Endpoint = `${oauth2Endpoint}?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=${grant_type}&redirect_uri=${redirect_uri}`
        debugger;
        const response = await fetch(fulloauth2Endpoint, { method: 'post' })
        const contentType = response.headers.get('content-type')
        debugger;
        if (/text\/html.*/.test(contentType)) {
            debugger;
            res.setHeader('Content-Type', 'text/html');
            const data = await response.text()
            debugger;
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Length', Buffer.byteLength(data));
            res.write(data)
            res.end()
        } else {
            debugger;
            const authData = await response.json()
            debugger;
            const { access_token, refresh_token, scope } = authData
            const hasEmailScope = scope.includes('https://www.googleapis.com/auth/gmail.send')
            const hasExportScope = scope.includes('https://www.googleapis.com/auth/drive.file')

            const { email } = await getUserEmail({ token: access_token })
            debugger;

            const uidRef = fbDatabase.ref(`users`).orderByChild('email').equalTo(email)
            uidRef.once('child_added', snap => {
                
                const key = snap.key
                debugger;
                //const serviceConf = snap.val()['serviceConf']
                debugger;
                const userRef = fbDatabase.ref(`users/${key}`)

                //serviceConf: { ...serviceConf, emailService: hasEmailScope ? 'professional' : 'trial', exportService: hasExportScope ? 'professional' : 'trial' }
                userRef.update({ access_token, refresh_token, scope  }, async (error) => {
                    if (error) {
                        console.log('error', error)
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('database Error');
                    } else {

                        const dom = await JSDOM.fromFile(filepath)

                        const document = dom.window.document;

                        var input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('id', 'email');
                        input.setAttribute('value', email);
                        document.body.appendChild(input);
                        var input = document.createElement('input');
                        input.setAttribute('type', 'hidden');
                        input.setAttribute('id', 'token');
                        input.setAttribute('value', access_token);
                        document.body.prepend(input);
                        const content = dom.serialize()

                        res.setHeader('Content-Type', 'text/html');

                        res.setHeader('Content-Length', Buffer.byteLength(content));
                        res.write(content)
                        res.end()
                    }
                })


            })

        }


    } catch (error) {
        debugger;
        console.log('error', error)
    }


}

async function refreshAccessToken({ refresh_token, email, userkey, cb }) {

    const grant_type = 'refresh_token';
    var oauth2Endpoint = 'https://oauth2.googleapis.com/token';
    var fulloauth2Endpoint = `${oauth2Endpoint}?client_id=${client_id}&client_secret=${client_secret}&grant_type=${grant_type}&refresh_token=${refresh_token}`
    const response = await fetch(fulloauth2Endpoint, { method: 'post' })
    const data = await response.json()
    const { access_token } = data
    const userRef = fbDatabase.ref(`users/${userkey}`)
    userRef.update({ access_token }, (error) => {
        if (error) {
            console.log('error', error)
        } else {

            cb()
        }
    })

    return data

}
async function getUserEmail({ token }) {
    try {
        debugger;
        const oauthendpoint = 'https://www.googleapis.com/userinfo/v2/me'
        const response = await fetch(oauthendpoint, { headers: { 'Authorization': `Bearer ${token}`, method: 'get' } })
        debugger;
        const data = await response.json()
        debugger;
        return data

    } catch (error) {
        debugger;
        console.log('error', error)
    }

}
function revokeToken({ token }) {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/revoke';
}

module.exports = { exchangeCodeForAccessToken, refreshAccessToken }