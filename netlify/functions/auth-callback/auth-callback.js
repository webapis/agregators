
const { fetchGithubAccessToken, authWithFirebase, updateUserCredentials } = require('../../../root/utils/github')
exports.handler = async (event, context) => {
    const { template } = require('../utils/loginPageTemplate')
    const code = event.queryStringParameters.code
    const client_secret = process.env.GH_CLIENT_SECRET
    const response = await fetchGithubAccessToken({ code: code, client_id: process.env.gh_client_id, client_secret })

    const { access_token } = JSON.parse(response)
    const firebaseauthResponse = await authWithFirebase({ access_token, key: process.env.webapikey })
    const firebaseAuthData = JSON.parse(firebaseauthResponse)
    await updateUserCredentials(firebaseAuthData)
    return {
        statusCode: 200, body: template({ ...firebaseAuthData, token: access_token })
    }

}




