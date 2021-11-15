//const fetch = require(`${process.cwd()}/node_modules/node-fetch/lib/index.js`)
//const jsdom = require("jsdom");
const { URL } = require('url')
//const { JSDOM } = jsdom;
const https = require('https');
//const { fbRest } = require('../firebase/firebase-rest')
const { nodeFetch } = require('../nodejs/node-fetch')



// function fetchGithubAuthCode() {
//     //  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirectUrl}&scope=repo public_repo workflow user&state=${state}&allow_signup=true`
//     var options = {
//         host: 'github.com',
//         path: encodeURI(`/login/oauth/authorize?client_id=${process.env.gh_client_id}&redirect_uri=${process.env.redirectUrl}&scope=repo public_repo workflow user&state='test_state'&allow_signup=true`),
//     };
//     debugger;
//     const prom = new Promise((resolve, reject) => {
//         var request = https.request(options, function (responce) {
//             var body = ''
//             responce.on("data", function (chunk) {
//                 body += chunk.toString('utf8')
//             });
//             responce.on("end", function () {
//                 console.log("Body", body);

//                 return resolve(body)
//             });
//             responce.on("error", function (error) {
//                 console.log("Body", error);

//                 return reject(body)
//             });
//         });
//         request.end();


//     })

//     return prom
// }

async function fetchGithubAccessToken({ code, client_id, client_secret }) {

    //const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`, { method: 'post', headers: { 'Accept': 'application/json' } })


    var options = {
        host: 'github.com',
        path: encodeURI(`/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`),
        method: 'POST',
        headers: { 'Accept': 'application/json' }
    };
    debugger;
    const prom = new Promise((resolve, reject) => {
        var request = https.request(options, function (responce) {
            var body = ''
            responce.on("data", function (chunk) {
                body += chunk.toString('utf8')
            });
            responce.on("end", function () {
                console.log("Body", body);

                return resolve(body)
            });
            responce.on("error", function (error) {
                console.log("Body", error);

                return reject(error)
            });
        });
        request.end();


    })

    return await prom
}

async function authWithFirebase({ access_token, key }) {
    // const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postBody: `access_token=${access_token}&providerId=github.com`, requestUri: "https://turkmenistan-market.firebaseapp.com/__/auth/handler", returnIdpCredential: true, returnSecureToken: true }) })

    // const data = await response.json()
    var options = {
        host: 'identitytoolkit.googleapis.com',
        path: encodeURI(`/v1/accounts:signInWithIdp?key=${key}`),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

    };
    debugger;
    const prom = new Promise((resolve, reject) => {
        var request = https.request(options, function (responce) {
            var body = ''
            responce.on("data", function (chunk) {
                body += chunk.toString('utf8')
            });
            responce.on("end", function () {
                console.log("Body", body);

                return resolve(body)
            });
            responce.on("error", function (error) {
                console.log("Body", error);

                return reject(error)
            });
        });
        request.write(JSON.stringify({ postBody: `access_token=${access_token}&providerId=github.com`, requestUri: "https://turkmenistan-market.firebaseapp.com/__/auth/handler", returnIdpCredential: true, returnSecureToken: true }))
        request.end();


    })

    return await prom

}

