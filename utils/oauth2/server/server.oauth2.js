const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { default: fetch } = require('node-fetch');
const client_id = process.env.client_id
const client_secret = process.env.client_secret

async function exchangeCodeForAccessToken({ client_id, client_secret, code, redirect_uri, res, filepath }) {

const { admin } = require('../../../utils/firebase/firebase-admin')
const fbDatabase = admin.database()


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
            const { email } = await getUserEmail({ token: access_token })
            debugger;

            const uidRef = fbDatabase.ref(`users`).orderByChild('email').equalTo(email)
            uidRef.once('child_added', snap => {
                const key = snap.key
                debugger;
                const userRef = fbDatabase.ref(`users/${key}`)

                userRef.update({ access_token, refresh_token, scope }, async (error) => {
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
    const { fbRest } = require('../../firebase/firebase-rest')
    const fbDatabase = fbRest().setIdToken(global.fb_id_token).setProjectUri(global.fb_database_url)
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
async function getUserEmail({ token }) {ƒƒ
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


module.exports = { exchangeCodeForAccessToken, refreshAccessToken }