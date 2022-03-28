require('dotenv').config()
require('./test')
const { nodeFetch } = require('../../../root/utils/nodejs/node-fetch')
const { fetchGithubAccessToken, authWithFirebase, updateUserCredentials } = require('../../../root/utils/github')

exports.handler = async (event, context) => {
    try {


        const { template } = require('../utils/loginPageTemplate')
        const { code } = event.queryStringParameters
        const client_secret = process.env.GH_CLIENT_SECRET

        const githubResponse = await fetchGithubAccessToken({ code: code, client_id: process.env.gh_client_id, client_secret })


        const gitResponseObject = JSON.parse(githubResponse)
        const { access_token } = gitResponseObject
        const firebaseauthResponse = await authWithFirebase({ access_token, key: process.env.webapikey })

        const firebaseAuthData = JSON.parse(firebaseauthResponse)
        debugger;

        const firebaseServerTimeResponse = await nodeFetch({ host: process.env.databaseHost, path: `/.json?auth=${firebaseAuthData.idToken}`, method: 'PUT', headers: {}, body: JSON.stringify({ inc: { ".sv": "timestamp" } }), port: process.env.dbPort, ssh: process.env.dbSsh })
        const { inc: timestamp } = JSON.parse(firebaseServerTimeResponse)
        debugger;
        await updateUserCredentials({ ...firebaseAuthData, timestamp, expiresIn: parseInt(firebaseAuthData.expiresIn) })
        
        return {
            statusCode: 200, body: template({ ...firebaseAuthData, token: access_token, timestamp, expiresIn: firebaseAuthData.expiresIn })
        }

    }
    catch (error) {
        console.log(error)

    }
}




