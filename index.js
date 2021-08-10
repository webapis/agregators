const http = require('http');
const path = require('path');
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { fbDatabase } = require('./utils/firebase/firebaseInit')
const { default: fetch } = require('node-fetch');
const dirPath = path.join(__dirname, '/src/dashboard/');
const filepath = dirPath + 'index.html'

const port = process.env.PORT || 3000;
const client_id = '117708549296-uij0mup1c3biok6ifaupa2951vtvf418.apps.googleusercontent.com'
const client_secret = process.env.client_secret
const redirect_uri = 'http://localhost:3000/oauth2callback'
const server = http.createServer((req, res) => {
    const { url } = req
    debugger;
    res.statusCode = 200;
    switch (true) {
        case /.*\/oauth2callback$/.test(url):
            debugger;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filepath).pipe(res)
            break;

        case /.*\/oauth2callback?.*/.test(url):

            const { code } = getUrlParams(url)
            exchangeCodeForAccessToken({ client_id, client_secret, code, redirect_uri, res })
            debugger;

            break;
        default:
            res.setHeader('Content-Type', 'text/plain');
            res.end('Hello World');
    }
})

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



function getUrlParams(url) {
    debugger;
    // Parse query string to see if page request is coming from OAuth 2.0 server.
    var params = {};
    var regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(url)) {

        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);

    }

    return params
}

async function exchangeCodeForAccessToken({ client_id, client_secret, code, redirect_uri, res }) {
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
            const { access_token, refresh_token } = await response.json()
            const { email } = await getUserEmail({ token: access_token })
            debugger;

            const usersRef = fbDatabase.ref(`users`)
            usersRef.push({ access_token, refresh_token, email }, async (error) => {
                if (error) {
                    console.log('error', error)
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('database Error');
                } else {
                    const dom = await JSDOM.fromFile(filepath)
                    debugger;
                    const document = dom.window.document;
                    debugger
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
                    debugger;
                    res.setHeader('Content-Type', 'text/html');

                    res.setHeader('Content-Length', Buffer.byteLength(content));
                    res.write(content)
                    res.end()
                }
            })
            debugger;
        }


    } catch (error) {
        debugger;
        console.log('error', error)
    }


}

async function refreshAccessToken({ refresh_token, email,userkey, cb }) {

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

function revokeToken({ token }) {
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/revoke';
}

async function getUserEmail({ token }) {
    try {
        debugger;
        const oauthendpoint = 'https://www.googleapis.com/userinfo/v2/me'
        const response = await fetch(oauthendpoint, { headers: { 'Authorization': `Bearer ${token}`, method: 'get' } })
        debugger;

        return await response.json()

    } catch (error) {
        console.log('error', error)
    }

}

module.exports = {
    refreshAccessToken
}