async function updateWorkflowRunner({ access_token, userisOld, screenName }) {
    // const data = await authWithFirebase({ access_token, key })
    // const { email, emailVerified, federatedId, kind, localId, needConfirmation, oauthAccessToken, photoUrl, providerId, screenName, refreshToken, idToken, expiresIn } = JSON.parse(data)
    // debugger;
    // const publicData = { email, photoUrl }
    // const privateData = { token: oauthAccessToken, refreshToken, idToken, screenName, email }

    if (userisOld !==null) {
        console.log('---1----')
        return await nodeFetch({ host: 'api.github.com', path: `/repos/${screenName}/workflow_runner/merge-upstream`, method: 'post', headers: {'User-Agent':'node.js',  'Authorization': `token ${access_token}`, 'Accept': 'application/vnd.github.v3+json' }, body: JSON.stringify({ branch: 'main' }) })

    } else {
        console.log('---2----')
        return await nodeFetch({ host: 'api.github.com', path: '/repos/webapis/workflow_runner/forks', method: 'post', headers: {'User-Agent':'node.js', 'Authorization': `token ${access_token}`, 'Accept': 'application/vnd.github.v3+json' }})

       
    }

    //const fbDatabase = fbRest().setIdToken(idToken).setProjectUri(process.env.databaseURL)

    // fbDatabase.ref(`users/private/${localId}/fb_auth`).once('value', async (error, response) => {

    //     if (!response) {
    //         await fetch(`https://api.github.com/repos/webapis/workflow_runner/forks`, { method: 'post', headers: { 'Authorization': `token ${access_token}`, 'Accept': 'application/vnd.github.v3+json' } })

    //         await responseHandler({ fbDatabase, publicData, privateData, filepath, emailVerified, federatedId, kind, needConfirmation, providerId, localId, email, oauthAccessToken, refreshToken, idToken, screenName, photoUrl, res, expiresIn })

    //     } else {
    //         const fetchPath = `https://api.github.com/repos/${screenName}/workflow_runner/merge-upstream`

    //         const response = await fetch(fetchPath, {
    //             method: 'post',
    //             headers: {
    //                 authorization: `token ${access_token}`,
    //                 Accept: 'application/vnd.github.v3+json'
    //             },
    //             body: JSON.stringify({ branch: 'main' })
    //         })

    //         const resData = await response.json()

    //         await responseHandler({ fbDatabase, publicData, privateData, filepath, emailVerified, federatedId, kind, needConfirmation, providerId, localId, email, oauthAccessToken, refreshToken, idToken, screenName, photoUrl, res, expiresIn })

    //     }




    // })



}
async function userIsNew({ localId, idToken }) {
    try {
        console.log('localId', localId)
        console.log('idToken', idToken)
        const response = await nodeFetch({ host: 'turkmenistan-market.firebaseio.com', path: `/users/private/${localId}/fb_auth.json?auth=${idToken}`, method: 'GET' })
        console.log('userisnew.....', response)
        return response
    } catch (error) {
        console.log('error', error)
        return error

    }
    // const fetchPath = `${this.projectUri}/${this.url}.json?auth=${this.idToken}`


}



// async function responseHandler({ fbDatabase, privateData, publicData, filepath, emailVerified, federatedId, kind, needConfirmation, providerId, localId, email, oauthAccessToken, refreshToken, idToken, screenName, photoUrl, res, expiresIn }) {
//     // fetch(`${this.projectUri}/${this.url}/.json?auth=${this.idToken}`, { method: 'PATCH', body: JSON.stringify(data) }).then(response => response.json()).then(data => {
//     const response = await nodeFetch({ host: 'turkmenistan-market.firebaseio.com', path: `/users/.json?auth=${idToken}`, method: 'PATCH', headers: {}, body: JSON.stringify({ [`private/${localId}/fb_auth`]: privateData, [`public/users/${screenName}`]: publicData }) })
//     debugger;
//     // fbDatabase.ref(`users`).update({ [`private/${localId}/fb_auth`]: privateData, [`public/users/${screenName}`]: publicData }, async (error, data) => {
//     //     const dom = await JSDOM.fromFile(filepath)
//     //     const document = dom.window.document;

//     //     var emailInput = document.createElement('input');
//     //     emailInput.setAttribute('type', 'hidden');
//     //     emailInput.setAttribute('id', 'email');
//     //     emailInput.setAttribute('value', email);
//     //     document.body.appendChild(emailInput);

//     //     var emailVerifiedInput = document.createElement('input');
//     //     emailVerifiedInput.setAttribute('type', 'hidden');
//     //     emailVerifiedInput.setAttribute('id', 'emailVerified');
//     //     emailVerifiedInput.setAttribute('value', emailVerified);
//     //     document.body.appendChild(emailVerifiedInput);

