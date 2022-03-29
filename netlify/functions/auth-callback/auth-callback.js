require('dotenv').config()
require('./test')

const { fetchGithubAccessToken, authWithFirebase, updateUserCredentials } = require('../../../root/utils/github')

exports.handler = async (event, context) => {
    try {


        const { template } = require('../utils/loginPageTemplate')
        const { code } = event.queryStringParameters
        const client_secret = process.env.GH_CLIENT_SECRET
debugger;
        const githubResponse = await fetchGithubAccessToken({ code: code, client_id: process.env.gh_client_id, client_secret })

        const gitResponseObject = JSON.parse(githubResponse)
        const { access_token } = gitResponseObject
        const firebaseauthResponse = await authWithFirebase({ access_token, key: process.env.webapikey })
debugger;
        const firebaseAuthData = JSON.parse(firebaseauthResponse)
debugger;
        await updateUserCredentials(firebaseAuthData)
        
        return {
            statusCode: 200, body: template({ ...firebaseAuthData, token: access_token })
        }

    }
    catch (error) {
        console.log(error)

    }
}




