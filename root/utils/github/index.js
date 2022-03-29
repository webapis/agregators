

const https = require('https');

const { nodeFetch } = require('../nodejs/node-fetch')




async function fetchGithubAccessToken({ code, client_id, client_secret }) {

debugger;
    try {
        var options = {
            host: 'github.com',
            path: encodeURI(`/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`),
            method: 'POST',
            headers: { 'Accept': 'application/json' }
        };

        const prom = new Promise((resolve, reject) => {
            var request = https.request(options, function (responce) {
                var body = ''
                responce.on("data", function (chunk) {
                    body += chunk.toString('utf8')
                });
                responce.on("end", function () {

                    return resolve(body)
                });
                responce.on("error", function (error) {
                    console.log("error", error);
                    debugger
                    return reject(error)
                });
            });
            request.end();


        })

        return await prom
    } catch (error) {
debugger;
    }
}

async function authWithFirebase({ access_token, key }) {

    var options = {
        host: 'identitytoolkit.googleapis.com',
        path: encodeURI(`/v1/accounts:signInWithIdp?key=${key}`),
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'node-js' },

    };

    const prom = new Promise((resolve, reject) => {
        var request = https.request(options, function (responce) {
            var body = ''
            responce.on("data", function (chunk) {
                body += chunk.toString('utf8')
            });
            responce.on("end", function () {


                return resolve(body)
            });
            responce.on("error", function (error) {
                console.log("error", error);

                return reject(error)
            });
        });

        request.write(JSON.stringify({ postBody: `access_token=${access_token}&providerId=github.com`, requestUri: process.env.requestUri, returnIdpCredential: true, returnSecureToken: true }))
        request.end();

    })

    return await prom

}

async function updateWorkflowRunner({ access_token, userisOld, screenName }) {


    if (userisOld === "null") {

        return await nodeFetch({ host: 'api.github.com', path: '/repos/webapis/workflow_runner/forks', method: 'post', headers: { 'User-Agent': 'node.js', 'Authorization': `token ${access_token}`, 'Accept': 'application/vnd.github.v3+json' } })


    } else {

        return await nodeFetch({ host: 'api.github.com', path: `/repos/${screenName}/workflow_runner/merge-upstream`, method: 'post', headers: { 'User-Agent': 'node.js', 'Authorization': `token ${access_token}`, 'Accept': 'application/vnd.github.v3+json' }, body: JSON.stringify({ branch: 'main' }) })


    }




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



}

async function updateUserCredentials({ token: oauthAccessToken, refreshToken, idToken, screenName, email, localId,
     }) {
        const privateData = { token: oauthAccessToken, refreshToken, idToken, screenName, email }
        debugger;
        const response = await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'PATCH', headers: {}, body: JSON.stringify({ [`oauth/users/${localId}/firebase`]: privateData }), port: process.env.dbPort, ssh: process.env.dbSsh })
      //  const response = await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${idToken}`, method: 'PATCH', headers: {}, body: JSON.stringify({ [`oauth/users/${localId}/firebase`]: privateData }) })
        debugger;
        return response


}




module.exports = { fetchGithubAccessToken, authWithFirebase, userIsNew, updateWorkflowRunner, updateUserCredentials }



