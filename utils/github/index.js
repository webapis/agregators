const fetch = require('node-fetch')
const jsdom = require("jsdom");
const { URL } = require('url')
const { JSDOM } = jsdom;
const { admin } = require('../../utils/firebase/firebase-admin')

const path = require('path')
const fs = require('fs')
const fbDatabase = admin.database()
const dirPath = `${process.cwd()}/src/crawler/`;
// function fetchDeviceAndUserVerificationCode(req, res) {
//     fetch('https://github.com/login/oauth/authorize?client_id=91c666c1cc595de45f17d0d4cc157c2fd9a76f83&redirect_url=http://localhost:3000/user-settings.html&scope=repo gist&state=gh_state&alow_signup=true', { method: 'get', headers: { 'Accept': 'application/json' } }).then(response => {
//         const status = response.status
//         debugger;
//         return response.json()
//     }).then(async data => {
//         debugger;
//         const dom = await JSDOM.fromFile(`${dirPath}/github-verification.html`)
//         const document = dom.window.document;
//         const label1 = document.createElement('label')
//         label1.setAttribute('for', 'user_code')
//         label1.innerText = 'User verification code:'
//         label1.classList.add('form-label')
//         document.getElementById('root').appendChild(label1)
//         const input1 = document.createElement('input')
//         input1.id = 'user_code'
//         input1.classList.add('form-control')
//         input1.setAttribute('readonly', true)
//         input1.type = 'text'
//         document.getElementById('root').appendChild(input1)
//         const label2 = document.createElement('label')
//         label2.setAttribute('for', 'verification_url')
//         label2.textContent = 'Please, click the following link and enter above verification code:'
//         label2.classList.add('form-label')
//         document.getElementById('root').appendChild(label2)
//         const a = document.createElement('a')
//         a.id = 'verification_uri'
//         a.classList.add('nav-link')
//         a.classList.add('form-control')
//         a.setAttribute('readonly', true)
//         a.textContent = 'Confirmation Link'
//         a.getAttribute("target", "_blank")
//         document.getElementById('root').appendChild(a)
//         document.getElementById('user_code').setAttribute('value', data.user_code)
//         document.getElementById('verification_uri').setAttribute('href', data.verification_uri)
//         deviceAuthRequestPoll({ interval: data.interval, device_code: data.device_code })
//         debugger;
//         const content = dom.serialize()
//         res.setHeader('Content-Type', 'text/html');
//         res.setHeader('Content-Length', Buffer.byteLength(content));
//         res.write(content)
//         res.end()

//     }).catch(error => {
//         console.log('error', error)
//     })

// }

async function fetchGithubAuthCode(res) {
    const url = `https://github.com/login/oauth/authorize?client_id=198fd462ac295507b855&redirect_uri=http://localhost:3000/user-settings.html&scope=repo public_repo workflow&state=${res.uid}&allow_signup=true`
    res.writeHead(302, { 'Location': url });
    res.end();
}

async function fetchGithubAccessToken(code, res) {
    debugger;
    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=198fd462ac295507b855&client_secret=${process.env.gh_client_secret}&code=${code}`, { method: 'post', headers: { 'Accept': 'application/json' } })
    debugger;
    const { access_token } = await response.json()
    debugger;
    const userRef = fbDatabase.ref(`users/${res.uid}`)
    userRef.update({
        ghtoken:
            access_token
    }, (error) => {
        if (error) {
            console.log('error', error)
            res.send('Error happened')
        } else {

            fetch(`https://api.github.com/repos/webapis/agregators/forks`, { method: 'post', headers: { 'Authorization': `token ${access_token}`, 'Accept': 'application/vnd.github.v3+json' } }).then(response => {
                debugger;
                return response.json()
            }).then(data => {
                debugger;
                const { owner: { login } } = data
                userRef.update({ ghuser: login, gh_action_url: `https://api.github.com/repos/${login}/agregators/actions/workflows/aggregate.yml/dispatches` }, (error) => {
                    if (error) {
                        console.log(error)
                    } else {
                        const filepath = `${process.cwd()}/src/crawler/user-settings.html`;
                        debugger;
                        res.setHeader('Content-Type', 'text/html');
                        fs.createReadStream(filepath).pipe(res)
                    }

                })
            })
        }
    })
    debugger
}

// function deviceAuthRequestPoll({ interval, device_code }) {
//     const pollInterval = setInterval(async () => {
//         //  const url = new URL(`https://github.com/login/oauth/access_token?client_id=da589515a4265ee07cc7 & device_code=${device_code}`).href
//         const url = new URL(`https://github.com/login/oauth/access_token`)
//         url.searchParams.append('client_id', '198fd462ac295507b855')
//         // url.searchParams.append('client_secret', process.env.gh_client_secret)
//         url.searchParams.append('device_code', device_code)
//         const href = url.href
//         debugger;
//         const response = await fetch(href, { method: 'post', headers: { 'Accept': 'application/json' } })
//         debugger;
//         const data = await response.json()
//         console.log('data', data)
//         debugger;

//     }, interval * 2000)
// }

module.exports = {  fetchGithubAuthCode, fetchGithubAccessToken }