//     //     var federatedIdInput = document.createElement('input');
//     //     federatedIdInput.setAttribute('type', 'hidden');
//     //     federatedIdInput.setAttribute('id', 'federatedId');
//     //     federatedIdInput.setAttribute('value', federatedId);
//     //     document.body.appendChild(federatedIdInput);

//     //     var kindInput = document.createElement('input');
//     //     kindInput.setAttribute('type', 'hidden');
//     //     kindInput.setAttribute('id', 'kind');
//     //     kindInput.setAttribute('value', kind);
//     //     document.body.appendChild(kindInput);


//     //     var localIdInput = document.createElement('input');
//     //     localIdInput.setAttribute('type', 'hidden');
//     //     localIdInput.setAttribute('id', 'localId');
//     //     localIdInput.setAttribute('value', localId);
//     //     document.body.appendChild(localIdInput);


//     //     var needConfirmationInput = document.createElement('input');
//     //     needConfirmationInput.setAttribute('type', 'hidden');
//     //     needConfirmationInput.setAttribute('id', 'needConfirmation');
//     //     needConfirmationInput.setAttribute('value', needConfirmation);
//     //     document.body.appendChild(needConfirmationInput);


//     //     var oauthAccessTokenInput = document.createElement('input');
//     //     oauthAccessTokenInput.setAttribute('type', 'hidden');
//     //     oauthAccessTokenInput.setAttribute('id', 'oauthAccessToken');
//     //     oauthAccessTokenInput.setAttribute('value', oauthAccessToken);
//     //     document.body.appendChild(oauthAccessTokenInput);


//     //     var photoUrlInput = document.createElement('input');
//     //     photoUrlInput.setAttribute('type', 'hidden');
//     //     photoUrlInput.setAttribute('id', 'photoUrl');
//     //     photoUrlInput.setAttribute('value', photoUrl);
//     //     document.body.appendChild(photoUrlInput);

//     //     var providerIdInput = document.createElement('input');
//     //     providerIdInput.setAttribute('type', 'hidden');
//     //     providerIdInput.setAttribute('id', 'providerId');
//     //     providerIdInput.setAttribute('value', providerId);
//     //     document.body.appendChild(providerIdInput);



//     //     var screenNameInput = document.createElement('input');
//     //     screenNameInput.setAttribute('type', 'hidden');
//     //     screenNameInput.setAttribute('id', 'screenName');
//     //     screenNameInput.setAttribute('value', screenName);
//     //     document.body.appendChild(screenNameInput);

//     //     var idTokenInput = document.createElement('input');
//     //     idTokenInput.setAttribute('type', 'hidden');
//     //     idTokenInput.setAttribute('id', 'idToken');
//     //     idTokenInput.setAttribute('value', idToken);
//     //     document.body.appendChild(idTokenInput);

//     //     var refreshTokenInput = document.createElement('input');
//     //     refreshTokenInput.setAttribute('type', 'hidden');
//     //     refreshTokenInput.setAttribute('id', 'refreshToken');
//     //     refreshTokenInput.setAttribute('value', refreshToken);
//     //     document.body.appendChild(refreshTokenInput);

//     //     var expiresInInput = document.createElement('input');
//     //     expiresInInput.setAttribute('type', 'hidden');
//     //     expiresInInput.setAttribute('id', 'expiresIn');
//     //     expiresInInput.setAttribute('value', expiresIn);
//     //     document.body.appendChild(expiresInInput);

//     //     const content = dom.serialize()

//     //     res.setHeader('Content-Type', 'text/html');
//     //     res.setHeader('Content-Length', Buffer.byteLength(content));
//     //     res.write(content)
//     //     res.end()


//     // })

// }



module.exports = { fetchGithubAccessToken, authWithFirebase, userIsNew, updateWorkflowRunner }



///

/*

    fbDatabase.ref(`users`).update({ [`private/${localId}/fb_auth`]: privateData, [`public/users/${screenName}`]: publicData }, async (error, data) => {
        const dom = await JSDOM.fromFile(filepath)
        const document = dom.window.document;

        var emailInput = document.createElement('input');
        emailInput.setAttribute('type', 'hidden');
        emailInput.setAttribute('id', 'email');
        emailInput.setAttribute('value', email);
        document.body.appendChild(emailInput);

        var emailVerifiedInput = document.createElement('input');
        emailVerifiedInput.setAttribute('type', 'hidden');
        emailVerifiedInput.setAttribute('id', 'emailVerified');
        emailVerifiedInput.setAttribute('value', emailVerified);
        document.body.appendChild(emailVerifiedInput);

        var federatedIdInput = document.createElement('input');
        federatedIdInput.setAttribute('type', 'hidden');
        federatedIdInput.setAttribute('id', 'federatedId');
        federatedIdInput.setAttribute('value', federatedId);
        document.body.appendChild(federatedIdInput);

        var kindInput = document.createElement('input');
        kindInput.setAttribute('type', 'hidden');
        kindInput.setAttribute('id', 'kind');
        kindInput.setAttribute('value', kind);
        document.body.appendChild(kindInput);


        var localIdInput = document.createElement('input');
        localIdInput.setAttribute('type', 'hidden');
        localIdInput.setAttribute('id', 'localId');
        localIdInput.setAttribute('value', localId);
        document.body.appendChild(localIdInput);


        var needConfirmationInput = document.createElement('input');
        needConfirmationInput.setAttribute('type', 'hidden');
        needConfirmationInput.setAttribute('id', 'needConfirmation');
        needConfirmationInput.setAttribute('value', needConfirmation);
        document.body.appendChild(needConfirmationInput);


        var oauthAccessTokenInput = document.createElement('input');
        oauthAccessTokenInput.setAttribute('type', 'hidden');
        oauthAccessTokenInput.setAttribute('id', 'oauthAccessToken');
        oauthAccessTokenInput.setAttribute('value', oauthAccessToken);
        document.body.appendChild(oauthAccessTokenInput);


        var photoUrlInput = document.createElement('input');
        photoUrlInput.setAttribute('type', 'hidden');
        photoUrlInput.setAttribute('id', 'photoUrl');
        photoUrlInput.setAttribute('value', photoUrl);
        document.body.appendChild(photoUrlInput);

        var providerIdInput = document.createElement('input');
        providerIdInput.setAttribute('type', 'hidden');
        providerIdInput.setAttribute('id', 'providerId');
        providerIdInput.setAttribute('value', providerId);
        document.body.appendChild(providerIdInput);



        var screenNameInput = document.createElement('input');
        screenNameInput.setAttribute('type', 'hidden');
        screenNameInput.setAttribute('id', 'screenName');
        screenNameInput.setAttribute('value', screenName);
        document.body.appendChild(screenNameInput);

        var idTokenInput = document.createElement('input');
        idTokenInput.setAttribute('type', 'hidden');
        idTokenInput.setAttribute('id', 'idToken');
        idTokenInput.setAttribute('value', idToken);
        document.body.appendChild(idTokenInput);

        var refreshTokenInput = document.createElement('input');
        refreshTokenInput.setAttribute('type', 'hidden');
        refreshTokenInput.setAttribute('id', 'refreshToken');
        refreshTokenInput.setAttribute('value', refreshToken);
        document.body.appendChild(refreshTokenInput);

        var expiresInInput = document.createElement('input');
        expiresInInput.setAttribute('type', 'hidden');
        expiresInInput.setAttribute('id', 'expiresIn');
        expiresInInput.setAttribute('value', expiresIn);
        document.body.appendChild(expiresInInput);

        const content = dom.serialize()

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', Buffer.byteLength(content));
        res.write(content)
        res.end()


    })
*/